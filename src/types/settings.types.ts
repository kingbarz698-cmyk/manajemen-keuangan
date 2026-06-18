/**
 * App-wide settings & theme types.
 */

export type ThemeMode = "light" | "dark";

export interface AppSettings {
  currency: string;
  language: string;
  notificationsEnabled: boolean;
  biometricEnabled: boolean;
  budgetAlertEnabled: boolean;
  appVersion: string;
}
