import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Avatar } from "@/shared/components/Avatar";
import { animalList } from "@/shared/constants/avatarCandidates";
import SettingsModal from "@/shared/modals/SettingsModal";
import { audioManager } from "@/shared/utils/AudioManager";
import { useAudioStore } from "@/stores/audioStore";

export default function Nav() {
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { bgmMuted, volume, setBgmMuted } = useAudioStore();
  const index = sessionStorage.getItem("avator") || 3;
  const nickname = sessionStorage.getItem("nickname");
  const navigate = useNavigate();

  const handleMute = () => {
    const newMutedState = !bgmMuted;
    if (newMutedState) {
      audioManager.setOff("bgm");
    } else {
      audioManager.setOn("bgm");
    }
    setBgmMuted(newMutedState);
  };

  return (
    <>
      <nav className="flex items-center justify-between px-4 md:px-6 py-3 md:py-4 bg-dark-1/10 backdrop-blur-md">
        <div className="flex items-center gap-2 md:gap-4">
          <Avatar size="small">{animalList[Number(index)][0]}</Avatar>
          <div className="flex flex-col">
            <p className="text-xs md:text-sm text-dark-2">플레이어</p>
            <p className="text-base md:text-lg font-bold text-dark-2 truncate max-w-30 md:max-w-none">
              {nickname}
            </p>
          </div>
        </div>
      </nav>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
