import { useState, useMemo, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal, Input, Button, SelectField, type SelectOption } from "@/components/ui";
import { WALLET_TYPE_ICON } from "@/types";
import { INCOME_CATEGORIES, EXPENSE_CATEGORIES } from "@/utils/categories";
import type { Wallet, TransactionFormState, CreateTransactionInput, TransactionType, CategoryKey } from "@/types";

export interface AddTransactionModalProps {
  wallets: Wallet[];
  onClose: () => void;
  onSubmit: (input: CreateTransactionInput) => Promise<void>;
}

const INITIAL_FORM: TransactionFormState = {
  type: "expense",
  walletId: "",
  category: "",
  amount: "",
  note: "",
  date: "",
};

const TYPE_OPTIONS: Array<{ key: TransactionType; label: string; activeBg: string }> = [
  { key: "expense", label: "Pengeluaran", activeBg: "#ffdad6" },
  { key: "income", label: "Pemasukan", activeBg: "#63fea7" },
];

export const AddTransactionModal: FC<AddTransactionModalProps> = ({ wallets, onClose, onSubmit }) => {
  const [form, setForm] = useState<TransactionFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

  const categoryOptions: SelectOption[] = useMemo(() => {
    const source = form.type === "income" ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;
    return source.map((cat) => ({ key: cat.key, label: cat.label, icon: cat.icon, color: cat.color }));
  }, [form.type]);

  const walletOptions: SelectOption[] = useMemo(
    () =>
      wallets.map((w) => ({
        key: w.id,
        label: w.name,
        icon: WALLET_TYPE_ICON[w.type],
        color: w.color,
      })),
    [wallets]
  );

  const isFormValid = Boolean(form.walletId) && Boolean(form.category) && Boolean(form.amount);

  const handleTypeChange = (type: TransactionType) => {
    setForm((prev) => ({ ...prev, type, category: "" }));
  };

  const handleSubmit = async () => {
    if (!isFormValid || !form.category) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        type: form.type,
        walletId: form.walletId,
        category: form.category,
        amount: Number(form.amount),
        note: form.note,
        date: form.date,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Tambah Transaksi" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-2 gap-2.5">
          {TYPE_OPTIONS.map((opt) => {
            const isActive = form.type === opt.key;
            return (
              <button
                key={opt.key}
                type="button"
                onClick={() => handleTypeChange(opt.key)}
                className={`p-3.5 rounded-input border-3 font-display font-bold text-[15px] cursor-pointer shadow-hard-md
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

        <SelectField
          label="Dompet"
          icon="wallet"
          placeholder="Pilih dompet"
          options={walletOptions}
          value={form.walletId}
          onSelect={(key) => setForm((prev) => ({ ...prev, walletId: key }))}
        />

        <SelectField
          label="Kategori"
          icon={form.type === "income" ? "trendUp" : "trendDown"}
          placeholder="Pilih kategori"
          options={categoryOptions}
          value={form.category}
          onSelect={(key) => setForm((prev) => ({ ...prev, category: key as CategoryKey }))}
        />

        <Input
          label="Jumlah"
          placeholder="0"
          type="number"
          icon="money"
          value={form.amount}
          onChange={(v) => setForm((prev) => ({ ...prev, amount: v }))}
        />
        <Input
          label="Catatan"
          placeholder="cth. Makan siang di kantin"
          value={form.note}
          onChange={(v) => setForm((prev) => ({ ...prev, note: v }))}
        />
        <Input
          label="Tanggal"
          type="date"
          icon="calendar"
          value={form.date}
          onChange={(v) => setForm((prev) => ({ ...prev, date: v }))}
        />

        <Button bg="#27D17F" icon="check" disabled={!isFormValid || isSubmitting} onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Simpan"}
        </Button>
      </div>
    </Modal>
  );
};
