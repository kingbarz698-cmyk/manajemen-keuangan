import { createContext, useContext, useState, useCallback, useMemo, type FC, type ReactNode } from "react";
import type { AppSettings } from "@/types";

const DEFAULT_SETTINGS: AppSettings = {
  currency: "IDR (Rp)",
  language: "ID",
  notificationsEnabled: true,
  biometricEnabled: false,
  budgetAlertEnabled: true,
  appVersion: "2.0.0",
};

interface SettingsContextValue {
  settings: AppSettings;
  updateSettings: (partial: Partial<AppSettings>) => void;
  toggleBudgetAlert: () => void;
  toggleNotifications: () => void;
  toggleBiometric: () => void;
}

const SettingsContext = createContext<SettingsContextValue | undefined>(undefined);

interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: FC<SettingsProviderProps> = ({ children }) => {
  const [settings, setSettings] = useState<AppSettings>(DEFAULT_SETTINGS);

  const updateSettings = useCallback((partial: Partial<AppSettings>) => {
    setSettings((prev) => ({ ...prev, ...partial }));
  }, []);

  const toggleBudgetAlert = useCallback(() => {
    setSettings((prev) => ({ ...prev, budgetAlertEnabled: !prev.budgetAlertEnabled }));
  }, []);

  const toggleNotifications = useCallback(() => {
    setSettings((prev) => ({ ...prev, notificationsEnabled: !prev.notificationsEnabled }));
  }, []);

  const toggleBiometric = useCallback(() => {
    setSettings((prev) => ({ ...prev, biometricEnabled: !prev.biometricEnabled }));
  }, []);

  const value = useMemo<SettingsContextValue>(
    () => ({ settings, updateSettings, toggleBudgetAlert, toggleNotifications, toggleBiometric }),
    [settings, updateSettings, toggleBudgetAlert, toggleNotifications, toggleBiometric]
  );

  return <SettingsContext.Provider value={value}>{children}</SettingsContext.Provider>;
};

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error("useSettings must be used within a SettingsProvider");
  }
  return context;
}
