import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon } from "@/components/ui";

export interface PasswordInputProps {
  label?: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export const PasswordInput: FC<PasswordInputProps> = ({
  label = "Password",
  value,
  onChange,
  placeholder = "••••••••",
}) => {
  const [showPassword, setShowPassword] = useState(false);
  const { colors } = useTheme();

  return (
    <div className="flex flex-col gap-1.5">
      <label
        className="font-display font-bold text-[13px] uppercase tracking-wide"
        style={{ color: colors.textSecondary }}
      >
        {label}
      </label>
      <div className="relative">
        <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: colors.textSecondary }}>
          <Icon name="lock" size={18} />
        </div>
        <input
          type={showPassword ? "text" : "password"}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full h-14 rounded-input border-3 border-ink font-body text-base
            outline-none box-border pl-11 pr-11"
          style={{ background: colors.surface, color: colors.textPrimary }}
        />
        <button
          type="button"
          onClick={() => setShowPassword((prev) => !prev)}
          className="absolute right-3.5 top-1/2 -translate-y-1/2 bg-transparent border-none cursor-pointer p-1"
          style={{ color: colors.textSecondary }}
          aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
        >
          <Icon name={showPassword ? "eyeOff" : "eye"} size={18} />
        </button>
      </div>
    </div>
  );
};
