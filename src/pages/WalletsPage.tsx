import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { Button } from "@/components/ui";
import { TotalBalanceHero } from "@/features/wallets/components/TotalBalanceHero";
import { WalletDetailCard } from "@/features/wallets/components/WalletDetailCard";
import { AddWalletModal } from "@/features/wallets/components/AddWalletModal";

export const WalletsPage: FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { colors } = useTheme();

  const { wallets, totalBalance, isLoading: walletsLoading, addWallet } = useWallets();
  const { totalIncome, isLoading: txLoading } = useTransactions();

  const isLoading = walletsLoading || txLoading;

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      <div className="flex justify-between items-center pt-14 mb-6">
        <h1
          className="font-display font-extrabold text-[30px] m-0 tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          Dompet
        </h1>
        <Button bg="#27D17F" icon="plus" onClick={() => setShowAddModal(true)}>
          Tambah
        </Button>
      </div>

      {isLoading ? (
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Memuat data...
        </p>
      ) : (
        <>
          <TotalBalanceHero totalBalance={totalBalance} totalIncome={totalIncome} />

          {wallets.length === 0 ? (
            <p className="font-body text-sm text-center py-8" style={{ color: colors.textSecondary }}>
              Belum ada dompet. Tambahkan dompet pertamamu untuk mulai mencatat transaksi.
            </p>
          ) : (
            wallets.map((wallet) => <WalletDetailCard key={wallet.id} wallet={wallet} />)
          )}
        </>
      )}

      {showAddModal && <AddWalletModal onClose={() => setShowAddModal(false)} onSubmit={addWallet} />}
    </div>
  );
};
