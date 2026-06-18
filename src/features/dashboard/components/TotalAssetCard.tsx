import type { FC } from "react";
import { Card } from "@/components/ui";
import { formatRupiah, formatShort } from "@/utils/format";

export interface TotalAssetCardProps {
  totalBalance: number;
  totalIncome: number;
  totalExpense: number;
}

export const TotalAssetCard: FC<TotalAssetCardProps> = ({ totalBalance, totalIncome, totalExpense }) => {
  return (
    <Card bg="#111111" rounded="card-lg" className="p-6 mb-4 relative overflow-hidden">
      <div className="absolute -top-5 -right-5 w-[120px] h-[120px] rounded-full bg-[#27D17F22]" />
      <div className="absolute -bottom-[30px] -left-[30px] w-[150px] h-[150px] rounded-full bg-[#9E7BFF11]" />

      <p className="font-display font-bold text-xs uppercase tracking-[0.08em] mb-1.5 text-[#bbcbbc]">
        Total Aset
      </p>
      <h2 className="font-display font-extrabold text-[36px] text-white mb-5 tracking-tight">
        {formatRupiah(totalBalance)}
      </h2>

      <div className="flex gap-3 border-t border-[#333] pt-4">
        <div className="flex-1">
          <p className="font-display text-[11px] uppercase mb-1 text-[#bbcbbc]">Pemasukan</p>
          <p className="font-display font-extrabold text-lg m-0 text-accent-green">
            +{formatShort(totalIncome)}
          </p>
        </div>
        <div className="flex-1">
          <p className="font-display text-[11px] uppercase mb-1 text-[#bbcbbc]">Pengeluaran</p>
          <p className="font-display font-extrabold text-lg m-0 text-accent-red">
            -{formatShort(totalExpense)}
          </p>
        </div>
      </div>
    </Card>
  );
};
