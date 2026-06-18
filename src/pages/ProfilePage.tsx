import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useAuth } from "@/contexts/AuthContext";
import { useWallets } from "@/hooks/useWallets";
import { useGoals } from "@/hooks/useGoals";
import { Card, Icon, Button, Modal } from "@/components/ui";
import type { IconName } from "@/components/ui";
import { ProfileHeroCard } from "@/features/profile/components/ProfileHeroCard";
import { ProfileInfoCards } from "@/features/profile/components/ProfileInfoCards";
import { DarkModeToggleCard } from "@/features/profile/components/DarkModeToggleCard";
import { EditProfileModal } from "@/features/profile/components/EditProfileModal";

interface ProfileMenuItem {
  icon: IconName;
  label: string;
  action: () => void;
  danger?: boolean;
}

export const ProfilePage: FC = () => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { colors } = useTheme();
  const { user, updateProfile, logout } = useAuth();
  const { totalBalance, isLoading: walletsLoading } = useWallets();
  const { goals, isLoading: goalsLoading } = useGoals();
  const navigate = useNavigate();

  const isLoading = walletsLoading || goalsLoading || !user;

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/login");
  };

  if (isLoading || !user) {
    return (
      <div className="px-5 pt-14 pb-32 max-w-[480px] mx-auto">
        <p className="font-body text-sm" style={{ color: colors.textSecondary }}>
          Memuat data...
        </p>
      </div>
    );
  }

  const menuItems: ProfileMenuItem[] = [
    { icon: "edit", label: "Edit Profil", action: () => setShowEditModal(true) },
    { icon: "settings", label: "Pengaturan", action: () => navigate("/settings") },
    { icon: "shield", label: "Keamanan & Password", action: () => {} },
    { icon: "bell", label: "Notifikasi", action: () => {} },
    { icon: "download", label: "Ekspor Data", action: () => {} },
    { icon: "logout", label: "Keluar", action: () => setShowLogoutConfirm(true), danger: true },
  ];

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      <div className="pt-14 mb-6">
        <h1
          className="font-display font-extrabold text-[30px] m-0"
          style={{ color: colors.textPrimary }}
        >
          Profil
        </h1>
      </div>

      <ProfileHeroCard user={user} />
      <ProfileInfoCards totalBalance={totalBalance} activeGoalsCount={goals.length} />
      <DarkModeToggleCard />

      {menuItems.map((item) => (
        <Card
          key={item.label}
          bg={item.danger ? colors.redLightBg : colors.surfaceContainer}
          rounded="2xl"
          className="px-4 mb-2.5"
          onClick={item.action}
        >
          <div className="h-[68px] flex items-center justify-between">
            <div className="flex items-center gap-3.5">
              <div
                className="w-10 h-10 rounded-xl border-[2.5px] border-ink flex items-center justify-center"
                style={{ background: item.danger ? "#FF6B6B" : colors.surface, color: colors.textPrimary }}
              >
                <Icon name={item.icon} size={20} />
              </div>
              <span
                className="font-display font-bold text-base"
                style={{ color: item.danger ? "#ba1a1a" : colors.textPrimary }}
              >
                {item.label}
              </span>
            </div>
            <Icon name="chevronRight" size={20} />
          </div>
        </Card>
      ))}

      {showEditModal && (
        <EditProfileModal user={user} onClose={() => setShowEditModal(false)} onSubmit={updateProfile} />
      )}

      {showLogoutConfirm && (
        <Modal title="Keluar dari Làsave?" onClose={() => setShowLogoutConfirm(false)}>
          <p className="font-body text-[15px] mb-5" style={{ color: colors.textSecondary }}>
            Kamu perlu login kembali untuk mengakses data keuanganmu.
          </p>
          <div className="flex gap-3">
            <Button bg={colors.surface} color={colors.textPrimary} onClick={() => setShowLogoutConfirm(false)} className="flex-1">
              Batal
            </Button>
            <Button bg="#FF6B6B" icon="logout" onClick={handleLogout} className="flex-1">
              Keluar
            </Button>
          </div>
        </Modal>
      )}
    </div>
  );
};
