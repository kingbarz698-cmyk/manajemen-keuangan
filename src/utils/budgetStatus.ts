import type { BudgetStatus } from "@/types";
import type { IconName } from "@/components/ui/Icon";

export interface BudgetStatusVisual {
  /** Static accent background for badges/progress fill — same in light & dark mode */
  accentBg: string;
  /** Text color used on top of accentBg (always dark ink, since all three accents are light pastels) */
  accentText: string;
  icon: IconName;
  label: string;
}

export const BUDGET_STATUS_VISUAL: Record<BudgetStatus, BudgetStatusVisual> = {
  normal: {
    accentBg: "#63fea7",
    accentText: "#00542e",
    icon: "check",
    label: "Normal",
  },
  warning: {
    accentBg: "#ffe07e",
    accentText: "#564500",
    icon: "bell",
    label: "Waspada",
  },
  exceeded: {
    accentBg: "#FF6B6B",
    accentText: "#FFFFFF",
    icon: "x",
    label: "Terlampaui",
  },
};

export function getBudgetStatusVisual(status: BudgetStatus): BudgetStatusVisual {
  return BUDGET_STATUS_VISUAL[status];
}
