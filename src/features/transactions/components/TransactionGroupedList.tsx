import { useMemo, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { TransactionListItem } from "./TransactionListItem";
import type { Transaction } from "@/types";

export interface TransactionGroupedListProps {
  transactions: Transaction[];
}

function groupByDate(transactions: Transaction[]): Map<string, Transaction[]> {
  const groups = new Map<string, Transaction[]>();
  for (const tx of transactions) {
    const existing = groups.get(tx.date);
    if (existing) {
      existing.push(tx);
    } else {
      groups.set(tx.date, [tx]);
    }
  }
  return groups;
}

export const TransactionGroupedList: FC<TransactionGroupedListProps> = ({ transactions }) => {
  const { colors } = useTheme();
  const grouped = useMemo(() => groupByDate(transactions), [transactions]);

  if (transactions.length === 0) {
    return (
      <p className="font-body text-sm text-center py-8" style={{ color: colors.textSecondary }}>
        Belum ada transaksi.
      </p>
    );
  }

  return (
    <>
      {Array.from(grouped.entries()).map(([date, txns]) => (
        <div key={date} className="mb-5">
          <p
            className="font-display font-bold text-[13px] uppercase tracking-wide mb-2.5"
            style={{ color: colors.textSecondary }}
          >
            {date}
          </p>
          {txns.map((tx) => (
            <TransactionListItem key={tx.id} transaction={tx} />
          ))}
        </div>
      ))}
    </>
  );
};
