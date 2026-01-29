import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import SoloGamePage from "./SoloGamePage";
// GameStorageManager 대신 singleGameState만 사용
import SingleReady from "./components/SingleReady";
import ExitModal from "@/shared/modals/ExitModal";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { randomBot } from "@/shared/utils/randomBot";
import { animalList } from "@/shared/utils/randomAvatar";
import Nav from "@/shared/components/Nav";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}
// GameManager는 "게임 세션 관리"만 담당(phase, 플레이어, 나가기 등)
// 실제 게임 UI/로직은 props로 주입받아 분리
export default function GameManager() {
  const navigate = useNavigate();
  // singleGameState만 사용
  const saved = localStorage.getItem("singleGameState");
  let initialPhase: "ready" | "playing" = "ready";
  let initialBot: any = undefined;
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      if (parsed.phase === "playing") initialPhase = "playing";
      if (parsed.bot) initialBot = parsed.bot;
    } catch {}
  }
  const [phase, setPhase] = useState<"ready" | "playing">(initialPhase);
  // ExitModal 상태와 핸들러는 SoloGamePage로 이동

  const playersInfos = useMemo<GamePlayerInfo[]>(() => {
    const playerInfo = getPlayerInfoFromStorage();
    let randomBotData;
    if (initialBot) {
      randomBotData = initialBot;
    } else {
      randomBotData = randomBot();
    }
    return [
      {
        nickname: playerInfo.nickname,
        avatar: animalList[playerInfo.avatarIndex][0],
        imageSrc: animalList[playerInfo.avatarIndex][2],
      },
      {
        nickname: randomBotData[1],
        avatar: randomBotData[0],
        imageSrc: randomBotData[2],
      },
    ];
  }, [initialBot]);

  // useBackExitModal, handleExitIntent도 SoloGamePage로 이동

  const handleReady = () => {
    setPhase("playing");
    const bot = playersInfos[1];
    // singleGameState에 phase, bot, turnStart, turns 등 모두 저장
    localStorage.setItem(
      "singleGameState",
      JSON.stringify({
        phase: "playing",
        bot: [bot.avatar, bot.nickname, bot.imageSrc],
        turnStart: Date.now(),
        turns: [],
        isTimeOver: false,
        timeoutBy: null,
      }),
    );
  };

  const handleExitConfirm = () => {
    localStorage.removeItem("singleGameState");
    navigate("/lobby", { replace: true });
  };

  // handleExitCancel도 SoloGamePage로 이동

  return (
    <>
      {/* ExitModal은 SoloGamePage에서 렌더링 */}
      <Nav></Nav>
      {phase === "ready" ? (
        <SingleReady onReady={handleReady} playersInfos={playersInfos} />
      ) : (
        <SoloGamePage playersInfos={playersInfos} onExit={handleExitConfirm} />
      )}
    </>
  );
}
