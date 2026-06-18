import { useState, type FC } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { Card, Icon } from "@/components/ui";
import { parseQuickAdd, type ParsedQuickAdd } from "@/utils/quickAddParser";

export interface QuickAddBarProps {
  onSubmit: (parsed: ParsedQuickAdd) => void;
}

/**
 * Quick-add input for free-text transaction entry (e.g. "+50000 makan siang").
 * PRD §15 Quick Add. Parsing rules are documented in utils/quickAddParser.ts.
 */
export const QuickAddBar: FC<QuickAddBarProps> = ({ onSubmit }) => {
  const [value, setValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { colors } = useTheme();

  const handleSubmit = () => {
    const parsed = parseQuickAdd(value);
    if (!parsed) {
      setError("Format tidak dikenali. Contoh: +50000 gaji atau 25000 makan siang");
      return;
    }
    setError(null);
    onSubmit(parsed);
    setValue("");
  };

  return (
    <Card bg="#ffe07e" className="p-4 mb-4">
      <p className="font-display font-bold text-[13px] uppercase tracking-wide mb-2.5 text-[#564500]">
        Catat Cepat
      </p>
      <div className="flex gap-2.5">
        <input
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            if (error) setError(null);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") handleSubmit();
          }}
          placeholder="+50000 makan siang"
          className="flex-1 h-12 rounded-2xl border-3 border-ink font-body text-[15px]
            outline-none box-border pl-3.5"
          style={{ background: colors.surface, color: colors.textPrimary }}
        />
        <button
          onClick={handleSubmit}
          className="w-12 h-12 rounded-pill border-3 border-ink bg-ink text-white
            cursor-pointer flex items-center justify-center shadow-[3px_3px_0_#33333366]"
          aria-label="Tambah transaksi cepat"
        >
          <Icon name="plus" size={20} />
        </button>
      </div>
      {error && (
        <p className="font-body text-xs mt-2 mb-0 text-[#93000a]" role="alert">
          {error}
        </p>
      )}
    </Card>
  );
};
