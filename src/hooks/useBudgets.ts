import { useState, useEffect, useCallback, useMemo } from "react";
import type { BudgetWithProgress, CreateBudgetInput } from "@/types";
import * as budgetService from "@/services/budget.service";

interface UseBudgetsResult {
  budgets: BudgetWithProgress[];
  monthlyBudget: BudgetWithProgress | undefined;
  categoryBudgets: BudgetWithProgress[];
  hasExceededBudget: boolean;
  hasWarningBudget: boolean;
  isLoading: boolean;
  error: string | null;
  addBudget: (input: CreateBudgetInput) => Promise<void>;
  removeBudget: (id: string) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useBudgets(): UseBudgetsResult {
  const [budgets, setBudgets] = useState<BudgetWithProgress[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBudgets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await budgetService.getBudgetsWithProgress();
      setBudgets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat anggaran");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchBudgets();
  }, [fetchBudgets]);

  const addBudget = useCallback(
    async (input: CreateBudgetInput) => {
      await budgetService.createBudget(input);
      await fetchBudgets();
    },
    [fetchBudgets]
  );

  const removeBudget = useCallback(
    async (id: string) => {
      await budgetService.deleteBudget(id);
      await fetchBudgets();
    },
    [fetchBudgets]
  );

  const monthlyBudget = useMemo(() => budgets.find((b) => b.scope === "monthly"), [budgets]);
  const categoryBudgets = useMemo(() => budgets.filter((b) => b.scope === "category"), [budgets]);
  const hasExceededBudget = useMemo(() => budgets.some((b) => b.status === "exceeded"), [budgets]);
  const hasWarningBudget = useMemo(() => budgets.some((b) => b.status === "warning"), [budgets]);

  return {
    budgets,
    monthlyBudget,
    categoryBudgets,
    hasExceededBudget,
    hasWarningBudget,
    isLoading,
    error,
    addBudget,
    removeBudget,
    refetch: fetchBudgets,
  };
}
