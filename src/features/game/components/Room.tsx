import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import GamePage from "../../../pages/GamePage";
import ReadyPage from "../../../pages/ReadyPage";
import Nav from "@/shared/components/Nav";
import { useRoomState } from "../hooks/useRoomState";
import { eventManager } from "@/shared/utils/EventManager";

  // 시작전 게임정보 저장
  const preprocessGameStart = (botInfo: any) => {
    localStorage.setItem(
      "singleGameState",
      JSON.stringify({
        phase: "playing",
        bot: botInfo,
        turnStart: Date.now(),
        turns: [],
        isTimeOver: false,
        timeoutBy: null,
      }),
    );
  };

// GamePlayerInfo 타입은 useRoomState에서 export
export default function Room() {
  // PLAYING 신호 수신 시 phase 변경 및 전처리
  useEffect(() => {
    const handlePlaying = (data: any) => {
      preprocessGameStart(data.bot ?? null);
    };
    eventManager.on("PLAYING", handlePlaying);
    return () => {
      eventManager.off("PLAYING", handlePlaying);
    };
  }, []);

  const navigate = useNavigate();
  const { playersInfos, setPlayersInfos, phase, setPhase, mode } =
    useRoomState();



  // 뷰 이벤트만 담당
  const handleReady = () => {
    if (mode === "single") {
      setPhase("playing");
      const bot = playersInfos[1];
      const botInfo = [bot?.avatar, bot?.nickname, bot?.imageSrc];
      preprocessGameStart(botInfo);
    } else {
      // socket.emit('player_ready');
    }
  };

  const handleExitConfirm = () => {
    localStorage.removeItem("singleGameState");
    navigate("/lobby", { replace: true });
  };

  return (
    <>
      <Nav />
      {phase === "ready" ? (
        <ReadyPage onReady={handleReady} playersInfos={playersInfos} />
      ) : (
        <GamePage playersInfos={playersInfos} onExit={handleExitConfirm} />
      )}
    </>
  );
}
