import type { FC, ReactNode, CSSProperties } from "react";
import { useTheme } from "@/contexts/ThemeContext";

export interface CardProps {
  children: ReactNode;
  /** Static background color (hex). If omitted, falls back to theme surface color. */
  bg?: string;
  className?: string;
  style?: CSSProperties;
  onClick?: () => void;
  /** Border radius variant. Defaults to "card" (24px). */
  rounded?: "card" | "card-lg" | "2xl" | "full";
}

const ROUNDED_CLASS: Record<NonNullable<CardProps["rounded"]>, string> = {
  card: "rounded-card",
  "card-lg": "rounded-card-lg",
  "2xl": "rounded-2xl",
  full: "rounded-full",
};

export const Card: FC<CardProps> = ({ children, bg, className = "", style, onClick, rounded = "card" }) => {
  const { colors } = useTheme();
  const background = bg ?? colors.surface;
  const interactiveClasses = onClick
    ? "cursor-pointer transition-transform duration-150 hover:translate-x-[3px] hover:translate-y-[3px] hover:shadow-hard-sm active:translate-x-1 active:translate-y-1 active:shadow-hard-pressed"
    : "";

  return (
    <div
      onClick={onClick}
      className={`border-3 border-ink ${ROUNDED_CLASS[rounded]} shadow-hard ${interactiveClasses} ${className}`}
      style={{ background, ...style }}
    >
      {children}
    </div>
  );
};
