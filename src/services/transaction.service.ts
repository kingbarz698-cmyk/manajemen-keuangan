import {
  collection,
  query,
  where,
  getDocs,
  addDoc,
  serverTimestamp,
  Timestamp,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { adjustWalletBalance, getWalletById } from "./wallet.service";
import type { Transaction, CreateTransactionInput, CategoryKey } from "@/types";

/**
 * Transaction service backed by real Firestore.
 *
 * PRD §31 specifies two separate collections, `income` and `expenses`, rather
 * than one combined `transactions` collection. The app's UI/types model both
 * as a single `Transaction` shape (distinguished by `type`), so this service
 * is the seam: it reads from both collections and merges them, and writes to
 * whichever collection matches the transaction's type.
 */

interface TransactionDocShape {
  userId?: string;
  walletId?: string;
  category?: CategoryKey;
  amount?: number;
  date?: string;
  note?: string;
  attachmentUrl?: string;
  createdAt?: unknown;
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("Tidak ada pengguna yang sedang masuk");
  }
  return uid;
}

function collectionNameFor(type: "income" | "expense"): "income" | "expenses" {
  return type === "income" ? "income" : "expenses";
}

function docToTransaction(
  id: string,
  data: DocumentData,
  type: "income" | "expense",
  walletName: string,
  createdAtIso: string
): Transaction & { _createdAtIso: string } {
  const d = data as TransactionDocShape;
  const createdDate = new Date(createdAtIso);
  return {
    id,
    userId: d.userId ?? "",
    walletId: d.walletId ?? "",
    walletName,
    type,
    category: d.category ?? (type === "income" ? "income_others" : "expense_others"),
    name: d.note || "Transaksi",
    amount: d.amount ?? 0,
    date: d.date ?? "Hari ini",
    time: createdDate.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    note: d.note,
    attachmentUrl: d.attachmentUrl,
    _createdAtIso: createdAtIso,
  };
}

function timestampToIso(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  return new Date().toISOString();
}

async function fetchOneCollection(
  collectionName: "income" | "expenses",
  type: "income" | "expense",
  uid: string
): Promise<Array<Transaction & { _createdAtIso: string }>> {
  const walletNameCache = new Map<string, string>();
  const q = query(collection(db, collectionName), where("userId", "==", uid));
  const snapshot = await getDocs(q);

  const results: Array<Transaction & { _createdAtIso: string }> = [];
  for (const docSnap of snapshot.docs) {
    const data = docSnap.data() as TransactionDocShape;
    const walletId = data.walletId ?? "";

    let walletName = walletNameCache.get(walletId);
    if (walletName === undefined) {
      const wallet = await getWalletById(walletId);
      walletName = wallet?.name ?? "Dompet Tidak Diketahui";
      walletNameCache.set(walletId, walletName);
    }

    results.push(
      docToTransaction(docSnap.id, data, type, walletName, timestampToIso(data.createdAt))
    );
  }
  return results;
}

export async function getTransactions(): Promise<Transaction[]> {
  const uid = requireUid();
  const [incomeTxs, expenseTxs] = await Promise.all([
    fetchOneCollection("income", "income", uid),
    fetchOneCollection("expenses", "expense", uid),
  ]);
  // Sort newest-first by actual creation timestamp, not by Firestore's random doc id.
  return [...incomeTxs, ...expenseTxs]
    .sort((a, b) => (a._createdAtIso < b._createdAtIso ? 1 : -1))
    .map(({ _createdAtIso, ...transaction }) => transaction);
}

export async function createTransaction(input: CreateTransactionInput): Promise<Transaction> {
  const uid = requireUid();
  const wallet = await getWalletById(input.walletId);
  const collectionName = collectionNameFor(input.type);

  const newDocData = {
    userId: uid,
    walletId: input.walletId,
    category: input.category,
    amount: input.amount,
    date: input.date || "Hari ini",
    note: input.note,
    createdAt: serverTimestamp(),
  };

  const docRef = await addDoc(collection(db, collectionName), newDocData);

  // Keep the wallet's balance and transaction count in sync with actual transaction history.
  const balanceDelta = input.type === "income" ? input.amount : -input.amount;
  await adjustWalletBalance(input.walletId, balanceDelta, 1);

  const nowIso = new Date().toISOString();
  return {
    id: docRef.id,
    userId: uid,
    walletId: input.walletId,
    walletName: wallet?.name ?? "Dompet Tidak Diketahui",
    type: input.type,
    category: input.category,
    name: input.note || "Transaksi",
    amount: input.amount,
    date: input.date || "Hari ini",
    time: new Date(nowIso).toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    note: input.note,
  };
}

export async function getTotalIncome(): Promise<number> {
  const txs = await getTransactions();
  return txs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0);
}

export async function getTotalExpense(): Promise<number> {
  const txs = await getTransactions();
  return txs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0);
}
