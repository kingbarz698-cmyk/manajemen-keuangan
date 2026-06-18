import { useState, type FC, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { AuthLayout } from "@/layouts/AuthLayout";
import { Card, Input, Button, GoogleLogo } from "@/components/ui";
import { PasswordInput } from "@/features/auth/components/PasswordInput";

export const LoginPage: FC = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { colors } = useTheme();
  const { login, loginWithGoogle, isLoading, error } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await login({ email, password });
      navigate("/dashboard");
    } catch {
      // Error is already captured in AuthContext's `error` state
    }
  };

  const handleGoogleLogin = async () => {
    try {
      await loginWithGoogle();
      navigate("/dashboard");
    } catch {
      // Error is already captured in AuthContext's `error` state
    }
  };

  return (
    <AuthLayout>
      <Card className="p-6" rounded="card-lg">
        <h2
          className="font-display font-bold text-[22px] mb-[18px]"
          style={{ color: colors.textPrimary }}
        >
          Masuk
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-3.5">
          <Input label="Email" value={email} onChange={setEmail} type="email" placeholder="nama@email.com" icon="mail" />
          <PasswordInput value={password} onChange={setPassword} />

          {error && (
            <p className="font-body text-sm text-accent-red m-0" role="alert">
              {error}
            </p>
          )}

          <Link
            to="/forgot-password"
            className="font-display font-bold text-[13px] text-right text-accent-green no-underline"
          >
            Lupa Password?
          </Link>

          <Button type="submit" bg="#27D17F" icon="check" disabled={isLoading} className="w-full">
            {isLoading ? "Memproses..." : "Masuk"}
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
          onClick={handleGoogleLogin}
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
          Masuk dengan Google
        </button>
      </Card>

      <p className="text-center mt-5 font-body text-sm" style={{ color: colors.textSecondary }}>
        Belum punya akun?{" "}
        <Link to="/register" className="font-display font-bold text-sm text-accent-green no-underline">
          Daftar
        </Link>
      </p>
    </AuthLayout>
  );
};
