import { useState, useMemo, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon, Button } from "@/components/ui";
import { formatRupiah, formatShort } from "@/utils/format";
import { WALLET_TYPE_LABEL, WALLET_TYPE_ICON } from "@/types";
import { TransactionListItem } from "@/features/transactions/components/TransactionListItem";
import type { Wallet, Transaction } from "@/types";

export interface WalletDetailCardProps {
  wallet: Wallet;
  transactions: Transaction[];
}

export const WalletDetailCard: FC<WalletDetailCardProps> = ({ wallet, transactions }) => {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();

  const walletTxs = useMemo(
    () => transactions.filter((t) => t.walletId === wallet.id),
    [transactions, wallet.id]
  );

  const walletIncome = useMemo(
    () => walletTxs.filter((t) => t.type === "income").reduce((sum, t) => sum + t.amount, 0),
    [walletTxs]
  );

  const walletExpense = useMemo(
    () => walletTxs.filter((t) => t.type === "expense").reduce((sum, t) => sum + t.amount, 0),
    [walletTxs]
  );

  return (
    <Card bg={wallet.color} rounded="card" className="p-6 mb-3.5">
      {/* Header row */}
      <div className="flex justify-between items-start mb-5">
        <div className="bg-white border-3 border-ink rounded-2xl p-2.5 shadow-hard-sm">
          <Icon name={WALLET_TYPE_ICON[wallet.type]} size={22} />
        </div>
        <span className="bg-white border-2 border-ink rounded-pill px-3 py-1 font-display font-bold text-xs">
          {wallet.transactionCount} Transaksi
        </span>
      </div>

      {/* Balance info */}
      <p className="font-body text-sm mb-1 text-[#3c4a3f]">{WALLET_TYPE_LABEL[wallet.type]}</p>
      <h3 className="font-display font-extrabold text-[26px] m-0 mb-1 tracking-tight text-ink">
        {wallet.name}
      </h3>
      <p className="font-display font-extrabold text-[28px] m-0 tracking-tighter text-ink">
        {formatRupiah(wallet.balance)}
      </p>

      {/* Income / Expense summary for this wallet */}
      <div className="flex gap-3 mt-3.5">
        <div className="flex-1 bg-[#00000015] rounded-2xl px-3 py-2.5">
          <p className="font-body text-[11px] m-0 text-[#3c4a3f]">Pemasukan</p>
          <p className="font-display font-bold text-[15px] m-0 text-ink">
            +{formatShort(walletIncome)}
          </p>
        </div>
        <div className="flex-1 bg-[#00000015] rounded-2xl px-3 py-2.5">
          <p className="font-body text-[11px] m-0 text-[#3c4a3f]">Pengeluaran</p>
          <p className="font-display font-bold text-[15px] m-0 text-ink">
            -{formatShort(walletExpense)}
          </p>
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex gap-2.5 mt-4 pt-3.5 border-t-2 border-[rgba(17,17,17,0.19)]">
        <Button bg="#FFFFFF" icon="plus" className="flex-1 text-[13px] h-11">
          Setor
        </Button>
        <Button bg="#FFFFFF" icon="arrowLeft" className="flex-1 text-[13px] h-11">
          Tarik
        </Button>
        <button
          onClick={() => setExpanded((v) => !v)}
          className="w-11 h-11 rounded-2xl border-3 border-ink bg-white flex items-center justify-center
            cursor-pointer shadow-hard-sm flex-shrink-0"
          aria-label={expanded ? "Sembunyikan transaksi" : "Tampilkan transaksi"}
        >
          <Icon name={expanded ? "chevronUp" : "chevronDown"} size={18} />
        </button>
      </div>

      {/* Transaction list — visible only when expanded */}
      {expanded && (
        <div className="mt-4 pt-4 border-t-2 border-[rgba(17,17,17,0.12)]">
          <p
            className="font-display font-bold text-[13px] uppercase tracking-wide mb-3"
            style={{ color: colors.textSecondary }}
          >
            Riwayat Transaksi
          </p>
          {walletTxs.length === 0 ? (
            <p className="font-body text-sm text-center py-4" style={{ color: colors.textSecondary }}>
              Belum ada transaksi untuk dompet ini.
            </p>
          ) : (
            walletTxs.map((tx) => <TransactionListItem key={tx.id} transaction={tx} />)
          )}
        </div>
      )}
    </Card>
  );
};
