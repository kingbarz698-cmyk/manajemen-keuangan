import type { FC } from "react";
import { Card, Icon } from "@/components/ui";
import { formatRupiah, formatShort } from "@/utils/format";

export interface TotalBalanceHeroProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export const TotalBalanceHero: FC<TotalBalanceHeroProps> = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <Card bg="#111111" rounded="card-lg" className="p-6 mb-5">
      <p className="font-display text-xs font-bold uppercase tracking-wide mb-1.5 text-[#bbcbbc]">
        Total Saldo
      </p>
      <h2 className="font-display font-extrabold text-[38px] text-white m-0 mb-3 tracking-tight">
        {formatRupiah(totalBalance)}
      </h2>
      <div className="flex gap-2.5">
        <div className="flex-1 flex items-center gap-1.5 rounded-xl px-3 py-2 bg-[#27D17F22] border-2 border-[#27D17F44]">
          <Icon name="trendUp" size={14} className="text-accent-green" />
          <div>
            <p className="font-body text-[10px] m-0 text-[#bbcbbc]">Masuk</p>
            <p className="font-display font-bold text-[13px] m-0 text-accent-green">
              +{formatShort(totalIncome)}
            </p>
          </div>
        </div>
        <div className="flex-1 flex items-center gap-1.5 rounded-xl px-3 py-2 bg-[#FF6B6B22] border-2 border-[#FF6B6B44]">
          <Icon name="trendDown" size={14} className="text-accent-red" />
          <div>
            <p className="font-body text-[10px] m-0 text-[#bbcbbc]">Keluar</p>
            <p className="font-display font-bold text-[13px] m-0 text-accent-red">
              -{formatShort(totalExpense)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
};
