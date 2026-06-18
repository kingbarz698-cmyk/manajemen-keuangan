import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon } from "@/components/ui";

export interface SectionHeaderProps {
  title: string;
  actionLabel?: string;
  onActionClick?: () => void;
}

export const SectionHeader: FC<SectionHeaderProps> = ({ title, actionLabel = "Lihat Semua", onActionClick }) => {
  const { colors } = useTheme();

  return (
    <div className="flex justify-between items-center mb-3">
      <h3 className="font-display font-bold text-lg m-0" style={{ color: colors.textPrimary }}>
        {title}
      </h3>
      {onActionClick && (
        <button
          onClick={onActionClick}
          className="bg-transparent border-none cursor-pointer font-display font-bold text-sm
            text-accent-green flex items-center gap-1"
        >
          {actionLabel} <Icon name="chevronRight" size={16} />
        </button>
      )}
    </div>
  );
};
