import type { FC, ChangeEvent } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon, type IconName } from "./Icon";

export interface InputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  type?: "text" | "email" | "password" | "number" | "date" | "tel";
  placeholder?: string;
  icon?: IconName;
}

export const Input: FC<InputProps> = ({ label, value, onChange, type = "text", placeholder, icon }) => {
  const { colors } = useTheme();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  };

  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label
          className="font-display font-bold text-[13px] uppercase tracking-wide"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div
            className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: colors.textSecondary }}
          >
            <Icon name={icon} size={18} />
          </div>
        )}
        <input
          type={type}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          className={`w-full h-14 rounded-input border-3 border-ink font-body text-base
            outline-none box-border transition-shadow duration-150
            focus:shadow-[0_0_0_3px_rgba(39,209,127,0.4)]
            ${icon ? "pl-11" : "pl-[18px]"} pr-[18px]`}
          style={{ background: colors.surface, color: colors.textPrimary }}
        />
      </div>
    </div>
  );
};
