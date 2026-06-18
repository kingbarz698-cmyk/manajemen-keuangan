import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  addDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type { Wallet, CreateWalletInput, WalletType } from "@/types";

/**
 * Wallet service backed by real Firestore (`wallets` collection).
 * Every read query filters by `userId == currentUser.uid` — this is required
 * both for correctness (so users only ever see their own wallets) and because
 * Firestore Security Rules reject any query that isn't provably scoped this way.
 */

interface WalletDocShape {
  userId?: string;
  type?: WalletType;
  name?: string;
  balance?: number;
  transactionCount?: number;
  color?: string;
  createdAt?: unknown;
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("Tidak ada pengguna yang sedang masuk");
  }
  return uid;
}

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

function docToWallet(id: string, data: DocumentData): Wallet {
  const d = data as WalletDocShape;
  return {
    id,
    userId: d.userId ?? "",
    type: d.type ?? "cash",
    name: d.name ?? "",
    balance: d.balance ?? 0,
    transactionCount: d.transactionCount ?? 0,
    color: d.color ?? "#DFF8EE",
    createdAt: timestampToIso(d.createdAt),
  };
}

export async function getWallets(): Promise<Wallet[]> {
  const uid = requireUid();
  const walletsQuery = query(collection(db, "wallets"), where("userId", "==", uid));
  const snapshot = await getDocs(walletsQuery);
  return snapshot.docs.map((d) => docToWallet(d.id, d.data()));
}

export async function getWalletById(id: string): Promise<Wallet | undefined> {
  const snapshot = await getDoc(doc(db, "wallets", id));
  if (!snapshot.exists()) return undefined;
  return docToWallet(snapshot.id, snapshot.data());
}

export async function createWallet(input: CreateWalletInput): Promise<Wallet> {
  const uid = requireUid();
  const newWalletData = {
    userId: uid,
    type: input.type,
    name: input.name,
    balance: input.balance,
    transactionCount: 0,
    color: "#DFF8EE",
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "wallets"), newWalletData);
  return {
    id: docRef.id,
    userId: uid,
    type: input.type,
    name: input.name,
    balance: input.balance,
    transactionCount: 0,
    color: "#DFF8EE",
    createdAt: new Date().toISOString(),
  };
}

export async function getTotalBalance(): Promise<number> {
  const wallets = await getWallets();
  return wallets.reduce((sum, w) => sum + w.balance, 0);
}

/**
 * Atomically adjusts a wallet's balance and transaction count.
 * Used by transaction.service when a new transaction is created or deleted,
 * so the wallet's balance always reflects its actual transaction history
 * instead of drifting out of sync.
 *
 * `delta` is signed: positive for income (balance goes up), negative for
 * expense (balance goes down). `countDelta` is usually +1 (new transaction)
 * or -1 (deleted transaction).
 */
export async function adjustWalletBalance(
  walletId: string,
  balanceDelta: number,
  countDelta: number
): Promise<void> {
  const walletRef = doc(db, "wallets", walletId);
  await runTransaction(db, async (firestoreTransaction) => {
    const snapshot = await firestoreTransaction.get(walletRef);
    if (!snapshot.exists()) {
      throw new Error("Dompet tidak ditemukan");
    }
    const data = snapshot.data() as WalletDocShape;
    const currentBalance = data.balance ?? 0;
    const currentCount = data.transactionCount ?? 0;
    firestoreTransaction.update(walletRef, {
      balance: currentBalance + balanceDelta,
      transactionCount: currentCount + countDelta,
    });
  });
}
