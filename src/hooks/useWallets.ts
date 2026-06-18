import { useState, useEffect, useCallback } from "react";
import type { Wallet, CreateWalletInput } from "@/types";
import * as walletService from "@/services/wallet.service";

interface UseWalletsResult {
  wallets: Wallet[];
  totalBalance: number;
  isLoading: boolean;
  error: string | null;
  addWallet: (input: CreateWalletInput) => Promise<void>;
  refetch: () => Promise<void>;
}

export function useWallets(): UseWalletsResult {
  const [wallets, setWallets] = useState<Wallet[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchWallets = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await walletService.getWallets();
      setWallets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal memuat dompet");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void fetchWallets();
  }, [fetchWallets]);

  const addWallet = useCallback(
    async (input: CreateWalletInput) => {
      await walletService.createWallet(input);
      await fetchWallets();
    },
    [fetchWallets]
  );

  const totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

  return { wallets, totalBalance, isLoading, error, addWallet, refetch: fetchWallets };
}
