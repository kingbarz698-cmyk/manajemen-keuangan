import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import type { TransactionFilter } from "@/types";

export interface FilterTabsProps {
  value: TransactionFilter;
  onChange: (filter: TransactionFilter) => void;
}

const FILTER_OPTIONS: Array<{ key: TransactionFilter; label: string }> = [
  { key: "all", label: "Semua" },
  { key: "income", label: "Pemasukan" },
  { key: "expense", label: "Pengeluaran" },
];

export const FilterTabs: FC<FilterTabsProps> = ({ value, onChange }) => {
  const { colors } = useTheme();

  return (
    <div className="flex gap-2 mb-5 overflow-x-auto pb-1">
      {FILTER_OPTIONS.map((opt) => {
        const isActive = value === opt.key;
        return (
          <button
            key={opt.key}
            onClick={() => onChange(opt.key)}
            className={`px-[18px] py-2.5 rounded-pill border-3 border-ink font-display font-bold text-sm
              cursor-pointer whitespace-nowrap flex-shrink-0 shadow-[3px_3px_0_#11111166]
              ${isActive ? "bg-ink text-white" : ""}`}
            style={isActive ? undefined : { background: colors.surface, color: colors.textPrimary }}
          >
            {opt.label}
          </button>
        );
      })}
    </div>
  );
};
