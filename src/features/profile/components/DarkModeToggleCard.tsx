import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon, Toggle } from "@/components/ui";

export const DarkModeToggleCard: FC = () => {
  const { colors, isDark, toggleTheme } = useTheme();

  return (
    <Card className="px-5 py-4 mb-3 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl border-[2.5px] border-ink flex items-center justify-center"
          style={{ background: isDark ? "#ffe07e" : "#9ED9FF" }}
        >
          <Icon name={isDark ? "moon" : "sun"} size={20} />
        </div>
        <span className="font-display font-bold text-[15px]" style={{ color: colors.textPrimary }}>
          Mode Gelap
        </span>
      </div>
      <Toggle checked={isDark} onChange={toggleTheme} ariaLabel="Mode Gelap" />
    </Card>
  );
};
