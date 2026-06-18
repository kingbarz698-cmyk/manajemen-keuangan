import type { FC } from "react";
import { Card, ProgressBar } from "@/components/ui";
import { formatRupiah } from "@/utils/format";

export interface GoalsSummaryHeroProps {
  totalTarget: number;
  totalCurrent: number;
}

export const GoalsSummaryHero: FC<GoalsSummaryHeroProps> = ({ totalTarget, totalCurrent }) => {
  return (
    <Card bg="#e8ddff" className="p-6 mb-5" rounded="card-lg">
      <p className="font-display text-xs font-bold uppercase tracking-wide mb-1.5 text-[#5127ad]">
        Total Target Dana
      </p>
      <h2 className="font-display font-extrabold text-[32px] m-0 mb-1 tracking-tight text-ink">
        {formatRupiah(totalTarget)}
      </h2>
      <p className="font-body text-sm mb-4 text-[#5127ad]">Terkumpul: {formatRupiah(totalCurrent)}</p>
      <ProgressBar value={totalCurrent} max={totalTarget} color="#9E7BFF" height={20} />
    </Card>
  );
};
