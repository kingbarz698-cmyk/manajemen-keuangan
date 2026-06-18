import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useTransactions } from "@/hooks/useTransactions";
import { useWallets } from "@/hooks/useWallets";
import { Button } from "@/components/ui";
import { QuickAddBar } from "@/features/transactions/components/QuickAddBar";
import { FilterTabs } from "@/features/transactions/components/FilterTabs";
import { TransactionSummaryRow } from "@/features/transactions/components/TransactionSummaryRow";
import { TransactionGroupedList } from "@/features/transactions/components/TransactionGroupedList";
import { AddTransactionModal } from "@/features/transactions/components/AddTransactionModal";
import type { ParsedQuickAdd } from "@/utils/quickAddParser";

export const TransactionsPage: FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { colors } = useTheme();

  const {
    filteredTransactions,
    filter,
    setFilter,
    totalIncome,
    totalExpense,
    isLoading: txLoading,
    addTransaction,
  } = useTransactions();
  const { wallets, isLoading: walletsLoading } = useWallets();

  const isLoading = txLoading || walletsLoading;

  /**
   * Quick Add only gives us type/amount/note (free text has no wallet or category info),
   * so we fall back to the first wallet and an "Others" category. This is an explicit
   * simplification, not real categorization — the user can always use the full
   * "Tambah Transaksi" modal for proper wallet/category selection.
   */
  const handleQuickAdd = (parsed: ParsedQuickAdd) => {
    const fallbackWallet = wallets[0];
    if (!fallbackWallet) {
      return;
    }
    void addTransaction({
      type: parsed.type,
      walletId: fallbackWallet.id,
      category: parsed.type === "income" ? "income_others" : "expense_others",
      amount: parsed.amount,
      note: parsed.note,
      date: "Hari ini",
    });
  };

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      <div className="flex justify-between items-center pt-14 mb-5">
        <h1
          className="font-display font-extrabold text-[30px] m-0 tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          Transaksi
        </h1>
        <Button bg="#FFD84D" icon="plus" onClick={() => setShowAddModal(true)}>
          Tambah
        </Button>
      </div>

      <QuickAddBar onSubmit={handleQuickAdd} />
      <FilterTabs value={filter} onChange={setFilter} />
      <TransactionSummaryRow totalIncome={totalIncome} totalExpense={totalExpense} />

      {isLoading ? (
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Memuat data...
        </p>
      ) : (
        <TransactionGroupedList transactions={filteredTransactions} />
      )}

      {showAddModal && (
        <AddTransactionModal
          wallets={wallets}
          onClose={() => setShowAddModal(false)}
          onSubmit={addTransaction}
        />
      )}
    </div>
  );
};
