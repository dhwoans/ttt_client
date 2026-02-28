import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/managers/AudioManager";
import { toast } from "react-toastify";
import Badge from "@/shared/components/Badge";
import robotImg from "@assets/bots/Robot.png";

const SingleMode = () => {
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  const handleSingleMode = () => {
    toast("🤔 알고리즘 구상 중...");
    setTimeout(() => {
      navigate("/game/single", { state: { mode: "single" } });
    }, 1500);
  };
  return (
    <motion.div
      onMouseDown={playBeep}
      onClick={handleSingleMode}
      className="flex-1 relative bg-yellow-500 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center h-full group hover-diagonal-stripes"
    >
      <img
        src={robotImg}
        alt="싱글플레이 로봇"
        className="h-16 w-16 object-contain mb-2 drop-shadow"
      />
      <h3 className="text-2xl font-bold text-white mb-2 transition-opacity duration-200 group-hover:opacity-0">
        싱글플레이
      </h3>
      <Badge color="text-yellow-500">AI 대전</Badge>
      <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
        <span className="text-3xl font-extrabold text-black drop-shadow-lg">
          싱글플레이
        </span>
      </div>
    </motion.div>
  );
};
export default SingleMode;
