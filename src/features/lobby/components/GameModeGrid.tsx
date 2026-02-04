import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Avatar } from "@/shared/components/Avatar";
import { animalList } from "@/shared/utils/randomAvatar";
import { useAudioStore } from "@/stores/audioStore";
import SettingsModal from "@/shared/modals/SettingsModal";
import { audioManager } from "@/shared/utils/AudioManager";
import { useMultiMode } from "../hooks/useMultiMode";

export default function GameModeGrid() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { sfxMuted } = useAudioStore();
  const index = sessionStorage.getItem("avator") || 3;
  const nickname = sessionStorage.getItem("nickname");
  const { handleMultiMode } = useMultiMode();

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleSingleMode = () => {
    // 싱글 모드로 GameManager에 진입
    navigate("/game/single", { state: { mode: "single" } });
  };

  const handleLocalMode = async () => {
    // 로컬 모드는 서버로 방 생성 요청
  };

  return (
    <>
      <div className="flex flex-row w-full gap-8">
        {/* 왼쪽: 플레이어 정보만 */}
        <motion.div className="flex-1 bg-blue-600 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-8 flex flex-col items-center justify-center min-h-120">
          <Avatar size="large">{animalList[Number(index)][0]}</Avatar>
          <p className="text-2xl text-white mt-6">플레이어</p>
          <p className="text-2xl font-bold text-white text-center truncate max-w-full mt-3">
            {nickname}
          </p>
        </motion.div>
        {/* 오른쪽: 2개(싱글/로컬), 1개(멀티), 2개(설정/나가기) 세로 분할 */}
        <div className="flex flex-col flex-1 gap-6 h-full">
          {/* 1: 싱글/로컬 */}
          <div className="flex flex-row gap-6 flex-1">
            <motion.div
              onMouseDown={playBeep}
              onClick={handleSingleMode}
              className="flex-1 relative bg-yellow-500 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center h-full group hover-diagonal-stripes"
            >
              <img
                src="/assets/bots/Robot.png"
                alt="싱글플레이 로봇"
                className="h-16 w-16 object-contain mb-2 drop-shadow"
              />
              <h3 className="text-2xl font-bold text-white mb-2 transition-opacity duration-200 group-hover:opacity-0">
                싱글플레이
              </h3>
              <span className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-yellow-500 transition-opacity duration-200 group-hover:opacity-0">
                AI 대전
              </span>
              {/* Hover overlay: 제목 중앙 표시 */}
              <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-3xl font-extrabold text-black drop-shadow-lg">
                  싱글플레이
                </span>
              </div>
            </motion.div>
            <motion.div
              onMouseDown={playBeep}
              onClick={handleLocalMode}
              className="flex-1 relative bg-lime-500 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-col items-center justify-center h-full group hover-diagonal-stripes"
            >
              <img
                src="/assets/icons/Bust.png"
                alt="로컬 모드 아이콘"
                className="h-16 w-16 object-contain mb-2"
              />
              <h3 className="text-xl font-bold text-white mb-1 transition-opacity duration-200 group-hover:opacity-0">
                로컬 모드
              </h3>
              <span className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-lime-600 transition-opacity duration-200 group-hover:opacity-0">
                오프라인
              </span>
              <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <span className="text-3xl font-extrabold text-black drop-shadow-lg">
                  로컬 모드
                </span>
              </div>
            </motion.div>
          </div>
          {/* 1: 멀티 */}
          <div className="flex-1 flex items-stretch">
            <motion.div
              onMouseDown={playBeep}
              onClick={handleMultiMode}
              className="flex-1 relative bg-indigo-600 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-6 flex flex-row items-center gap-4 h-full group hover-diagonal-stripes"
            >
              <img
                src="/assets/icons/Busts.png"
                alt="멀티플레이 아이콘"
                className="h-16 w-16 object-contain"
              />
              <div>
                <h3 className="text-2xl font-bold text-white mb-1 transition-opacity duration-200 group-hover:opacity-0">
                  멀티플레이
                </h3>
                <span className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-indigo-600 transition-opacity duration-200 group-hover:opacity-0">
                  온라인
                </span>
                <div className="pointer-events-none select-none absolute inset-0 z-20 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="text-3xl font-extrabold text-black drop-shadow-lg">
                    멀티플레이
                  </span>
                </div>
              </div>
            </motion.div>
          </div>
          {/* 1: 설정/나가기 */}
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
          </div>
        </div>
      </div>
      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
