import { useState, ReactNode } from "react";

interface AvatarProps {
  size?: "small" | "large";
  onClick?: () => void;
  children?: ReactNode;
  imageSrc?: string;
}

export function Avatar({ size, onClick, children, imageSrc }: AvatarProps) {
  const [isHovered, setIsHovered] = useState(false);
  const hasOnClick = Boolean(onClick);
  const random: string = "❓";
  let wl: string;
  if (size === "small") {
    wl = "h-15 w-15 text-3xl";
  } else {
    wl = "h-50 w-50 text-8xl";
  }
  return (
    <>
      <div
        className={`grid place-items-center ${wl} rounded-full bg-white overflow-hidden ${hasOnClick ? "hover:cursor-pointer" : ""}`}
        onMouseEnter={() => hasOnClick && setIsHovered(true)}
        onMouseLeave={() => hasOnClick && setIsHovered(false)}
        onClick={onClick}
        role={hasOnClick ? "button" : undefined}
        tabIndex={hasOnClick ? 0 : undefined}
      >
        {imageSrc ? (
          <img
            src={imageSrc}
            alt="avatar"
            className={`w-40 h-40 object-cover ${isHovered && hasOnClick ? "opacity-50" : ""}`}
          />
        ) : (
          <div
            className={`flex items-center justify-center text-center ${
              isHovered && hasOnClick ? "opacity-50" : ""
            }`}
          >
            {isHovered && hasOnClick ? random : children}
          </div>
        )}
      </div>
    </>
  );
}
