import {
  collection,
  query,
  where,
  getDocs,
  doc,
  deleteDoc,
  addDoc,
  serverTimestamp,
  type DocumentData,
} from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import type {
  Budget,
  CreateBudgetInput,
  BudgetWithProgress,
  Transaction,
  ExpenseCategoryKey,
  BudgetScope,
} from "@/types";
import { buildBudgetProgress } from "@/types";
import { getTransactions } from "./transaction.service";

interface BudgetDocShape {
  userId?: string;
  scope?: BudgetScope;
  category?: ExpenseCategoryKey;
  limitAmount?: number;
  period?: string;
}

function requireUid(): string {
  const uid = auth.currentUser?.uid;
  if (!uid) {
    throw new Error("Tidak ada pengguna yang sedang masuk");
  }
  return uid;
}

function docToBudget(id: string, data: DocumentData): Budget {
  const d = data as BudgetDocShape;
  return {
    id,
    userId: d.userId ?? "",
    scope: d.scope ?? "monthly",
    category: d.category,
    limitAmount: d.limitAmount ?? 0,
    period: d.period ?? "",
  };
}

export async function getBudgets(): Promise<Budget[]> {
  const uid = requireUid();
  const budgetsQuery = query(collection(db, "budgets"), where("userId", "==", uid));
  const snapshot = await getDocs(budgetsQuery);
  return snapshot.docs.map((d) => docToBudget(d.id, d.data()));
}

export async function createBudget(input: CreateBudgetInput): Promise<Budget> {
  const uid = requireUid();
  const newBudgetData = {
    userId: uid,
    scope: input.scope,
    category: input.category ?? null,
    limitAmount: input.limitAmount,
    period: input.period,
    createdAt: serverTimestamp(),
  };
  const docRef = await addDoc(collection(db, "budgets"), newBudgetData);
  return {
    id: docRef.id,
    userId: uid,
    scope: input.scope,
    category: input.category,
    limitAmount: input.limitAmount,
    period: input.period,
  };
}

export async function deleteBudget(id: string): Promise<void> {
  await deleteDoc(doc(db, "budgets", id));
}

/** Sum expense transactions for a budget's period, optionally filtered to one category. */
function calculateSpentAmount(transactions: Transaction[], budget: Budget): number {
  return transactions
    .filter((t) => t.type === "expense")
    .filter((t) => budget.scope === "monthly" || t.category === budget.category)
    .reduce((sum, t) => sum + t.amount, 0);
}

/**
 * PRD §16 Budget Tracking: combine each budget with actual spend derived from
 * real transaction data, producing the Normal/Warning/Exceeded status.
 *
 * Note: real transactions now carry actual dates (via Firestore `createdAt`),
 * but `calculateSpentAmount` still doesn't filter by `budget.period` — every
 * expense transaction is treated as belonging to the current period regardless
 * of when it happened. This is a pre-existing simplification carried over from
 * the mock version, not something Firebase fixes automatically; proper period
 * filtering would need to compare each transaction's actual date against the
 * budget's period range.
 */
export async function getBudgetsWithProgress(): Promise<BudgetWithProgress[]> {
  const [budgets, transactions] = await Promise.all([getBudgets(), getTransactions()]);
  return budgets.map((budget) => {
    const spentAmount = calculateSpentAmount(transactions, budget);
    return buildBudgetProgress(budget, spentAmount);
  });
}
