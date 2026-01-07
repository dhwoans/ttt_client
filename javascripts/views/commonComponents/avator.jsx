import { useState } from "react";
import { AvatorSelectModal } from "../modal/AvatorSelectModal";

export function Avator({ children }) {
  const [isHovered, setIsHovered] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const selectAvator = () => {
    console.log("Avator: click -> open modal");
    setIsModalOpen(true);
  };
  return (
    <div
      className={`flex h-50 w-50 items-center justify-center rounded-full bg-white text-9xl hover:cursor-pointer `}
      onMouseEnter={() => {
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onClick={() => selectAvator()}
    >
      {/* 모달창 */}
      {isModalOpen && (
        <AvatorSelectModal onClose={() => setIsModalOpen(false)} />
      )}
      <div className="relative">
        <div className={isHovered ? "opacity-50" : ""}>{children}</div>
        {isHovered && (
          <div className="absolute inset-0 flex items-center justify-center text-black text-6xl font-bold">
            <span className="material-symbols-outlined">add</span>
          </div>
        )}
      </div>
    </div>
  );
}
