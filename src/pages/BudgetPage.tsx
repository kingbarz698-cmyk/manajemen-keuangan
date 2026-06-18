import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useBudgets } from "@/hooks/useBudgets";
import { Button } from "@/components/ui";
import { BudgetAlertBanner } from "@/features/budget/components/BudgetAlertBanner";
import { BudgetProgressCard } from "@/features/budget/components/BudgetProgressCard";
import { AddBudgetModal } from "@/features/budget/components/AddBudgetModal";
import type { ExpenseCategoryKey } from "@/types";

export const BudgetPage: FC = () => {
  const [showAddModal, setShowAddModal] = useState(false);
  const { colors } = useTheme();
  const { settings } = useSettings();
  const { budgets, monthlyBudget, categoryBudgets, isLoading, addBudget } = useBudgets();

  const existingCategoryKeys = categoryBudgets
    .map((b) => b.category)
    .filter((c): c is ExpenseCategoryKey => c !== undefined);

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      <div className="flex justify-between items-center pt-14 mb-5">
        <h1
          className="font-display font-extrabold text-[30px] m-0 tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          Anggaran
        </h1>
        <Button bg="#9ED9FF" icon="plus" onClick={() => setShowAddModal(true)}>
          Buat
        </Button>
      </div>

      {isLoading ? (
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Memuat data...
        </p>
      ) : (
        <>
          <BudgetAlertBanner budgets={budgets} alertsEnabled={settings.budgetAlertEnabled} />

          {monthlyBudget && <BudgetProgressCard budget={monthlyBudget} />}

          {categoryBudgets.length > 0 && (
            <>
              <h3
                className="font-display font-bold text-lg mb-3 mt-1"
                style={{ color: colors.textPrimary }}
              >
                Per Kategori
              </h3>
              {categoryBudgets.map((budget) => (
                <BudgetProgressCard key={budget.id} budget={budget} />
              ))}
            </>
          )}

          {budgets.length === 0 && (
            <p className="font-body text-sm text-center py-8" style={{ color: colors.textSecondary }}>
              Belum ada anggaran. Buat anggaran bulanan atau per kategori untuk mulai melacak pengeluaranmu.
            </p>
          )}
        </>
      )}

      {showAddModal && (
        <AddBudgetModal
          existingCategoryKeys={existingCategoryKeys}
          hasMonthlyBudget={Boolean(monthlyBudget)}
          onClose={() => setShowAddModal(false)}
          onSubmit={addBudget}
        />
      )}
    </div>
  );
};
