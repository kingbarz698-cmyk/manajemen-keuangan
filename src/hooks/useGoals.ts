import { useState, useEffect, useCallback } from "react";
import type { Goal, CreateGoalInput, ContributeToGoalInput } from "@/types";
import * as goalService from "@/services/goal.service";

interface UseGoalsResult {
  goals: Goal[];
  totalTarget: number;
  totalCurrent: number;
  isLoading: boolean;
  error: string | null;
  addGoal: (input: CreateGoalInput) => Promise<void>;
  contribute: (input: ContributeToGoalInput) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useGoals(): UseGoalsResult {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGoals = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await goalService.getGoals();
      setGoals(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat target");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchGoals();
  }, [fetchGoals]);

  const addGoal = useCallback(
    async (input: CreateGoalInput) => {
      await goalService.createGoal(input);
      await fetchGoals();
    },
    [fetchGoals]
  );

  const contribute = useCallback(
    async (input: ContributeToGoalInput) => {
      await goalService.contributeToGoal(input);
      await fetchGoals();
    },
    [fetchGoals]
  );

  const totalTarget = goals.reduce((sum, g) => sum + g.targetAmount, 0);
  const totalCurrent = goals.reduce((sum, g) => sum + g.currentAmount, 0);

  return { goals, totalTarget, totalCurrent, isLoading, error, addGoal, contribute, refetch: fetchGoals };
}
