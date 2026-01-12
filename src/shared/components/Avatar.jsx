import { useState } from "react";
import { AvatorSelectModal } from "./modals/AvatorSelectModal";

export function Avatar({ onClick, children }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <>
      <div
        className={`grid place-items-center h-40 w-40 rounded-full bg-white text-8xl hover:cursor-pointer `}
        onMouseEnter={() => {
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onClick={() => onClick()}
      >
        <div className={isHovered ? "opacity-50" : ""}>{children}</div>
      </div>
    </>
  );
}
