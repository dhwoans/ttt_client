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

export default function Room() {
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

  // 커스텀 훅으로 이벤트 처리 로직 분리
  useGamePhaseEvents(setPhase);
  useMultiplayerPlayers(mode, setPlayersInfos, setPlayersReadyStatus);
  useReceivePlayerReady(mode, setPlayersReadyStatus);
  useReceivePlayerLeave(mode, phase, setPlayersInfos, setPlayersReadyStatus);

  const handleReady = (isReady: boolean) => {
    if (mode === "single") {
      if (isReady) {
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
    localStorage.removeItem("singleGameState");
    sessionStorage.removeItem("roomId");
    sessionStorage.removeItem("gameMode");
    navigate("/lobby");
  };

  const handleRestartToReady = () => {
    // 게임 종료 후 다시하기는 준비 화면으로 돌아가서 다시 ready를 받는다.
    setPhase("ready");
    localStorage.removeItem("singleGameState");

    if (mode === "multi") {
      // 멀티는 다시 ready 상태를 서버와 동기화한다.
      sendReady(false);
    }
  };

  return (
    <>
      <Nav />
      <ToastContainer
        position="top-center"
        autoClose={3000}
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
          onRestart={handleRestartToReady}
        />
      )}
    </>
  );
}
