import Board from "../features/game/components/Board";
import Players from "../features/game/components/Players";
import GameOverModal from "@/shared/modals/GameOverModal";
import Countdown from "@/shared/components/Countdown";
import { useSoloGame } from "../features/game/hooks/useSoloGame";
import ExitModal from "@/shared/modals/ExitModal";
import { useState, useCallback } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

interface SoloGamePageProps {
  playersInfos: GamePlayerInfo[];
  onExit?: () => void;
}
export default function SoloGamePage({
  playersInfos,
  onExit,
}: SoloGamePageProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const handleExitIntent = useCallback(() => {
    setShowExitModal(true);
  }, []);
  useBackExitModal(handleExitIntent, true);
  const handleExitCancel = () => setShowExitModal(false);
  const handleExit = () => {
    if (onExit) onExit();
  };
  const gameProps = useSoloGame(playersInfos);
  const {
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    isTurn,
    isPlayerTurn,
    turnStart,
    timeoutBy,
    handleSquare,
    handleRestart,
    handleTimeout,
  } = gameProps;

  return (
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 items-center md:items-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-12 flex flex-col items-center justify-center md:justify-center gap-4">
        <Players
          playerInfos={playersInfos}
          isTurn={!isGameOver && isTurn}
          botEffectOnce={true}
        />
        {!isGameOver && (
          <Countdown
            durationMs={10000}
            format="mmss"
            className="text-3xl font-bold text-red-600"
            onComplete={handleTimeout}
            initialStartTime={turnStart}
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-1">
        <Board
          list={board}
          selectSquare={!isGameOver && isPlayerTurn && handleSquare}
        />
      </div>

      {showExitModal && (
        <ExitModal
          onClose={handleExitCancel}
          sender={{ handleLeave: handleExit }}
        />
      )}

      {isGameOver && (turns.length > 0 || isTimeOver) && (
        <GameOverModal
          winner={
            isTimeOver
              ? timeoutBy
                ? playersInfos.find((p) => p.nickname !== timeoutBy)
                    ?.nickname || ""
                : ""
              : isDraw
                ? "DRAW"
                : winner
          }
          handleRestart={handleRestart}
          onExit={handleExit}
        />
      )}
    </main>
  );
}
