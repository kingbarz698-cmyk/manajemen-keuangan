import { useState, type FC } from "react";
import { Modal, Input, Button } from "@/components/ui";
import type { CreateGoalInput } from "@/types";

export interface CreateGoalModalProps {
  onClose: () => void;
  onSubmit: (input: CreateGoalInput) => Promise<void>;
}

interface GoalFormState {
  name: string;
  targetAmount: string;
  monthlyTarget: string;
  deadline: string;
}

const INITIAL_FORM: GoalFormState = { name: "", targetAmount: "", monthlyTarget: "", deadline: "" };

export const CreateGoalModal: FC<CreateGoalModalProps> = ({ onClose, onSubmit }) => {
  const [form, setForm] = useState<GoalFormState>(INITIAL_FORM);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid =
    Boolean(form.name) && Boolean(form.targetAmount) && Number(form.targetAmount) > 0 && Boolean(form.deadline);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        monthlyTarget: Number(form.monthlyTarget) || 0,
        deadline: form.deadline,
      });
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Buat Target Baru" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nama Target"
          placeholder="cth. Laptop Baru"
          value={form.name}
          onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
        />
        <Input
          label="Jumlah Target"
          placeholder="0"
          type="number"
          icon="money"
          value={form.targetAmount}
          onChange={(v) => setForm((prev) => ({ ...prev, targetAmount: v }))}
        />
        <Input
          label="Target Bulanan"
          placeholder="0"
          type="number"
          icon="money"
          value={form.monthlyTarget}
          onChange={(v) => setForm((prev) => ({ ...prev, monthlyTarget: v }))}
        />
        <Input
          label="Deadline"
          type="date"
          icon="calendar"
          value={form.deadline}
          onChange={(v) => setForm((prev) => ({ ...prev, deadline: v }))}
        />
        <Button bg="#9E7BFF" color="#FFFFFF" icon="check" disabled={!isFormValid || isSubmitting} onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Buat Target"}
        </Button>
      </div>
    </Modal>
  );
};
