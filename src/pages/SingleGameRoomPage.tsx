import { useRoomState } from "../features/game/hooks/useRoomState";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useSinglePlay } from "../features/game/hooks/useSinglePlay";
import GameRoomView from "./GameRoomView";
import { SingleTicTacToe } from "./TicTacToe";

export default function SingleGameRoomPage() {
  const nickname = sessionStorage.getItem("nickname");
  const { playersInfos, setPlayersInfos, phase, setPhase } = useRoomState();

  const { handleReady, handleExit } = useSinglePlay({
    setPhase,
    playersInfos,
    setPlayersInfos,
  });

  const { handleRestart } = useGameRestart({
    setPhase,
    triggerReady: () => handleReady(true),
  });

  return (
    <GameRoomView
      nickname={nickname}
      phase={phase}
      playersInfos={playersInfos}
      playersReadyStatus={{}}
      onReady={handleReady}
      onExit={handleExit}
      playingView={
        <SingleTicTacToe
          playersInfos={playersInfos}
          onExit={handleExit}
          onRestart={handleRestart}
        />
      }
    />
  );
}
