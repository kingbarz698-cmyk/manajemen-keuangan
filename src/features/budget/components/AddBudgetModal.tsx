import { useState, useMemo, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal, Input, Button, SelectField, type SelectOption } from "@/components/ui";
import { EXPENSE_CATEGORIES } from "@/utils/categories";
import type { BudgetScope, CreateBudgetInput, ExpenseCategoryKey } from "@/types";

export interface AddBudgetModalProps {
  /** Category keys that already have a budget this period, so they can be excluded from the picker. */
  existingCategoryKeys: ExpenseCategoryKey[];
  /** Whether a Monthly Budget already exists this period. */
  hasMonthlyBudget: boolean;
  onClose: () => void;
  onSubmit: (input: CreateBudgetInput) => Promise<void>;
}

interface BudgetFormState {
  scope: BudgetScope;
  category: ExpenseCategoryKey | "";
  limitAmount: string;
}

const SCOPE_OPTIONS: Array<{ key: BudgetScope; label: string; activeBg: string }> = [
  { key: "monthly", label: "Anggaran Bulanan", activeBg: "#9ED9FF" },
  { key: "category", label: "Per Kategori", activeBg: "#c1abff" },
];

function getCurrentPeriod(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

export const AddBudgetModal: FC<AddBudgetModalProps> = ({
  existingCategoryKeys,
  hasMonthlyBudget,
  onClose,
  onSubmit,
}) => {
  const [form, setForm] = useState<BudgetFormState>({
    scope: hasMonthlyBudget ? "category" : "monthly",
    category: "",
    limitAmount: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

  const categoryOptions: SelectOption[] = useMemo(
    () =>
      EXPENSE_CATEGORIES.filter((cat) => !existingCategoryKeys.includes(cat.key as ExpenseCategoryKey)).map(
        (cat) => ({ key: cat.key, label: cat.label, icon: cat.icon, color: cat.color })
      ),
    [existingCategoryKeys]
  );

  const isFormValid =
    Boolean(form.limitAmount) &&
    Number(form.limitAmount) > 0 &&
    (form.scope === "monthly" ? !hasMonthlyBudget : Boolean(form.category));

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        scope: form.scope,
        category: form.scope === "category" ? (form.category as ExpenseCategoryKey) : undefined,
        limitAmount: Number(form.limitAmount),
        period: getCurrentPeriod(),
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Buat Anggaran" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2.5">
          {SCOPE_OPTIONS.map((opt) => {
            const isActive = form.scope === opt.key;
            const isDisabled = opt.key === "monthly" && hasMonthlyBudget;
            return (
              <button
                key={opt.key}
                type="button"
                disabled={isDisabled}
                onClick={() => setForm((prev) => ({ ...prev, scope: opt.key, category: "" }))}
                className={`p-3.5 rounded-input border-3 font-display font-bold text-sm cursor-pointer shadow-hard-md
                  disabled:opacity-40 disabled:cursor-not-allowed
                  ${isActive ? "border-accent-green" : "border-ink"}`}
                style={{
                  background: isActive ? opt.activeBg : colors.surface,
                  color: colors.textPrimary,
                }}
              >
                {opt.label}
              </button>
            );
          })}
        </div>

        {form.scope === "monthly" && hasMonthlyBudget && (
          <p className="font-body text-sm m-0" style={{ color: colors.textSecondary }}>
            Anggaran bulanan untuk periode ini sudah ada. Hapus dulu untuk membuat yang baru.
          </p>
        )}

        {form.scope === "category" && (
          <SelectField
            label="Kategori"
            icon="trendDown"
            placeholder="Pilih kategori pengeluaran"
            options={categoryOptions}
            value={form.category}
            onSelect={(key) => setForm((prev) => ({ ...prev, category: key as ExpenseCategoryKey }))}
          />
        )}

        <Input
          label="Batas Anggaran"
          placeholder="0"
          type="number"
          icon="money"
          value={form.limitAmount}
          onChange={(v) => setForm((prev) => ({ ...prev, limitAmount: v }))}
        />

        <Button bg="#27D17F" icon="check" disabled={!isFormValid || isSubmitting} onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Simpan Anggaran"}
        </Button>
      </div>
    </Modal>
  );
};
