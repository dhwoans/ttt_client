import { useRoomState } from "../features/game/hooks/useRoomState";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useMultiPlay } from "../features/game/hooks/useMultiPlay";
import GameRoomView from "../features/game/components/GameRoomView";
import { Navigate, useParams } from "react-router-dom";
import { useGameSocketConnection } from "../features/game/hooks/useGameSocketConnection";
import { ROUTES } from "@/shared/constants/routes";

export default function MultiGameRoomPage() {
  const { roomId } = useParams<{ roomId: string }>();

  if (!roomId) {
    return <Navigate to={ROUTES.lobby} replace />;
  }

  useGameSocketConnection(roomId);

  const nickname = sessionStorage.getItem("nickname");
  const { playersInfos, setPlayersInfos, phase, setPhase } = useRoomState();
  const mode = "multi" as const;

  const multiPlay = useMultiPlay({ setPlayersInfos, phase, setPhase });

  const { handleRestart } = useGameRestart({
    setPhase,
    mode,
    sendReady: multiPlay.sendReady,
    handleReady: multiPlay.handleReady,
  });

  return (
    <GameRoomView
      nickname={nickname}
      phase={phase}
      playersInfos={playersInfos}
      playersReadyStatus={multiPlay.playersReadyStatus}
      mode={mode}
      onReady={multiPlay.handleReady}
      onExit={multiPlay.handleExit}
      onRestart={handleRestart}
    />
  );
}
