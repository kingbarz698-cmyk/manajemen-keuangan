import type { FC } from "react";
import { Card, Icon } from "@/components/ui";
import { formatRupiah, formatShort } from "@/utils/format";

export interface TotalBalanceHeroProps {
  totalBalance: number;
  totalIncome: number;
}

export const TotalBalanceHero: FC<TotalBalanceHeroProps> = ({ totalBalance, totalIncome }) => {
  return (
    <Card bg="#111111" rounded="card-lg" className="p-6 mb-5">
      <p className="font-display text-xs font-bold uppercase tracking-wide mb-1.5 text-[#bbcbbc]">
        Total Saldo
      </p>
      <h2 className="font-display font-extrabold text-[38px] text-white m-0 mb-1.5 tracking-tight">
        {formatRupiah(totalBalance)}
      </h2>
      <div className="inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 bg-[#27D17F22] border-2 border-[#27D17F44]">
        <Icon name="trendUp" size={14} className="text-accent-green" />
        <span className="font-display font-bold text-[13px] text-accent-green">
          +{formatShort(totalIncome)} bulan ini
        </span>
      </div>
    </Card>
  );
};
