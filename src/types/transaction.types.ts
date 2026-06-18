/**
 * Transaction domain types (income & expense).
 * Mirrors Firestore collections `income/{incomeId}` and `expenses/{expenseId}` per PRD §31.
 */

import type { IconName } from "@/components/ui/Icon";

export type TransactionType = "income" | "expense";

/** Income categories — PRD §13 */
export type IncomeCategoryKey =
  | "parent_allowance"
  | "freelance"
  | "bonus"
  | "thr"
  | "business"
  | "investment"
  | "income_others";

/** Expense categories — PRD §14 */
export type ExpenseCategoryKey =
  | "food"
  | "transportation"
  | "education"
  | "internet"
  | "shopping"
  | "entertainment"
  | "health"
  | "expense_others";

export type CategoryKey = IncomeCategoryKey | ExpenseCategoryKey;

export interface CategoryOption {
  key: CategoryKey;
  label: string;
  /** Icon name registered in the Icon component */
  icon: IconName;
  /** Static accent color (hex) for the category badge */
  color: string;
}

export interface Transaction {
  id: string;
  userId: string;
  walletId: string;
  /** Denormalized wallet name for display without an extra lookup */
  walletName: string;
  type: TransactionType;
  category: CategoryKey;
  name: string;
  amount: number;
  date: string;
  time: string;
  note?: string;
  attachmentUrl?: string;
}

export interface CreateTransactionInput {
  type: TransactionType;
  walletId: string;
  category: CategoryKey;
  amount: number;
  note: string;
  date: string;
}

export interface TransactionFormState {
  type: TransactionType;
  walletId: string;
  category: CategoryKey | "";
  amount: string;
  note: string;
  date: string;
}

export type TransactionFilter = "all" | TransactionType;
