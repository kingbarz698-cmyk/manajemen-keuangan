/**
 * Wallet domain types.
 * Mirrors Firestore collection `wallets/{walletId}` per PRD §31.
 */

import type { IconName } from "@/components/ui/Icon";

export type WalletType = "cash" | "bank" | "ewallet" | "goal" | "group";

export interface Wallet {
  id: string;
  userId: string;
  type: WalletType;
  name: string;
  balance: number;
  transactionCount: number;
  /** Static accent color (hex) — does not change with dark mode, per DESIGN.md */
  color: string;
  createdAt: string;
}

export interface CreateWalletInput {
  name: string;
  type: WalletType;
  balance: number;
}

export const WALLET_TYPE_LABEL: Record<WalletType, string> = {
  cash: "Tunai",
  bank: "Bank",
  ewallet: "E-Wallet",
  goal: "Target",
  group: "Grup",
};

export const WALLET_TYPE_ICON: Record<WalletType, IconName> = {
  cash: "money",
  bank: "bank",
  ewallet: "qrcode",
  goal: "target",
  group: "person",
};
