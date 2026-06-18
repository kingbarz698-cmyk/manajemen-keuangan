import type { FC, ReactNode } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon } from "@/components/ui";

export interface AuthLayoutProps {
  children: ReactNode;
}

export const AuthLayout: FC<AuthLayoutProps> = ({ children }) => {
  const { colors, isDark } = useTheme();

  return (
    <div
      className={`font-body min-h-screen flex flex-col justify-center px-6 py-10 max-w-[480px] mx-auto
        ${isDark ? "bg-dark" : "bg-bg-mint"}`}
    >
      <div className="text-center mb-8">
        <div className="w-[72px] h-[72px] rounded-card-lg border-3 border-ink bg-accent-green mx-auto mb-4 flex items-center justify-center shadow-hard">
          <Icon name="wallet" size={34} />
        </div>
        <h1
          className="font-display font-extrabold text-[32px] tracking-tight mb-1"
          style={{ color: colors.textPrimary }}
        >
          Làsave
        </h1>
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Save Smart. Live Better.
        </p>
      </div>
      {children}
    </div>
  );
};
