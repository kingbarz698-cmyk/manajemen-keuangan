import type { FC } from "react";

export interface ToggleProps {
  checked: boolean;
  onChange: () => void;
  /** Accessible label, since this renders as a clickable div rather than a native checkbox */
  ariaLabel?: string;
}

export const Toggle: FC<ToggleProps> = ({ checked, onChange, ariaLabel }) => {
  return (
    <div
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      tabIndex={0}
      onClick={onChange}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onChange();
        }
      }}
      className={`w-[52px] h-[30px] rounded-pill border-3 border-ink cursor-pointer relative transition-colors duration-200
        ${checked ? "bg-accent-green" : "bg-border-track-light"}`}
    >
      <div
        className={`absolute top-0.5 w-[18px] h-[18px] rounded-pill bg-white border-2 border-ink transition-all duration-200
          ${checked ? "left-[calc(100%-26px)]" : "left-0.5"}`}
      />
    </div>
  );
};
