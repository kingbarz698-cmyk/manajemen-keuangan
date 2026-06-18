import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon, ProgressBar, Button } from "@/components/ui";
import { formatRupiah, formatShort } from "@/utils/format";
import { calculateGoalProjection } from "@/services/goal.service";
import type { Goal } from "@/types";

export interface GoalDetailCardProps {
  goal: Goal;
  onContribute: () => void;
}

export const GoalDetailCard: FC<GoalDetailCardProps> = ({ goal, onContribute }) => {
  const { colors } = useTheme();
  const { estimatedMonthsRemaining } = calculateGoalProjection(goal);

  return (
    <Card className="p-[22px] mb-3.5">
      <div className="flex justify-between items-start mb-3.5">
        <div className="flex items-center gap-3">
          <div
            className="w-[52px] h-[52px] rounded-2xl border-3 border-ink flex items-center justify-center shadow-hard-sm"
            style={{ background: goal.color }}
          >
            <Icon name={goal.icon} size={24} />
          </div>
          <div>
            <h3 className="font-display font-bold text-lg m-0" style={{ color: colors.textPrimary }}>
              {goal.name}
            </h3>
            <p
              className="font-body text-[13px] m-0 flex items-center gap-1"
              style={{ color: colors.textSecondary }}
            >
              <Icon name="calendar" size={12} /> {goal.deadline}
            </p>
          </div>
        </div>
      </div>

      <div className="flex justify-between mb-2.5">
        <div>
          <p className="font-body text-xs m-0" style={{ color: colors.textSecondary }}>
            Terkumpul
          </p>
          <p
            className="font-display font-extrabold text-[22px] m-0 tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            {formatRupiah(goal.currentAmount)}
          </p>
        </div>
        <div className="text-right">
          <p className="font-body text-xs m-0" style={{ color: colors.textSecondary }}>
            Target
          </p>
          <p className="font-display font-bold text-base m-0" style={{ color: colors.textPrimary }}>
            {formatRupiah(goal.targetAmount)}
          </p>
        </div>
      </div>

      <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color="#9E7BFF" height={18} />

      <div className="flex justify-between items-center mt-3.5 pt-3.5 border-t-2 border-[rgba(17,17,17,0.08)]">
        <div className="border-2 border-ink rounded-xl px-3 py-1.5" style={{ background: goal.color }}>
          <span className="font-display font-bold text-xs text-ink">
            +{formatShort(goal.monthlyTarget)}/bln
          </span>
        </div>
        <span className="font-body text-[13px]" style={{ color: colors.textSecondary }}>
          {Number.isFinite(estimatedMonthsRemaining)
            ? `Selesai ~${estimatedMonthsRemaining} bulan lagi`
            : "Tetapkan target bulanan"}
        </span>
      </div>

      <Button bg="#9E7BFF" color="#FFFFFF" icon="plus" onClick={onContribute} className="w-full mt-3">
        Setor Tabungan
      </Button>
    </Card>
  );
};
