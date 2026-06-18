import { createContext, useContext, useState, useCallback, useMemo, useEffect, type FC, type ReactNode } from "react";
import type { User, LoginCredentials, RegisterInput, UpdateProfileInput } from "@/types";
import * as authService from "@/services/auth.service";

interface AuthContextValue {
  user: User | null;
  isAuthenticated: boolean;
  /** True only until the first onAuthStateChanged callback fires (persisted-session check). */
  isInitializing: boolean;
  /** True while a login/register/loginWithGoogle call is in flight — for disabling form buttons. */
  isLoading: boolean;
  error: string | null;
  login: (credentials: LoginCredentials) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  register: (input: RegisterInput) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (input: UpdateProfileInput) => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = authService.onAuthStateChanged((firebaseUser) => {
      setUser(firebaseUser);
      setIsInitializing(false);
    });
    return unsubscribe;
  }, []);

  const login = useCallback(async (credentials: LoginCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.login(credentials);
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const loggedInUser = await authService.loginWithGoogle();
      setUser(loggedInUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal masuk dengan Google");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const register = useCallback(async (input: RegisterInput) => {
    setIsLoading(true);
    setError(null);
    try {
      const newUser = await authService.register(input);
      setUser(newUser);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mendaftar");
      throw err;
    } finally {
      setIsLoading(false);
    }
  }, []);

  const logout = useCallback(async () => {
    await authService.logout();
    setUser(null);
  }, []);

  const updateProfile = useCallback(async (input: UpdateProfileInput) => {
    const updated = await authService.updateProfile(input);
    setUser(updated);
  }, []);

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      isInitializing,
      isLoading,
      error,
      login,
      loginWithGoogle,
      register,
      logout,
      updateProfile,
    }),
    [user, isInitializing, isLoading, error, login, loginWithGoogle, register, logout, updateProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
