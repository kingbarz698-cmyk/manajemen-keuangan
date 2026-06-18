import { useState, useMemo, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal, Input, Button, ProgressBar, SelectField, type SelectOption } from "@/components/ui";
import { WALLET_TYPE_ICON } from "@/types";
import { formatRupiah, formatShort } from "@/utils/format";
import type { Goal, Wallet, ContributeToGoalInput } from "@/types";

export interface ContributeToGoalModalProps {
  goal: Goal;
  wallets: Wallet[];
  onClose: () => void;
  onSubmit: (input: ContributeToGoalInput) => Promise<void>;
}

const QUICK_AMOUNTS = [200_000, 500_000, 1_000_000];

export const ContributeToGoalModal: FC<ContributeToGoalModalProps> = ({ goal, wallets, onClose, onSubmit }) => {
  const [amount, setAmount] = useState("");
  const [walletId, setWalletId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

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

  const isFormValid = Boolean(walletId) && Boolean(amount) && Number(amount) > 0;

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ goalId: goal.id, walletId, amount: Number(amount) });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title={`Setor ke ${goal.name}`} onClose={onClose}>
      <div className="mb-5">
        <ProgressBar value={goal.currentAmount} max={goal.targetAmount} color="#9E7BFF" height={20} />
        <div className="flex justify-between mt-2">
          <span className="font-display font-bold text-[13px] text-accent-purple">
            {formatRupiah(goal.currentAmount)}
          </span>
          <span className="font-display text-[13px]" style={{ color: colors.textSecondary }}>
            {formatRupiah(goal.targetAmount)}
          </span>
        </div>
      </div>

      <div className="flex flex-col gap-3.5">
        <Input label="Jumlah Setoran" placeholder="0" type="number" icon="money" value={amount} onChange={setAmount} />

        <SelectField
          label="Dari Dompet"
          icon="wallet"
          placeholder="Pilih dompet"
          options={walletOptions}
          value={walletId}
          onSelect={setWalletId}
        />

        <div className="flex gap-2.5">
          {QUICK_AMOUNTS.map((quickAmount) => (
            <button
              key={quickAmount}
              type="button"
              onClick={() => setAmount(String(quickAmount))}
              className="flex-1 p-2.5 rounded-2xl border-3 border-ink bg-accent-purple-pastel
                font-display font-bold text-[13px] cursor-pointer shadow-hard-sm text-ink"
            >
              {formatShort(quickAmount)}
            </button>
          ))}
        </div>

        <Button bg="#9E7BFF" color="#FFFFFF" icon="check" disabled={!isFormValid || isSubmitting} onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Setor Sekarang"}
        </Button>
      </div>
    </Modal>
  );
};
