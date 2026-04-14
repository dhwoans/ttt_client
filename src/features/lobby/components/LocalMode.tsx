import { motion } from "motion/react";
import { useNavigate } from "react-router-dom";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/utils/AudioManager";
import Badge from "@/shared/components/Badge";
import { ImageManager } from "@/shared/utils/ImageManger";
import Subtitle from "./Subtitle";


const LocalMode = () => {
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  const handleLocalMode = () => {
    // navigate(ROUTES.game.)
  };
  return (
    <motion.div
      onMouseDown={playBeep}
      onClick={handleLocalMode}
      className="flex-1 relative bg-[#fd5a46] rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-row items-center justify-center gap-4 h-full group hover-diagonal-stripes"
    >
      <img
        src={ImageManager.joystick}
        alt="로컬 모드 아이콘"
        className="h-16 w-16 object-contain"
      />
      <div className="flex flex-col items-start">
        <Subtitle text="로컬 모드" className="text-[#ffc567]" />
        <Badge>모바일 연동</Badge>
      </div>
      <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-3xl font-extrabold text-black drop-shadow-lg">
          로컬 모드
        </span>
      </div>
    </motion.div>
  );
};
export default LocalMode;
