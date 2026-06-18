import type { FC, ReactNode, MouseEvent } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Icon } from "./Icon";

export interface ModalProps {
  title: string;
  onClose: () => void;
  children: ReactNode;
}

export const Modal: FC<ModalProps> = ({ title, onClose, children }) => {
  const { colors } = useTheme();

  const handleBackdropClick = () => onClose();
  const handleContentClick = (e: MouseEvent<HTMLDivElement>) => e.stopPropagation();

  return (
    <div
      onClick={handleBackdropClick}
      className="fixed inset-0 bg-black/50 z-[200] flex items-end justify-center"
    >
      <div
        onClick={handleContentClick}
        className="w-full max-w-[480px] border-3 border-ink rounded-t-card-lg
          shadow-[0_-6px_0px_#111111] px-6 pt-6 pb-20 max-h-[85vh] overflow-y-auto"
        style={{ background: colors.bgMint }}
      >
        <div className="flex justify-between items-center mb-5">
          <h2 className="font-display font-extrabold text-2xl m-0" style={{ color: colors.textPrimary }}>
            {title}
          </h2>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-pill border-3 border-ink bg-accent-red
              shadow-hard-sm flex items-center justify-center cursor-pointer"
            aria-label="Tutup"
          >
            <Icon name="x" size={18} />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};
