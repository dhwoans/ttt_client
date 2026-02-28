import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import Playing from "./Playing";
import Ready from "./Ready";
import Nav from "@/shared/components/Nav";
import { useRoomState } from "../features/game/hooks/useRoomState";
import { eventManager } from "@/shared/managers/EventManager";
import { useSendReady } from "../features/game/hooks/useSendReady";
import { useSendLeave } from "../features/game/hooks/useSendLeave";

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
  const { sendReady } = useSendReady();
  const { sendLeave } = useSendLeave();

  const { playersInfos, setPlayersInfos, phase, setPhase, mode } = useRoomState();

  const handleReady = () => {
    if (mode === "single") {
      setPhase("playing");
      const bot = playersInfos[1];
      const botInfo = [bot?.avatar, bot?.nickname, bot?.imageSrc];
      preprocessGameStart(botInfo);
    } else {
      sendReady(true);
    }
  };
  const handleExit = () => {
    if (mode !== "single") {
      sendLeave();
    }
    navigate("/lobby");
  };

  const handleExitConfirm = () => {
    localStorage.removeItem("singleGameState");
    navigate("/lobby", { replace: true });
  };

  return (
    <>
      <Nav />
      {phase === "ready" ? (
        <Ready
          onReady={handleReady}
          onExit={handleExit}
          playersInfos={playersInfos}
        />
      ) : (
        <Playing playersInfos={playersInfos} onExit={handleExitConfirm} />
      )}
    </>
  );
}
