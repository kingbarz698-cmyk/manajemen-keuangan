import type { CategoryOption, CategoryKey } from "@/types";

/** Income categories — PRD §13 INCOME MANAGEMENT */
export const INCOME_CATEGORIES: CategoryOption[] = [
  { key: "parent_allowance", label: "Parent Allowance", icon: "money", color: "#63fea7" },
  { key: "freelance", label: "Freelance", icon: "laptop", color: "#63fea7" },
  { key: "bonus", label: "Bonus", icon: "star", color: "#FFD84D" },
  { key: "thr", label: "THR", icon: "gift", color: "#FFD84D" },
  { key: "business", label: "Business", icon: "briefcase", color: "#9ED9FF" },
  { key: "investment", label: "Investment", icon: "trendUp", color: "#9ED9FF" },
  { key: "income_others", label: "Others", icon: "dots", color: "#e5e2e1" },
];

/** Expense categories — PRD §14 EXPENSE MANAGEMENT */
export const EXPENSE_CATEGORIES: CategoryOption[] = [
  { key: "food", label: "Food", icon: "food", color: "#FFB547" },
  { key: "transportation", label: "Transportation", icon: "transport", color: "#9ED9FF" },
  { key: "education", label: "Education", icon: "graduation", color: "#c1abff" },
  { key: "internet", label: "Internet", icon: "internet", color: "#9ED9FF" },
  { key: "shopping", label: "Shopping", icon: "shopping", color: "#c1abff" },
  { key: "entertainment", label: "Entertainment", icon: "film", color: "#FFD84D" },
  { key: "health", label: "Health", icon: "health", color: "#ffdad6" },
  { key: "expense_others", label: "Others", icon: "dots", color: "#e5e2e1" },
];

const ALL_CATEGORIES: CategoryOption[] = [...INCOME_CATEGORIES, ...EXPENSE_CATEGORIES];

const CATEGORY_MAP: Record<CategoryKey, CategoryOption> = ALL_CATEGORIES.reduce(
  (acc, cat) => {
    acc[cat.key] = cat;
    return acc;
  },
  {} as Record<CategoryKey, CategoryOption>
);

export function getCategoryByKey(key: CategoryKey): CategoryOption | undefined {
  return CATEGORY_MAP[key];
}
