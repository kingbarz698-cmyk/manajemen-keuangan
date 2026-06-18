import type { FC } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Icon, type IconName } from "@/components/ui";

interface NavItem {
  path: string;
  icon: IconName;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { path: "/dashboard", icon: "grid", label: "Beranda" },
  { path: "/wallets", icon: "wallet", label: "Dompet" },
  { path: "/transactions", icon: "swap", label: "Transaksi" },
  { path: "/goals", icon: "target", label: "Target" },
  { path: "/profile", icon: "person", label: "Profil" },
];

export const BottomNav: FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-1
        rounded-pill border-3 border-ink shadow-hard bg-inverse-light px-3 py-2
        w-[calc(100%-48px)] max-w-[420px]"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = location.pathname === item.path;
        return (
          <button
            key={item.path}
            onClick={() => navigate(item.path)}
            className={`flex-1 h-12 rounded-pill flex flex-col items-center justify-center gap-0.5
              transition-all duration-150
              ${isActive ? "bg-bg-mint border-[2.5px] border-ink shadow-hard-sm text-ink" : "text-inverse-dark"}`}
          >
            <Icon name={item.icon} size={20} strokeWidth={isActive ? 2.5 : 2} />
            <span className={`font-display text-[10px] ${isActive ? "font-bold" : "font-normal"}`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
};
