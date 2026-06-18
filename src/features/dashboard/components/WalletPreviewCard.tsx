import type { FC } from "react";
import { Card } from "@/components/ui";
import { formatShort } from "@/utils/format";
import type { Wallet } from "@/types";

export interface WalletPreviewCardProps {
  wallet: Wallet;
  onClick?: () => void;
}

export const WalletPreviewCard: FC<WalletPreviewCardProps> = ({ wallet, onClick }) => {
  return (
    <Card
      bg={wallet.color}
      onClick={onClick}
      rounded="2xl"
      className="min-w-[150px] p-4 flex-shrink-0 shadow-hard-md"
    >
      <p className="font-body text-xs mb-1 text-[#3c4a3f]">{wallet.name}</p>
      <p className="font-display font-extrabold text-lg m-0 tracking-tight text-ink">
        {formatShort(wallet.balance)}
      </p>
    </Card>
  );
};
