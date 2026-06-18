import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon, type IconName } from "./Icon";

export interface SelectOption {
  key: string;
  label: string;
  icon?: IconName;
  color?: string;
}

export interface SelectFieldProps {
  label?: string;
  value: string;
  placeholder: string;
  icon?: IconName;
  options: SelectOption[];
  onSelect: (key: string) => void;
}

export const SelectField: FC<SelectFieldProps> = ({ label, value, placeholder, icon, options, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { colors, isDark } = useTheme();
  const selected = options.find((o) => o.key === value);

  const handleSelect = (key: string) => {
    onSelect(key);
    setOpen(false);
  };

  return (
    <div className="flex flex-col gap-1.5 relative">
      {label && (
        <label
          className="font-display font-bold text-[13px] uppercase tracking-wide"
          style={{ color: colors.textSecondary }}
        >
          {label}
        </label>
      )}
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className={`w-full h-14 rounded-input border-3 border-ink font-body text-base text-left
          cursor-pointer box-border flex items-center relative pr-11
          ${icon ? "pl-11" : "pl-[18px]"}`}
        style={{
          background: colors.surface,
          color: selected ? colors.textPrimary : colors.textSecondary,
        }}
      >
        {icon && (
          <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }}>
            <Icon name={icon} size={18} />
          </div>
        )}
        <span className="overflow-hidden text-ellipsis whitespace-nowrap">
          {selected ? selected.label : placeholder}
        </span>
        <div
          className={`absolute right-4 top-1/2 -translate-y-1/2 transition-transform duration-150 ${
            open ? "-rotate-180" : ""
          }`}
          style={{ color: colors.textSecondary }}
        >
          <Icon name="chevronDown" size={18} />
        </div>
      </button>
      {open && (
        <div
          className="absolute top-full left-0 right-0 mt-1.5 z-50 border-3 border-ink rounded-input
            shadow-hard-lg max-h-60 overflow-y-auto p-2"
          style={{ background: colors.surface }}
        >
          {options.map((opt) => (
            // Selected-option highlight stays inline (not Tailwind `dark:`) because dark mode here
            // is driven by ThemeContext state, not a `dark` class on <html>. Values mirror
            // tailwind.config.ts tokens accent-purple-pastel / accent-purple-pastel-dark.
            <button
              key={opt.key}
              type="button"
              onClick={() => handleSelect(opt.key)}
              className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-2xl border-none
                font-body text-[15px] cursor-pointer text-left mb-0.5"
              style={{
                background: value === opt.key ? (isDark ? "#26215C" : "#e8ddff") : "transparent",
                color: colors.textPrimary,
              }}
            >
              {opt.icon && (
                <div
                  className="w-7 h-7 rounded-lg border-2 border-ink flex items-center justify-center flex-shrink-0"
                  style={{ background: opt.color ?? colors.surfaceContainer }}
                >
                  <Icon name={opt.icon} size={14} />
                </div>
              )}
              <span>{opt.label}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
