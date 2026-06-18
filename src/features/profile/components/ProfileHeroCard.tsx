import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon } from "@/components/ui";
import type { User } from "@/types";

export interface ProfileHeroCardProps {
  user: User;
  onEditPhoto?: () => void;
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();
}

function formatJoinedDate(isoDate: string): string {
  return new Date(isoDate).toLocaleDateString("id-ID", { month: "long", year: "numeric" });
}

export const ProfileHeroCard: FC<ProfileHeroCardProps> = ({ user, onEditPhoto }) => {
  const { colors } = useTheme();

  return (
    <Card rounded="card-lg" className="p-6 mb-4 text-center relative overflow-hidden">
      <div className="absolute top-0 left-0 right-0 h-20 bg-bg-mint" />

      <div className="relative mb-3.5">
        <div className="w-[100px] h-[100px] rounded-full border-4 border-ink bg-accent-green-light mx-auto mt-5 flex items-center justify-center shadow-hard">
          <span className="font-display font-extrabold text-4xl text-ink">{getInitials(user.name)}</span>
        </div>
        <button
          onClick={onEditPhoto}
          className="absolute bottom-0 right-[calc(50%-60px)] w-[34px] h-[34px] rounded-pill border-3 border-ink bg-accent-green-light
            cursor-pointer flex items-center justify-center shadow-hard-sm"
          aria-label="Ubah foto profil"
        >
          <Icon name="camera" size={16} />
        </button>
      </div>

      <h2 className="font-display font-extrabold text-[26px] m-0 mb-1" style={{ color: colors.textPrimary }}>
        {user.name}
      </h2>
      <p className="font-body text-[15px] m-0 mb-3.5" style={{ color: colors.textSecondary }}>
        {user.email}
      </p>

      <div className="inline-flex items-center gap-1.5 bg-accent-yellow-light border-3 border-ink rounded-pill px-3.5 py-1.5 shadow-hard-sm">
        <Icon name="verified" size={16} />
        <span className="font-display font-bold text-[13px]">Bergabung {formatJoinedDate(user.createdAt)}</span>
      </div>
    </Card>
  );
};
