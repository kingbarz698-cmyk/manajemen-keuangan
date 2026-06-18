import type { FC } from "react";
import { Card } from "@/components/ui";
import { formatShort } from "@/utils/format";

export interface ProfileInfoCardsProps {
  totalBalance: number;
  activeGoalsCount: number;
}

export const ProfileInfoCards: FC<ProfileInfoCardsProps> = ({ totalBalance, activeGoalsCount }) => {
  return (
    <div className="grid grid-cols-2 gap-3 mb-4">
      <Card bg="#63fea7" rounded="2xl" className="p-4 shadow-hard-md">
        <p className="font-display text-xs font-bold uppercase mb-1.5 text-[#00542e]">Total Aset</p>
        <p className="font-display font-extrabold text-lg m-0 text-ink">{formatShort(totalBalance)}</p>
      </Card>
      <Card bg="#e8ddff" rounded="2xl" className="p-4 shadow-hard-md">
        <p className="font-display text-xs font-bold uppercase mb-1.5 text-[#5127ad]">Target Aktif</p>
        <p className="font-display font-extrabold text-lg m-0 text-ink">{activeGoalsCount} target</p>
      </Card>
    </div>
  );
};
