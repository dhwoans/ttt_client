import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { ToastContainer } from "react-toastify";
import Playing from "./Playing";
import Ready from "./Ready";
import Nav from "@/shared/components/Nav";
import { useRoomState } from "../features/game/hooks/useRoomState";
import { useSendPlayerReady } from "../features/game/hooks/useSendPlayerReady";
import { useSendPlayerLeave } from "../features/game/hooks/useSendPlayerLeave";
import { useGamePhaseEvents } from "../features/game/hooks/useGamePhaseEvents";
import { useMultiplayerPlayers } from "../features/game/hooks/useMultiplayerPlayers";
import { useReceivePlayerReady } from "../features/game/hooks/useReceivePlayerReady";
import { useReceivePlayerLeave } from "../features/game/hooks/useReceivePlayerLeave";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useReadyTimeoutHandler } from "../features/game/hooks/useReadyTimeoutHandler";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { clearGameSession } from "@/shared/utils/playerStorage";

// 시작전 게임정보 저장
const preprocessGameStart = (botInfo: any) => {
  localStorage.setItem(
    "gameState",
    JSON.stringify({
      phase: "playing",
      bot: botInfo,
      turnStart: Date.now(),
      moveHistory: [],
      timeoutBy: null,
    }),
  );
};

export default function GameRoomPage() {
  const navigate = useNavigate();
  const { sendReady } = useSendPlayerReady();
  const { sendLeave } = useSendPlayerLeave();
  const { playersInfos, setPlayersInfos, phase, setPhase, mode } =
    useRoomState();

  const [playersReadyStatus, setPlayersReadyStatus] = useState<
    Record<string, boolean>
  >({});

  // 마운트/언마운트 로그
  useEffect(() => {
    console.log("[GameRoomPage] 마운트됨");
    return () => {
      console.log("[GameRoomPage] 언마운트됨 - 모든 리스너 정리됨");
    };
  }, []);

  // 이벤트 처리 로직
  useGamePhaseEvents(setPhase);
  useMultiplayerPlayers(mode, setPlayersInfos, setPlayersReadyStatus);
  useReceivePlayerReady(mode, setPlayersReadyStatus);
  useReceivePlayerLeave(mode, phase, setPlayersInfos, setPlayersReadyStatus);
  useReadyTimeoutHandler();

  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  const handleReady = (isReady: boolean) => {
    if (mode === "single") {
      if (isReady) {
        // 싱글 게임 시작 직전에 로컬 상태 초기화
        resetGame();
        setPhase("playing");
        const bot = playersInfos[1];
        const botInfo = [bot?.avatar, bot?.nickname, bot?.imageSrc];
        preprocessGameStart(botInfo);
      }
    } else {
      console.log("[room] handleReady 호출, isReady:", isReady);
      sendReady(isReady);
    }
  };

  const handleExit = () => {
    if (mode !== "single") {
      sendLeave();
    }
    resetGame();
    clearGameSession();
    navigate("/lobby");
  };

  const { handleRestart } = useGameRestart({
    setPhase,
    mode,
    sendReady,
    handleReady,
  });

  return (
    <>
      <Nav />
      <ToastContainer
        position="top-center"
        autoClose={3000}
        limit={1}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
      {phase === "ready" ? (
        <Ready
          onReady={handleReady}
          onExit={handleExit}
          playersInfos={playersInfos}
          playersReadyStatus={playersReadyStatus}
          mode={mode}
        />
      ) : (
        <Playing
          playersInfos={playersInfos}
          mode={mode}
          onExit={handleExit}
          onRestart={handleRestart}
        />
      )}
    </>
  );
}
