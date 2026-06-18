import type { ThemeMode } from "@/types";

/**
 * Color tokens that change between light and dark mode.
 * Static accent colors (green, yellow, purple, blue, red) live in tailwind.config.ts
 * because they do NOT change between modes per DESIGN.md.
 */
export interface ThemeColors {
  bgMint: string;
  surface: string;
  surfaceContainer: string;
  textPrimary: string;
  textSecondary: string;
  borderTrack: string;
  redLightBg: string;
  inverse: string;
}

export const lightTheme: ThemeColors = {
  bgMint: "#DFF8EE",
  surface: "#FFFFFF",
  surfaceContainer: "#f0edec",
  textPrimary: "#1c1b1b",
  textSecondary: "#3c4a3f",
  borderTrack: "#e5e2e1",
  redLightBg: "#ffdad6",
  inverse: "#313030",
};

export const darkTheme: ThemeColors = {
  bgMint: "#121212",
  surface: "#1A1A1A",
  surfaceContainer: "#242424",
  textPrimary: "#FFFFFF",
  textSecondary: "#bbcbbc",
  borderTrack: "#2a2a2a",
  redLightBg: "#93000a",
  inverse: "#e5e2e1",
};

export function getThemeColors(mode: ThemeMode): ThemeColors {
  return mode === "dark" ? darkTheme : lightTheme;
}
