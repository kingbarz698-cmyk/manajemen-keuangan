import { useState, type FC, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Card, Input, Button, Icon, GoogleLogo } from "@/components/ui";
import { PasswordInput } from "@/features/auth/components/PasswordInput";
import { PASSWORD_REQUIREMENTS } from "@/types";

export const RegisterPage: FC = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const { register, loginWithGoogle, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await register({ name, email, password });
      navigate("/dashboard");
    } catch {
      // Error captured in AuthContext
    }
  };

  const handleGoogleRegister = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      // Error captured in AuthContext
    }
  };

  return (
    <AuthLayout>
      <Card className="p-6" rounded="card-lg">
        <h2 className="font-display font-bold text-[22px] mb-[18px]" style={{ color: colors.textPrimary }}>
          Buat Akun
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Input label="Nama Lengkap" value={name} onChange={setName} placeholder="Nama kamu" icon="person" />
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nama@email.com" icon="mail" />
          <PasswordInput value={password} onChange={setPassword} />

          <div className="grid grid-cols-2 gap-2">
            {PASSWORD_REQUIREMENTS.map((req) => {
              const valid = req.test(password);
              return (
                <div key={req.label} className="flex items-center gap-1.5">
                  <div
                    className="w-[18px] h-[18px] rounded-full border-2 border-ink flex items-center justify-center flex-shrink-0"
                    style={{ background: valid ? "#27D17F" : colors.borderTrack }}
                  >
                    {valid && <Icon name="check" size={11} strokeWidth={3} />}
                  </div>
                  <span className="font-body text-xs" style={{ color: valid ? "#0F6E56" : colors.textSecondary }}>
                    {req.label}
                  </span>
                </div>
              );
            })}
          </div>

          {error && (
            <p className="font-body text-sm text-accent-red m-0" role="alert">
              {error}
            </p>
          )}

          <Button type="submit" bg="#27D17F" icon="check" disabled={isLoading} className="w-full">
            {isLoading ? "Memproses..." : "Daftar Sekarang"}
          </Button>
        </form>

        <div className="flex items-center gap-3 my-4">
          <div className="flex-1 h-[2px]" style={{ background: colors.borderTrack }} />
          <span className="font-body text-xs" style={{ color: colors.textSecondary }}>
            atau
          </span>
          <div className="flex-1 h-[2px]" style={{ background: colors.borderTrack }} />
        </div>

        <button
          type="button"
          onClick={handleGoogleRegister}
          disabled={isLoading}
          className="w-full h-[52px] rounded-pill border-3 border-ink shadow-hard
            font-display font-bold text-[15px]
            flex items-center justify-center gap-2.5
            transition-transform duration-100
            disabled:opacity-50 disabled:cursor-not-allowed
            enabled:cursor-pointer enabled:active:translate-x-0.5 enabled:active:translate-y-0.5 enabled:active:shadow-hard-pressed"
          style={{ background: colors.surface, color: colors.textPrimary }}
        >
          <GoogleLogo size={20} />
          Daftar dengan Google
        </button>
      </Card>

      <p className="text-center mt-5 font-body text-sm" style={{ color: colors.textSecondary }}>
        Sudah punya akun?{" "}
        <Link to="/login" className="font-display font-bold text-sm text-accent-green no-underline">
          Masuk
        </Link>
      </p>
    </AuthLayout>
  );
};
