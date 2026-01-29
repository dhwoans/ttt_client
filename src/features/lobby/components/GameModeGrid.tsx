import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "motion/react";
import { Users, User, Home, LogOut, Settings } from "lucide-react";
import { Avatar } from "@/shared/components/Avatar";
import { animalList } from "@/shared/utils/randomAvatar";
import { useAudioStore } from "@/stores/audioStore";
import SettingsModal from "@/shared/modals/SettingsModal";
import { audioManager } from "@/shared/utils/AudioManager";
import { apiManager } from "@/shared/utils/ApiManager";

export default function GameModeGrid() {
  const navigate = useNavigate();
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { sfxMuted } = useAudioStore();
  const index = sessionStorage.getItem("avator") || 3;
  const nickname = sessionStorage.getItem("nickname");

  const playBeep = () => {
    if (!sfxMuted) {
      audioManager.play("beep");
    }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate("/login", { replace: true });
  };

  const handleMultiMode = () => {
    // 기존 방 만들기 로직 사용
    alert("멀티플레이어 모드: 방 목록으로 이동");
  };

  const handleSingleMode = () => {
    // 싱글 모드는 서버 연결 없이 게임 페이지로 이동
    navigate("/game/single");
  };

  const handleLocalMode = async () => {
    // 로컬 모드는 서버로 방 생성 요청
    const userId = sessionStorage.getItem("userId");
    if (!userId || !nickname) {
      alert("로그인 정보가 없습니다.");
      return;
    }

    try {
      const result = await apiManager.createRoom(userId, nickname);
      if (result && result.success) {
        const roomId = result.message;
        sessionStorage.setItem("roomId", roomId);
        navigate(`/game/${roomId}`);
      } else {
        alert("방 생성에 실패했습니다.");
      }
    } catch (error) {
      console.error("방 생성 오류:", error);
      alert("방 생성 중 오류가 발생했습니다.");
    }
  };

  // 부유하는 애니메이션 정의
  const floatingVariants = {
    float: (index: number) => ({
      y: [0, -15, 0],
      transition: {
        duration: 3 + index * 0.3,
        repeat: Infinity,
        ease: "easeInOut",
      },
    }),
  };

  return (
    <>
      {/* Bento Grid */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-4 md:grid-rows-2 gap-3 md:gap-4 w-full"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.08, delayChildren: 0.05 },
          },
        }}
        initial="hidden"
        animate="show"
      >
        {/* 플레이어 정보 카드 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            },
          }}
          className="md:col-span-2 md:row-span-2 bg-blue-600 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-1 md:p-1.5 flex flex-col items-center justify-center min-h-12 md:min-h-16"
        >
          <Avatar size="large">{animalList[Number(index)][0]}</Avatar>
          <p className="text-xs text-white mt-3">플레이어</p>
          <p className="text-sm font-bold text-white text-center truncate max-w-full mt-1">
            {nickname}
          </p>
        </motion.div>

        {/* 설정 카드 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            },
          }}
          onMouseDown={playBeep}
          onClick={() => setIsSettingsOpen(true)}
          className="relative bg-yellow-400 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-0.5 md:p-1 flex flex-col items-center justify-center min-h-10 md:min-h-12 group hover-diagonal-stripes"
        >
          <img
            src="/assets/icons/Gear.png"
            alt="설정 기어"
            className="h-16 w-16 object/contain mb-2 drop-shadow"
          />
          <p className="font-bold text-white">설정</p>
          <p className="text-xs text-white/70 mt-1">음량 조절</p>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-black text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            설정
          </div>
        </motion.div>

        {/* 나가기 카드 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            },
          }}
          onMouseDown={playBeep}
          onClick={handleLogout}
          className="relative bg-red-500 rounded-2xl border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-1.5 hover:translate-y-1.5 transition-all cursor-pointer p-0.5 md:p-1 flex flex-col items-center justify-center min-h-10 md:min-h-12 group hover-diagonal-stripes"
        >
          <img
            src="/assets/icons/Waving_Hand.png"
            alt="나가기 손인사"
            className="h-16 w-16 object-contain mb-2 drop-shadow"
          />
          <p className="font-bold text-white">나가기</p>
          <p className="text-xs text-white/70 mt-1">로그아웃</p>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-black text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            나가기
          </div>
        </motion.div>

        {/* 멀티플레이어 모드 - 큰 카드 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            },
          }}
          onMouseDown={playBeep}
          onClick={handleMultiMode}
          className="
          relative
          md:col-span-2 
          bg-indigo-600 rounded-2xl 
          border-4 border-black 
          shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
          hover:shadow-none 
          hover:translate-x-1.5 hover:translate-y-1.5 
          transition-all 
          cursor-pointer 
          p-1 md:p-1.5
          flex flex-row justify-between items-center gap-3
          min-h-15 md:min-h-18
          group
          hover-diagonal-stripes
        "
        >
          <div className="flex flex-col items-center justify-center">
            <img
              src="/assets/icons/Busts.png"
              alt="멀티플레이 아이콘"
              className="h-24 w-24 object-contain"
            />
          </div>
          <div className="flex flex-col items-start justify-center flex-1">
            <h3 className="text-3xl md:text-4xl font-bold text-white mb-2">
              멀티플레이
            </h3>
            <p className="text-white/80 text-lg">
              온라인으로 전 세계 플레이어와 대결하세요
            </p>
            <div className="flex gap-2 mt-3">
              <span className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-indigo-600">
                온라인
              </span>
              <span className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-indigo-600">
                채팅
              </span>
            </div>
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-black text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            멀티플레이
          </div>
        </motion.div>

        {/* 싱글플레이어 모드 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            },
          }}
          onMouseDown={playBeep}
          onClick={handleSingleMode}
          className="
          relative
          bg-yellow-500 rounded-2xl 
          border-4 border-black 
          shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
          hover:shadow-none 
          hover:translate-x-1.5 hover:translate-y-1.5 
          transition-all 
          cursor-pointer 
          p-1 md:p-1.5
          flex flex-col justify-between
          min-h-15 md:min-h-18
          group
          hover-diagonal-stripes
        "
        >
          <div>
            <img
              src="/assets/bots/Robot.png"
              alt="싱글플레이 로봇"
              className="h-14 w-14 object-contain mb-1 drop-shadow"
            />
            <h3 className="text-2xl md:text-3xl font-bold text-white mb-3">
              싱글플레이
            </h3>
            <p className="text-white/80 text-base">
              AI와 대결하며 실력을 키우세요
            </p>
            <div className="mt-4">
              <span className="px-3 py-1 bg-white rounded-lg text-sm font-bold text-yellow-500">
                AI 대전
              </span>
            </div>
          </div>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-black text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            싱글플레이
          </div>
        </motion.div>

        {/* 로컬 모드 */}
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 20, scale: 0.98 },
            show: {
              opacity: 1,
              y: 0,
              scale: 1,
              transition: { type: "spring", stiffness: 220, damping: 18 },
            },
          }}
          onMouseDown={playBeep}
          onClick={handleLocalMode}
          className="
          relative
          bg-lime-500 rounded-2xl 
          border-4 border-black 
          shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] 
          hover:shadow-none 
          hover:translate-x-1.5 hover:translate-y-1.5 
          transition-all 
          cursor-pointer 
          p-0.5 md:p-1
          flex flex-col items-center justify-center
          min-h-9 md:min-h-11
          group
          hover-diagonal-stripes
        "
        >
          <img
            src="/assets/icons/Bust.png"
            alt="로컬 모드 아이콘"
            className="h-16 w-16 object-contain mb-1"
          />
          <h3 className="text-lg md:text-xl font-bold text-white mb-1">
            로컬 모드
          </h3>
          <p className="text-xs text-white text-center mb-2">오프라인</p>
          <div className="absolute inset-0 z-20 flex items-center justify-center text-black text-2xl md:text-3xl font-extrabold opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
            로컬 모드
          </div>
        </motion.div>
      </motion.div>

      <SettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </>
  );
}
