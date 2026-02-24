import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import SettingsModal from "@/shared/modals/SettingsModal";
import { useAudioStore } from "@/stores/audioStore";
import { audioManager } from "@/shared/managers/AudioManager";

const SettingsAndLogout = () => {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const navigate = useNavigate();
  const { sfxMuted } = useAudioStore();
  const playBeep = () => {
    if (!sfxMuted) audioManager.play("beep");
  };
  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };
  return (
    <div className="flex flex-row gap-6 flex-1">
      <motion.div
        onMouseDown={playBeep}
        onClick={() => setIsSettingsOpen(true)}
        className="flex-1 relative bg-yellow-400 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center h-full group hover-diagonal-stripes"
      >
        <img
          src="/assets/icons/Gear.png"
          alt="설정 기어"
          className="h-16 w-16 object-contain mb-2 drop-shadow"
        />
        <p className="font-bold text-white transition-opacity duration-200 group-hover:opacity-0">
          설정
        </p>
        <p className="text-xs text-white/70 mt-1 transition-opacity duration-200 group-hover:opacity-0">
          음량 조절
        </p>
        <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-3xl font-extrabold text-black drop-shadow-lg">
            설정
          </span>
        </div>
      </motion.div>
      <motion.div
        onMouseDown={playBeep}
        onClick={handleLogout}
        className="flex-1 relative bg-red-500 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center h-full group hover-diagonal-stripes"
      >
        <img
          src="/assets/icons/Waving_Hand.png"
          alt="나가기 손인사"
          className="h-16 w-16 object-contain mb-2 drop-shadow"
        />
        <p className="font-bold text-white transition-opacity duration-200 group-hover:opacity-0">
          나가기
        </p>
        <p className="text-xs text-white/70 mt-1 transition-opacity duration-200 group-hover:opacity-0">
          로그아웃
        </p>
        <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <span className="text-3xl font-extrabold text-black drop-shadow-lg">
            나가기
          </span>
        </div>
      </motion.div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
export default SettingsAndLogout;
