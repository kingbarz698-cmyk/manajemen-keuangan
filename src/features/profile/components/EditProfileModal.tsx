import { useState, type FC } from "react";
import { Modal, Input, Button } from "@/components/ui";
import type { User, UpdateProfileInput } from "@/types";

export interface EditProfileModalProps {
  user: User;
  onClose: () => void;
  onSubmit: (input: UpdateProfileInput) => Promise<void>;
}

export const EditProfileModal: FC<EditProfileModalProps> = ({ user, onClose, onSubmit }) => {
  const [form, setForm] = useState<UpdateProfileInput>({
    name: user.name,
    email: user.email,
    phoneNumber: user.phoneNumber ?? "",
    bio: user.bio ?? "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isFormValid = Boolean(form.name) && Boolean(form.email);

  const handleSubmit = async () => {
    if (!isFormValid) return;
    setIsSubmitting(true);
    try {
      await onSubmit(form);
      onClose();
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal title="Edit Profil" onClose={onClose}>
      <div className="flex flex-col gap-4">
        <Input
          label="Nama Lengkap"
          value={form.name}
          onChange={(v) => setForm((prev) => ({ ...prev, name: v }))}
          icon="person"
        />
        <Input
          label="Email"
          value={form.email}
          onChange={(v) => setForm((prev) => ({ ...prev, email: v }))}
          type="email"
          icon="mail"
        />
        <Input
          label="Nomor Telepon"
          value={form.phoneNumber ?? ""}
          onChange={(v) => setForm((prev) => ({ ...prev, phoneNumber: v }))}
          type="tel"
        />
        <Input
          label="Bio"
          value={form.bio ?? ""}
          onChange={(v) => setForm((prev) => ({ ...prev, bio: v }))}
        />
        <Button bg="#27D17F" icon="check" disabled={!isFormValid || isSubmitting} onClick={handleSubmit} className="w-full">
          {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>
    </Modal>
  );
};
