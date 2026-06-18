import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon, ProgressBar } from "@/components/ui";
import { getCategoryByKey } from "@/utils/categories";
import { getBudgetStatusVisual } from "@/utils/budgetStatus";
import { formatRupiah, formatShort } from "@/utils/format";
import type { BudgetWithProgress } from "@/types";
import { BudgetStatusBadge } from "./BudgetStatusBadge";

export interface BudgetProgressCardProps {
  budget: BudgetWithProgress;
  onClick?: () => void;
}

export const BudgetProgressCard: FC<BudgetProgressCardProps> = ({ budget, onClick }) => {
  const { colors } = useTheme();
  const visual = getBudgetStatusVisual(budget.status);
  const category = budget.category ? getCategoryByKey(budget.category) : undefined;

  const title = budget.scope === "monthly" ? "Anggaran Bulanan" : category?.label ?? "Kategori";
  const icon = budget.scope === "monthly" ? "wallet" : category?.icon ?? "money";
  const badgeBg = budget.scope === "monthly" ? "#111111" : category?.color ?? colors.surfaceContainer;

  return (
    <Card onClick={onClick} className="p-[18px] mb-3">
      <div className="flex justify-between items-start mb-3.5">
        <div className="flex gap-3 items-center">
          <div
            className="w-11 h-11 rounded-2xl border-3 border-ink flex items-center justify-center shadow-hard-sm"
            style={{ background: badgeBg, color: budget.scope === "monthly" ? "#FFFFFF" : colors.textPrimary }}
          >
            <Icon name={icon} size={20} />
          </div>
          <div>
            <p className="font-display font-bold text-base m-0" style={{ color: colors.textPrimary }}>
              {title}
            </p>
            <p className="font-body text-[13px] m-0" style={{ color: colors.textSecondary }}>
              {formatRupiah(budget.spentAmount)} / {formatRupiah(budget.limitAmount)}
            </p>
          </div>
        </div>
        <BudgetStatusBadge status={budget.status} />
      </div>

      <ProgressBar value={budget.spentAmount} max={budget.limitAmount} color={visual.accentBg} height={16} />

      <div className="flex justify-between mt-2.5">
        <span className="font-body text-xs" style={{ color: colors.textSecondary }}>
          {budget.percentUsed.toFixed(0)}% terpakai
        </span>
        <span
          className="font-display font-bold text-xs"
          style={{ color: budget.remainingAmount < 0 ? "#FF6B6B" : colors.textSecondary }}
        >
          {budget.remainingAmount >= 0
            ? `Sisa ${formatShort(budget.remainingAmount)}`
            : `Lebih ${formatShort(Math.abs(budget.remainingAmount))}`}
        </span>
      </div>
    </Card>
  );
};
