import { useRoomState } from "../features/game/hooks/useRoomState";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useSinglePlay } from "../features/game/hooks/useSinglePlay";
import GameRoomView from "../features/game/components/GameRoomView";

const noopSendReady = () => {};

export default function SingleGameRoomPage() {
  const nickname = sessionStorage.getItem("nickname");
  const { playersInfos, setPlayersInfos, phase, setPhase } = useRoomState();
  const mode = "single" as const;

  const { handleReady, handleExit } = useSinglePlay({
    setPhase,
    playersInfos,
    setPlayersInfos,
  });

  const { handleRestart } = useGameRestart({
    setPhase,
    mode,
    sendReady: noopSendReady,
    handleReady,
  });

  return (
    <GameRoomView
      nickname={nickname}
      phase={phase}
      playersInfos={playersInfos}
      playersReadyStatus={{}}
      mode={mode}
      onReady={handleReady}
      onExit={handleExit}
      onRestart={handleRestart}
    />
  );
}
