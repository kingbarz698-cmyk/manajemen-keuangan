import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWallets } from "@/hooks/useWallets";
import { useTransactions } from "@/hooks/useTransactions";
import { useGoals } from "@/hooks/useGoals";
import { useBudgets } from "@/hooks/useBudgets";
import { Avatar, Icon } from "@/components/ui";
import { SectionHeader } from "@/components/layout/SectionHeader";
import { TotalAssetCard } from "@/features/dashboard/components/TotalAssetCard";
import { SafeToSpendCard, HealthScoreCard } from "@/features/dashboard/components/StatCards";
import { WalletPreviewCard } from "@/features/dashboard/components/WalletPreviewCard";
import { GoalPreviewCard } from "@/features/goals/components/GoalPreviewCard";
import { TransactionListItem } from "@/features/transactions/components/TransactionListItem";
import { BudgetSummaryCard } from "@/features/budget/components/BudgetSummaryCard";

/**
 * MVP financial health score. Currently a fixed placeholder (78) like the prototype;
 * a real implementation would derive this from spending ratio, savings rate, and goal progress.
 */
const HEALTH_SCORE_PLACEHOLDER = 78;

/** Safe-to-spend divisor: rough days-remaining estimate, matching prototype's `/ 16` placeholder. */
const SAFE_TO_SPEND_DIVISOR = 16;

export const DashboardPage: FC = () => {
  const { colors } = useTheme();
  const { user } = useAuth();
  const navigate = useNavigate();

  const { wallets, totalBalance, isLoading: walletsLoading } = useWallets();
  const { transactions, totalIncome, totalExpense, isLoading: txLoading } = useTransactions();
  const { goals, totalCurrent: totalGoalCurrent, isLoading: goalsLoading } = useGoals();
  const { budgets, isLoading: budgetsLoading } = useBudgets();

  const isLoading = walletsLoading || txLoading || goalsLoading || budgetsLoading;
  const displayName = user?.name ?? "Pengguna";
  const safeToSpendPerDay = Math.floor((totalBalance - totalGoalCurrent) / SAFE_TO_SPEND_DIVISOR);

  if (isLoading) {
    return (
      <div className="px-5 pt-14 pb-32 max-w-[480px] mx-auto">
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Memuat data...
        </p>
      </div>
    );
  }

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center pt-14 mb-6">
        <div>
          <p className="font-body text-sm m-0" style={{ color: colors.textSecondary }}>
            Selamat pagi
          </p>
          <h1
            className="font-display font-extrabold text-[28px] m-0 tracking-tight"
            style={{ color: colors.textPrimary }}
          >
            {displayName}
          </h1>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => navigate("/profile")}
            className="w-11 h-11 rounded-pill border-3 border-ink bg-accent-green-light
              cursor-pointer flex items-center justify-center shadow-hard-sm"
            aria-label="Notifikasi"
          >
            <Icon name="bell" size={20} />
          </button>
          <Avatar name={displayName} size={44} />
        </div>
      </div>

      <TotalAssetCard totalBalance={totalBalance} totalIncome={totalIncome} totalExpense={totalExpense} />

      {/* Bento row: Safe to Spend + Health Score + Budget */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <SafeToSpendCard amountPerDay={safeToSpendPerDay} />
        <HealthScoreCard score={HEALTH_SCORE_PLACEHOLDER} />
      </div>
      <div className="mb-4">
        <BudgetSummaryCard budgets={budgets} onClick={() => navigate("/budget")} />
      </div>

      {/* Wallets preview */}
      <SectionHeader title="Dompet Saya" onActionClick={() => navigate("/wallets")} />
      <div className="flex gap-3 overflow-x-auto pb-1 mb-4">
        {wallets.slice(0, 3).map((wallet) => (
          <WalletPreviewCard key={wallet.id} wallet={wallet} onClick={() => navigate("/wallets")} />
        ))}
      </div>

      {/* Goals preview */}
      <SectionHeader title="Target Tabungan" onActionClick={() => navigate("/goals")} />
      {goals.slice(0, 2).map((goal) => (
        <GoalPreviewCard key={goal.id} goal={goal} onClick={() => navigate("/goals")} />
      ))}

      {/* Recent transactions */}
      <SectionHeader title="Transaksi Terbaru" onActionClick={() => navigate("/transactions")} />
      {transactions.slice(0, 4).map((transaction) => (
        <TransactionListItem
          key={transaction.id}
          transaction={transaction}
          onClick={() => navigate("/transactions")}
        />
      ))}
    </div>
  );
};
