import type { FC } from "react";
import { Card, Icon } from "@/components/ui";
import type { BudgetWithProgress } from "@/types";

export interface BudgetAlertBannerProps {
  budgets: BudgetWithProgress[];
  /** Tied to Settings > Peringatan Anggaran toggle (PRD §16 Budget Alert) */
  alertsEnabled: boolean;
}

/**
 * PRD §16 Budget Alert: surfaces a visible warning when any budget is in
 * Warning or Exceeded status. Hidden entirely when the user has turned off
 * budget alerts in Settings.
 */
export const BudgetAlertBanner: FC<BudgetAlertBannerProps> = ({ budgets, alertsEnabled }) => {
  if (!alertsEnabled) return null;

  const exceededCount = budgets.filter((b) => b.status === "exceeded").length;
  const warningCount = budgets.filter((b) => b.status === "warning").length;

  if (exceededCount === 0 && warningCount === 0) return null;

  const isExceeded = exceededCount > 0;
  const message = isExceeded
    ? `${exceededCount} anggaran sudah terlampaui`
    : `${warningCount} anggaran mendekati batas`;

  return (
    <Card bg={isExceeded ? "#FF6B6B" : "#ffe07e"} className="p-4 mb-4 flex items-center gap-3">
      <div className="w-10 h-10 rounded-pill border-2 border-ink bg-white flex items-center justify-center flex-shrink-0">
        <Icon name="bell" size={18} />
      </div>
      <p
        className={`font-display font-bold text-sm m-0 ${isExceeded ? "text-white" : ""}`}
        style={isExceeded ? undefined : { color: "#564500" }}
      >
        {message}
      </p>
    </Card>
  );
};
