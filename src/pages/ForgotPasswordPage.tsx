import { useState, type FC, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Card, Input, Button, Icon } from "@/components/ui";
import * as authService from "@/services/auth.service";

export const ForgotPasswordPage: FC = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    try {
      await authService.sendPasswordResetEmail(email);
      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Gagal mengirim email reset");
    }
  };

  return (
    <AuthLayout>
      <Card className="p-6" rounded="card-lg">
        <button
          type="button"
          onClick={() => navigate("/login")}
          className="flex items-center gap-1.5 bg-transparent border-none cursor-pointer p-0 mb-3.5 font-display font-bold text-[13px]"
          style={{ color: colors.textSecondary }}
        >
          <Icon name="arrowLeft" size={16} /> Kembali ke Masuk
        </button>
        <h2 className="font-display font-bold text-[22px] mb-2" style={{ color: colors.textPrimary }}>
          Lupa Password
        </h2>

        {!sent ? (
          <>
            <p className="font-body text-sm mb-[18px]" style={{ color: colors.textSecondary }}>
              Masukkan email kamu, kami akan kirim link untuk reset password.
            </p>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
              <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nama@email.com" icon="mail" />
              {error && (
                <p className="font-body text-sm text-accent-red m-0" role="alert">
                  {error}
                </p>
              )}
              <Button type="submit" bg="#27D17F" icon="check" className="w-full">
                Kirim Link Reset
              </Button>
            </form>
          </>
        ) : (
          <div className="text-center py-3">
            <div className="w-[60px] h-[60px] rounded-full border-3 border-ink bg-accent-green-light mx-auto mb-3.5 flex items-center justify-center">
              <Icon name="mail" size={28} />
            </div>
            <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
              Link reset password telah dikirim ke{" "}
              <strong style={{ color: colors.textPrimary }}>{email || "emailmu"}</strong>.
            </p>
          </div>
        )}
      </Card>
    </AuthLayout>
  );
};
