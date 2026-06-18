import type { FC, ReactNode, CSSProperties } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon, type IconName } from "./Icon";

export interface ButtonProps {
  children: ReactNode;
  onClick?: () => void;
  bg?: string;
  color?: string;
  icon?: IconName;
  disabled?: boolean;
  className?: string;
  style?: CSSProperties;
  type?: "button" | "submit";
}

export const Button: FC<ButtonProps> = ({
  children,
  onClick,
  bg = "#27D17F",
  color,
  icon,
  disabled = false,
  className = "",
  style,
  type = "button",
}) => {
  const { colors } = useTheme();
  const textColor = color ?? colors.textPrimary;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`h-[52px] min-w-[48px] px-5 rounded-pill border-3 border-ink shadow-hard
        font-display font-bold text-[15px]
        flex items-center justify-center gap-2
        transition-transform duration-100
        disabled:opacity-50 disabled:cursor-not-allowed
        enabled:cursor-pointer enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:active:shadow-hard-pressed
        ${className}`}
      style={{ background: bg, color: textColor, ...style }}
    >
      {icon && <Icon name={icon} size={18} />}
      {children}
    </button>
  );
};
