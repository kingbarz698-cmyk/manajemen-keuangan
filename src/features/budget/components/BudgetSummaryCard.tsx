import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon } from "@/components/ui";
import { getBudgetStatusVisual } from "@/utils/budgetStatus";
import type { BudgetWithProgress } from "@/types";

export interface BudgetSummaryCardProps {
  budgets: BudgetWithProgress[];
  onClick?: () => void;
}

/**
 * Aggregate status across all budgets: worst-case wins (Exceeded > Warning > Normal),
 * so the Dashboard surfaces the most urgent thing the user needs to know.
 */
function getAggregateStatus(budgets: BudgetWithProgress[]): "normal" | "warning" | "exceeded" | "none" {
  if (budgets.length === 0) return "none";
  if (budgets.some((b) => b.status === "exceeded")) return "exceeded";
  if (budgets.some((b) => b.status === "warning")) return "warning";
  return "normal";
}

export const BudgetSummaryCard: FC<BudgetSummaryCardProps> = ({ budgets, onClick }) => {
  const { colors } = useTheme();
  const aggregateStatus = getAggregateStatus(budgets);

  if (aggregateStatus === "none") {
    return (
      <Card onClick={onClick} className="p-4">
        <p
          className="font-display text-[11px] font-bold uppercase tracking-wide mb-1.5"
          style={{ color: colors.textSecondary }}
        >
          Anggaran
        </p>
        <p className="font-display font-extrabold text-[15px] m-0" style={{ color: colors.textPrimary }}>
          Belum ada
        </p>
        <p className="font-body text-xs m-0" style={{ color: colors.textSecondary }}>
          Ketuk untuk buat
        </p>
      </Card>
    );
  }

  const visual = getBudgetStatusVisual(aggregateStatus);
  const exceededCount = budgets.filter((b) => b.status === "exceeded").length;
  const warningCount = budgets.filter((b) => b.status === "warning").length;

  return (
    <Card bg={visual.accentBg} onClick={onClick} className="p-4">
      <div className="flex items-center justify-between mb-1.5">
        <p
          className="font-display text-[11px] font-bold uppercase tracking-wide"
          style={{ color: visual.accentText }}
        >
          Anggaran
        </p>
        <Icon name={visual.icon} size={16} />
      </div>
      <p className="font-display font-extrabold text-[22px] m-0 tracking-tight" style={{ color: visual.accentText }}>
        {visual.label}
      </p>
      <p className="font-body text-xs m-0" style={{ color: visual.accentText }}>
        {exceededCount > 0
          ? `${exceededCount} terlampaui`
          : warningCount > 0
            ? `${warningCount} mendekati batas`
            : "Semua terkendali"}
      </p>
    </Card>
  );
};
