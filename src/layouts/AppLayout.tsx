import type { FC } from "react";
import { Outlet } from "react-router-dom";
import { BottomNav } from "@/components/layout/BottomNav";
import { useTheme } from "@/contexts/ThemeContext";

export const AppLayout: FC = () => {
  const { isDark } = useTheme();

  return (
    <div className={`font-body min-h-screen relative ${isDark ? "bg-dark" : "bg-bg-mint"}`}>
      <Outlet />
      <BottomNav />
    </div>
  );
};
