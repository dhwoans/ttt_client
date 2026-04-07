import { useRoomState } from "../features/game/hooks/useRoomState";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useMultiPlay } from "../features/game/hooks/useMultiPlay";
import GameRoomView from "../features/game/components/GameRoomView";

export default function MultiGameRoomPage() {
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
