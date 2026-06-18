import type { FC } from "react";

export interface AvatarProps {
  name: string;
  size?: number;
}

export const Avatar: FC<AvatarProps> = ({ name, size = 40 }) => {
  const initials = name
    .split(" ")
    .map((part) => part[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div
      className="rounded-full border-3 border-ink bg-accent-green-light flex items-center justify-center flex-shrink-0"
      style={{ width: size, height: size }}
    >
      <span className="font-display font-extrabold text-ink" style={{ fontSize: size * 0.35 }}>
        {initials}
      </span>
    </div>
  );
};
