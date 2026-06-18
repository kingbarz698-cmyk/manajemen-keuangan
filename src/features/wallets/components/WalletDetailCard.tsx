import type { FC } from "react";
import { Card, Icon, Button } from "@/components/ui";
import { formatRupiah } from "@/utils/format";
import { WALLET_TYPE_LABEL, WALLET_TYPE_ICON } from "@/types";
import type { Wallet } from "@/types";

export interface WalletDetailCardProps {
  wallet: Wallet;
}

export const WalletDetailCard: FC<WalletDetailCardProps> = ({ wallet }) => {
  return (
    <Card bg={wallet.color} rounded="card" className="p-6 mb-3.5">
      <div className="flex justify-between items-start mb-5">
        <div className="bg-white border-3 border-ink rounded-2xl p-2.5 shadow-hard-sm">
          <Icon name={WALLET_TYPE_ICON[wallet.type]} size={22} />
        </div>
        <span className="bg-white border-2 border-ink rounded-pill px-3 py-1 font-display font-bold text-xs">
          {wallet.transactionCount} Transaksi
        </span>
      </div>

      <p className="font-body text-sm mb-1 text-[#3c4a3f]">{WALLET_TYPE_LABEL[wallet.type]}</p>
      <h3 className="font-display font-extrabold text-[26px] m-0 mb-1 tracking-tight text-ink">{wallet.name}</h3>
      <p className="font-display font-extrabold text-[28px] m-0 tracking-tighter text-ink">
        {formatRupiah(wallet.balance)}
      </p>

      <div className="flex gap-2.5 mt-4 pt-3.5 border-t-2 border-[rgba(17,17,17,0.19)]">
        <Button bg="#FFFFFF" icon="plus" className="flex-1 text-[13px] h-11">
          Setor
        </Button>
        <Button bg="#FFFFFF" icon="arrowLeft" className="flex-1 text-[13px] h-11">
          Tarik
        </Button>
      </div>
    </Card>
  );
};
