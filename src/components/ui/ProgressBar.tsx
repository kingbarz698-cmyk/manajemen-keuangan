import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export interface ProgressBarProps {
  value: number;
  max: number;
  color?: string;
  height?: number;
}

export const ProgressBar: FC<ProgressBarProps> = ({ value, max, color = "#27D17F", height = 20 }) => {
  const { colors } = useTheme();
  const pct = Math.min(100, max > 0 ? (value / max) * 100 : 0);

  return (
    <div
      className="rounded-pill border-3 border-ink overflow-hidden relative"
      style={{ height, background: colors.surfaceContainer }}
    >
      <div
        className="h-full flex items-center justify-center transition-[width] duration-500 ease-out relative"
        style={{
          width: `${pct}%`,
          background: color,
          borderRight: pct < 100 ? "3px solid #111111" : "none",
        }}
      >
        {pct > 15 && (
          <span className="font-display font-bold text-[11px] text-ink">
            {pct.toFixed(0)}%
          </span>
        )}
      </div>
    </div>
  );
};
