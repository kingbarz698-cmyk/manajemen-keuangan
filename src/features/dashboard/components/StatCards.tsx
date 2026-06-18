import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, ProgressBar } from "@/components/ui";
import { formatShort } from "@/utils/format";

export interface SafeToSpendCardProps {
  amountPerDay: number;
}

export const SafeToSpendCard: FC<SafeToSpendCardProps> = ({ amountPerDay }) => {
  return (
    <Card bg="#63fea7" className="p-4">
      <p className="font-display text-[11px] font-bold uppercase tracking-wide mb-1.5 text-[#00542e]">
        Aman Dipakai
      </p>
      <p className="font-display font-extrabold text-[22px] m-0 mb-1 tracking-tight text-ink">
        {formatShort(amountPerDay)}
      </p>
      <p className="font-body text-xs m-0 text-[#00542e]">per hari</p>
    </Card>
  );
};

export interface HealthScoreCardProps {
  score: number;
}

export const HealthScoreCard: FC<HealthScoreCardProps> = ({ score }) => {
  const { colors } = useTheme();

  return (
    <Card className="p-4">
      <p
        className="font-display text-[11px] font-bold uppercase tracking-wide mb-1.5"
        style={{ color: colors.textSecondary }}
      >
        Skor Keuangan
      </p>
      <div className="flex items-center gap-2 mb-2">
        <p className="font-display font-extrabold text-[28px] m-0 text-accent-green">{score}</p>
        <div className="bg-accent-green-light border-2 border-ink rounded-lg px-2 py-0.5">
          <span className="font-display text-[11px] font-bold text-[#00542e]">Baik</span>
        </div>
      </div>
      <ProgressBar value={score} max={100} color="#27D17F" height={10} />
    </Card>
  );
};
