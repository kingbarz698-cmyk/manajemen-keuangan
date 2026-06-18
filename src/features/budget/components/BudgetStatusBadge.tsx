import type { FC } from "react";
import { Icon } from "@/components/ui";
import { getBudgetStatusVisual } from "@/utils/budgetStatus";
import type { BudgetStatus } from "@/types";

export interface BudgetStatusBadgeProps {
  status: BudgetStatus;
}

export const BudgetStatusBadge: FC<BudgetStatusBadgeProps> = ({ status }) => {
  const visual = getBudgetStatusVisual(status);

  return (
    <div
      className="inline-flex items-center gap-1.5 border-2 border-ink rounded-pill px-2.5 py-1"
      style={{ background: visual.accentBg }}
    >
      <Icon name={visual.icon} size={12} strokeWidth={3} />
      <span className="font-display font-bold text-[11px] uppercase tracking-wide" style={{ color: visual.accentText }}>
        {visual.label}
      </span>
    </div>
  );
};
