import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useGoals } from "@/hooks/useGoals";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui";
import { GoalsSummaryHero } from "@/features/goals/components/GoalsSummaryHero";
import { GoalDetailCard } from "@/features/goals/components/GoalDetailCard";
import { ContributeToGoalModal } from "@/features/goals/components/ContributeToGoalModal";
import { CreateGoalModal } from "@/features/goals/components/CreateGoalModal";
import type { Goal } from "@/types";

export const GoalsPage: FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedGoal, setSelectedGoal] = useState<Goal | null>(null);
  const { colors } = useTheme();

  const { goals, totalTarget, totalCurrent, isLoading: goalsLoading, addGoal, contribute } = useGoals();
  const { wallets, isLoading: walletsLoading } = useWallets();

  const isLoading = goalsLoading || walletsLoading;

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      <div className="flex justify-between items-center pt-14 mb-5">
        <h1
          className="font-display font-extrabold text-[30px] m-0 tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          Target
        </h1>
        <Button bg="#9E7BFF" color="#FFFFFF" icon="plus" onClick={() => setShowAddModal(true)}>
          Buat
        </Button>
      </div>

      {isLoading ? (
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Memuat data...
        </p>
      ) : (
        <>
          <GoalsSummaryHero totalTarget={totalTarget} totalCurrent={totalCurrent} />

          {goals.length === 0 ? (
            <p className="font-body text-sm text-center py-8" style={{ color: colors.textSecondary }}>
              Belum ada target. Buat target tabungan pertamamu untuk mulai menabung dengan tujuan.
            </p>
          ) : (
            goals.map((goal) => (
              <GoalDetailCard key={goal.id} goal={goal} onContribute={() => setSelectedGoal(goal)} />
            ))
          )}
        </>
      )}

      {selectedGoal && (
        <ContributeToGoalModal
          goal={selectedGoal}
          wallets={wallets}
          onClose={() => setSelectedGoal(null)}
          onSubmit={contribute}
        />
      )}

      {showAddModal && <CreateGoalModal onClose={() => setShowAddModal(false)} onSubmit={addGoal} />}
    </div>
  );
};
