import { useState, type FC } from "react";
import { useNavigate } from "react-router-dom";
import { useTheme } from "@/contexts/ThemeContext";
import { useSettings } from "@/contexts/SettingsContext";
import { useAuth } from "@/contexts/AuthContext";
import { Card, Icon, Button, Modal, SettingsRow } from "@/components/ui";

export const SettingsPage: FC = () => {
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);
  const { colors, isDark, toggleTheme } = useTheme();
  const { settings, toggleBudgetAlert, toggleNotifications, toggleBiometric } = useSettings();
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    setShowLogoutConfirm(false);
    await logout();
    navigate("/login");
  };

  return (
    <div className="px-5 pb-32 max-w-[480px] mx-auto">
      <div className="flex items-center gap-3 pt-14 mb-6">
        <button
          onClick={() => navigate("/profile")}
          className="w-11 h-11 rounded-pill border-3 border-ink cursor-pointer flex items-center justify-center shadow-hard-sm"
          style={{ background: colors.surface }}
          aria-label="Kembali"
        >
          <Icon name="arrowLeft" size={20} />
        </button>
        <h1
          className="font-display font-extrabold text-[28px] m-0 tracking-tight"
          style={{ color: colors.textPrimary }}
        >
          Pengaturan
        </h1>
      </div>

      {/* Account */}
      <Card bg="#DFF8EE" className="p-[18px] mb-4">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Icon name="person" size={20} />
          <h3 className="font-display font-bold text-[17px] m-0 text-ink">Akun</h3>
        </div>
        <SettingsRow icon="edit" label="Edit Profil" onClick={() => navigate("/profile")} />
        <SettingsRow icon="lock" label="Ubah Password" onClick={() => {}} />
        <SettingsRow icon="mail" label="Verifikasi Email" value="Terverifikasi" onClick={() => {}} />
      </Card>

      {/* App */}
      <Card bg="#e8ddff" className="p-[18px] mb-4">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Icon name="settings" size={20} />
          <h3 className="font-display font-bold text-[17px] m-0 text-ink">Aplikasi</h3>
        </div>
        <SettingsRow icon={isDark ? "moon" : "sun"} label="Mode Gelap" toggle toggleValue={isDark} onToggle={toggleTheme} />
        <SettingsRow
          icon="bell"
          label="Notifikasi"
          toggle
          toggleValue={settings.notificationsEnabled}
          onToggle={toggleNotifications}
        />
        <SettingsRow icon="globe" label="Bahasa" value={settings.language} onClick={() => {}} />
      </Card>

      {/* Financial */}
      <Card bg="#ffe07e" className="p-[18px] mb-4">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Icon name="bank" size={20} />
          <h3 className="font-display font-bold text-[17px] m-0 text-ink">Keuangan</h3>
        </div>
        <SettingsRow icon="target" label="Kelola Anggaran" onClick={() => navigate("/budget")} />
        <SettingsRow icon="money" label="Mata Uang" value={settings.currency} onClick={() => {}} />
        <SettingsRow
          icon="bell"
          label="Peringatan Anggaran"
          toggle
          toggleValue={settings.budgetAlertEnabled}
          onToggle={toggleBudgetAlert}
        />
        <SettingsRow icon="download" label="Ekspor Data" value="XLSX / CSV / JSON" onClick={() => {}} />
        <SettingsRow icon="refresh" label="Backup & Restore" onClick={() => {}} />
      </Card>

      {/* Security */}
      <Card bg="#9ED9FF" className="p-[18px] mb-4">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Icon name="shield" size={20} />
          <h3 className="font-display font-bold text-[17px] m-0 text-ink">Keamanan</h3>
        </div>
        <SettingsRow
          icon="fingerprint"
          label="FaceID / Sidik Jari"
          toggle
          toggleValue={settings.biometricEnabled}
          onToggle={toggleBiometric}
        />
        <SettingsRow icon="link" label="Sesi Aktif" value="1 perangkat" onClick={() => {}} />
      </Card>

      {/* About */}
      <Card className="p-[18px] mb-4">
        <div className="flex items-center gap-2.5 mb-3.5">
          <Icon name="info" size={20} />
          <h3 className="font-display font-bold text-[17px] m-0" style={{ color: colors.textPrimary }}>
            Tentang
          </h3>
        </div>
        <SettingsRow icon="helpCircle" label="Bantuan & FAQ" onClick={() => {}} />
        <SettingsRow icon="document" label="Syarat & Kebijakan Privasi" onClick={() => {}} />
        <SettingsRow icon="info" label="Versi Aplikasi" value={settings.appVersion} onClick={() => {}} />
      </Card>

      <Button bg="#FF6B6B" icon="logout" onClick={() => setShowLogoutConfirm(true)} className="w-full">
        Keluar
      </Button>

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
