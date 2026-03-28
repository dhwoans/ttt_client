import { motion } from "motion/react";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/managers/AudioManager";
import { useMultiMode } from "../hooks/useMultiMode";
import Badge from "@/shared/components/Badge";
import bustsImg from "@assets/icons/Busts.png";
import Subtitle from "./Subtitle";

const MultiMode = () => {
  const { sfxMuted } = useAudioStore();
  const { handleMultiMode } = useMultiMode();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  return (
    <motion.div
      onMouseDown={playBeep}
      onClick={handleMultiMode}
      className="flex-1 relative bg-sky-300 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-row items-center gap-4 h-full group hover-diagonal-stripes"
    >
      <img
        src={bustsImg}
        alt="멀티플레이 아이콘"
        className="h-16 w-16 object-contain"
      />
      <div>
        <Subtitle text="멀티플레이" className=" text-blue-500" />
        <Badge color="text-blue-500">온라인</Badge>
        <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-3xl font-extrabold text-black drop-shadow-lg">
            멀티플레이
          </span>
        </div>
      </div>
    </motion.div>
  );
};
export default MultiMode;
