import type { FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon } from "@/components/ui";
import { getCategoryByKey } from "@/utils/categories";
import { formatShort } from "@/utils/format";
import type { Transaction } from "@/types";

export interface TransactionListItemProps {
  transaction: Transaction;
  onClick?: () => void;
}

export const TransactionListItem: FC<TransactionListItemProps> = ({ transaction, onClick }) => {
  const { colors } = useTheme();
  const category = getCategoryByKey(transaction.category);
  const isIncome = transaction.type === "income";

  return (
    <Card onClick={onClick} rounded="2xl" className="p-3.5 mb-2.5 shadow-hard-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-pill border-3 border-ink flex items-center justify-center shadow-hard-sm flex-shrink-0"
            style={{ background: category?.color ?? colors.borderTrack }}
          >
            <Icon name={category?.icon ?? "money"} size={20} />
          </div>
          <div>
            <p className="font-display font-bold text-[15px] m-0" style={{ color: colors.textPrimary }}>
              {transaction.name}
            </p>
            <p className="font-body text-xs m-0" style={{ color: colors.textSecondary }}>
              {transaction.walletName} · {transaction.time}
            </p>
          </div>
        </div>
        <span
          className={`font-display font-extrabold text-base ${isIncome ? "text-accent-green" : "text-accent-red"}`}
        >
          {isIncome ? "+" : "-"}
          {formatShort(transaction.amount)}
        </span>
      </div>
    </Card>
  );
};
