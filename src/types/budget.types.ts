/**
 * Budget domain types — PRD §16 BUDGET MANAGEMENT.
 *
 * PRD lists four features (Monthly Budget, Category Budget, Budget Tracking,
 * Budget Alert) and three statuses (Normal, Warning, Exceeded) but does not
 * specify numeric thresholds. The thresholds below are an explicit assumption,
 * not a value from the PRD — flagged here so it's easy to revisit:
 *   - Normal:   spent < 80% of budgeted amount
 *   - Warning:  spent >= 80% and <= 100%
 *   - Exceeded: spent > 100%
 */

import type { ExpenseCategoryKey } from "./transaction.types";

export type BudgetStatus = "normal" | "warning" | "exceeded";

export const BUDGET_WARNING_THRESHOLD = 0.8;
export const BUDGET_EXCEEDED_THRESHOLD = 1.0;

/**
 * A budget can be scoped to the whole month (Monthly Budget, no category)
 * or to a single expense category (Category Budget).
 */
export type BudgetScope = "monthly" | "category";

export interface Budget {
  id: string;
  userId: string;
  scope: BudgetScope;
  /** Only set when scope is "category". Monthly Budget covers all expense categories combined. */
  category?: ExpenseCategoryKey;
  /** Budgeted amount for the period (PRD doesn't specify period length beyond "Monthly Budget") */
  limitAmount: number;
  /** Month this budget applies to, formatted "YYYY-MM" */
  period: string;
}

export interface CreateBudgetInput {
  scope: BudgetScope;
  category?: ExpenseCategoryKey;
  limitAmount: number;
  period: string;
}

/** A budget combined with how much has actually been spent against it. */
export interface BudgetWithProgress extends Budget {
  spentAmount: number;
  remainingAmount: number;
  /** 0-100+, can exceed 100 when over budget */
  percentUsed: number;
  status: BudgetStatus;
}

export function calculateBudgetStatus(spentAmount: number, limitAmount: number): BudgetStatus {
  if (limitAmount <= 0) return "normal";
  const ratio = spentAmount / limitAmount;
  if (ratio > BUDGET_EXCEEDED_THRESHOLD) return "exceeded";
  if (ratio >= BUDGET_WARNING_THRESHOLD) return "warning";
  return "normal";
}

export function buildBudgetProgress(budget: Budget, spentAmount: number): BudgetWithProgress {
  const percentUsed = budget.limitAmount > 0 ? (spentAmount / budget.limitAmount) * 100 : 0;
  return {
    ...budget,
    spentAmount,
    remainingAmount: budget.limitAmount - spentAmount,
    percentUsed,
    status: calculateBudgetStatus(spentAmount, budget.limitAmount),
  };
}

export const BUDGET_STATUS_LABEL: Record<BudgetStatus, string> = {
  normal: "Normal",
  warning: "Waspada",
  exceeded: "Terlampaui",
};
