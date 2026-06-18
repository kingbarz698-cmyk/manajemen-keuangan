import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon, type IconName } from "./Icon";
import { Toggle } from "./Toggle";

export interface SettingsRowProps {
  icon: IconName;
  label: string;
  value?: string;
  onClick?: () => void;
  danger?: boolean;
  toggle?: boolean;
  toggleValue?: boolean;
  onToggle?: () => void;
}

export const SettingsRow: FC<SettingsRowProps> = ({
  icon,
  label,
  value,
  onClick,
  danger = false,
  toggle = false,
  toggleValue = false,
  onToggle,
}) => {
  const { colors } = useTheme();

  return (
    <button
      type="button"
      onClick={toggle ? undefined : onClick}
      className={`w-full border-3 border-ink rounded-input px-4 py-3.5 flex items-center justify-between
        mb-2.5 shadow-hard-sm ${toggle ? "cursor-default" : "cursor-pointer"}`}
      style={{ background: colors.surface, color: danger ? "#ba1a1a" : colors.textPrimary }}
    >
      <div className="flex items-center gap-3">
        <Icon name={icon} size={20} />
        <span
          className="font-display font-bold text-[15px]"
          style={{ color: danger ? "#ba1a1a" : colors.textPrimary }}
        >
          {label}
        </span>
      </div>
      {toggle ? (
        <Toggle checked={toggleValue} onChange={() => onToggle?.()} ariaLabel={label} />
      ) : value !== undefined ? (
        <div className="flex items-center gap-1.5">
          <span className="font-body text-[13px]" style={{ color: colors.textSecondary }}>
            {value}
          </span>
          <Icon name="chevronRight" size={18} />
        </div>
      ) : (
        <Icon name="chevronRight" size={18} />
      )}
    </button>
  );
};
