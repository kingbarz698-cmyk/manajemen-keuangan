import type { FC } from "react";
import { Card } from "@/components/ui";
import { formatShort } from "@/utils/format";

export interface TransactionSummaryRowProps {
  totalIncome: number;
  totalExpense: number;
}

export const TransactionSummaryRow: FC<TransactionSummaryRowProps> = ({ totalIncome, totalExpense }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-5">
      <Card bg="#63fea7" rounded="2xl" className="p-3.5 shadow-hard-md">
        <p className="font-display text-[11px] font-bold uppercase mb-1 text-[#00542e]">Pemasukan</p>
        <p className="font-display font-extrabold text-xl m-0 text-ink">{formatShort(totalIncome)}</p>
      </Card>
      <Card bg="#ffdad6" rounded="2xl" className="p-3.5 shadow-hard-md">
        <p className="font-display text-[11px] font-bold uppercase mb-1 text-[#93000a]">Pengeluaran</p>
        <p className="font-display font-extrabold text-xl m-0 text-ink">{formatShort(totalExpense)}</p>
      </Card>
    </div>
  );
};
