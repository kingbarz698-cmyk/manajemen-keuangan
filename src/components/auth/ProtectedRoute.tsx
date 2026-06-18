import type { FC, ReactNode } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useTheme } from "@/contexts/ThemeContext";

interface RouteGuardProps {
  children: ReactNode;
}

function AuthSplash() {
  const { colors } = useTheme();
  return (
    <div
      className="min-h-screen flex items-center justify-center font-body text-sm"
      style={{ color: colors.textSecondary }}
    >
      Memuat...
    </div>
  );
}

/** Redirects to /login if no one is signed in. Used to wrap every authenticated route. */
export const ProtectedRoute: FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <AuthSplash />;
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return <>{children}</>;
};

/** Redirects to /dashboard if someone is already signed in. Used for /login, /register, /forgot-password. */
export const PublicOnlyRoute: FC<RouteGuardProps> = ({ children }) => {
  const { isAuthenticated, isInitializing } = useAuth();

  if (isInitializing) return <AuthSplash />;
  if (isAuthenticated) return <Navigate to="/dashboard" replace />;
  return <>{children}</>;
};
