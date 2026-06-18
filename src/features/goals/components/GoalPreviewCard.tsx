import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon, ProgressBar } from "@/components/ui";
import { formatShort } from "@/utils/format";
import type { Goal } from "@/types";

export interface GoalPreviewCardProps {
  goal: Goal;
  onClick?: () => void;
}

export const GoalPreviewCard: FC<GoalPreviewCardProps> = ({ goal, onClick }) => {
  const { colors } = useTheme();

  return (
    <Card onClick={onClick} className="p-[18px] mb-3">
      <div className="flex justify-between items-start mb-3">
        <div className="flex gap-3 items-center">
          <div
            className="w-11 h-11 rounded-2xl border-3 border-ink flex items-center justify-center shadow-hard-sm"
            style={{ background: goal.color }}
          >
            <Icon name={goal.icon} size={22} />
          </div>
          <div>
            <p className="font-display font-bold text-base m-0" style={{ color: colors.textPrimary }}>
              {goal.name}
            </p>
            <p className="font-body text-[13px] m-0" style={{ color: colors.textSecondary }}>
              {goal.deadline}
            </p>
          </div>
        </div>
        <div className="text-right">
          <p className="font-display font-extrabold text-[15px] m-0" style={{ color: colors.textPrimary }}>
            {formatShort(goal.currentAmount)}
          </p>
          <p className="font-body text-xs m-0" style={{ color: colors.textSecondary }}>
            / {formatShort(goal.targetAmount)}
          </p>
        </div>
      </div>
      <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color="#27D17F" height={16} />
    </Card>
  );
};
