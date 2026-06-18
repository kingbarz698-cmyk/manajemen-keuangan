import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Modal, Input, Button } from "@/components/ui";
import { WALLET_TYPE_LABEL } from "@/types";
import type { WalletType, CreateWalletInput } from "@/types";

export interface AddWalletModalProps {
  onClose: () => void;
  onSubmit: (input: CreateWalletInput) => Promise<void>;
}

interface WalletFormState {
  name: string;
  type: WalletType;
  balance: string;
}

const INITIAL_FORM: WalletFormState = { name: "", type: "cash", balance: "" };

const WALLET_TYPES = Object.keys(WALLET_TYPE_LABEL) as WalletType[];

export const AddWalletModal: FC<AddWalletModalProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<WalletFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { colors } = useTheme();

  const isFormValid = Boolean(form.name) && Boolean(form.balance);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit({ name: form.name, type: form.type, balance: Number(form.balance) || 0 });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Tambah Dompet" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nama Dompet"
          value={form.name}
          onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
          placeholder="cth. BCA Tabungan"
        />

        <div>
          <label
            className="font-display font-bold text-[13px] uppercase tracking-wide block mb-2"
            style={{ color: colors.textSecondary }}
          >
            Tipe Dompet
          </label>
          <div className="grid grid-cols-2 gap-2.5">
            {WALLET_TYPES.map((type) => {
              const isActive = form.type === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type }))}
                  className={`px-4 py-3 rounded-2xl border-3 font-display font-bold text-sm cursor-pointer
                    shadow-hard-sm transition-colors duration-100
                    ${isActive ? "bg-accent-green-light border-accent-green" : "border-ink"}`}
                  style={isActive ? undefined : { background: colors.surface }}
                >
                  <span style={{ color: colors.textPrimary }}>{WALLET_TYPE_LABEL[type]}</span>
                </button>
              );
            })}
          </div>
        </div>

        <Input
          label="Saldo Awal"
          value={form.balance}
          onChange={(v) => setForm((prev) => ({ ...prev, balance: v }))}
          type="number"
          placeholder="0"
          icon="money"
        />

        <Button bg="#27D17F" icon="check" disabled={!isFormValid || isSubmitting} onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Simpan Dompet"}
        </Button>
      </div>
    </Modal>
  );
};
