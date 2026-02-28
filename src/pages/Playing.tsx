import Board from "../features/game/components/Board";
import Players from "../features/game/components/Players";
import GameOverModal from "@/shared/modals/GameOverModal";
import Countdown from "@/shared/components/Countdown";
import ExitModal from "@/shared/modals/ExitModal";
import { useState, useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useGameState } from "../features/game/hooks/useGameState";
import { usePlayerMove } from "../features/game/hooks/usePlayerMove";
import { useAIMove } from "../features/game/hooks/useAIMove";
import { useGameTimeout } from "../features/game/hooks/useGameTimeout";
import { useGameRestart } from "../features/game/hooks/useGameRestart";
import { useSendMove } from "../features/game/hooks/useSendMove";
import { eventManager } from "@/shared/managers/EventManager";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

interface SoloGamePageProps {
  playersInfos: GamePlayerInfo[];
  mode?: "single" | "multi";
  onExit?: () => void;
}
export default function Playing({
  playersInfos,
  mode = "single",
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

  // 게임 핸들러들
  const { handleRestart } = useGameRestart();
  const { sendMove } = useSendMove();

  useEffect(() => {
    handleRestart();
    // 멀티 모드: 다른 플레이어의 이동 수신
    if (mode === "multi") {
      const handleOpponentMove = (data: any) => {
        // 서버에서 받은 상대 플레이어의 이동을 상태에 반영
        // 게임 상태는 서버에서 관리됨
      };
      eventManager.on("OPPONENT_MOVE", handleOpponentMove);
      return () => {
        eventManager.off("OPPONENT_MOVE", handleOpponentMove);
      };
    }
  }, [mode]);

  // 게임 상태 관리
  const {
    board,
    turns,
    winner,
    isDraw,
    isTimeOver,
    isGameOver,
    currentPlayer,
    isPlayerTurn,
    turnStart,
    timeoutBy,
  } = useGameState(playersInfos);

  // 게임 핸들러들
  const { handleSquare: handleSquareSingle } = usePlayerMove(
    isGameOver,
    isPlayerTurn,
    playersInfos,
    turns,
  );
  useAIMove(isGameOver, isPlayerTurn, board, playersInfos);
  const { handleTimeout } = useGameTimeout(currentPlayer.nickname);

  // 모드에 따라 다른 핸들러 사용
  const handleSquare = useCallback(
    (row: number, col: number) => {
      if (mode === "multi") {
        // 멀티 모드: 서버에 좌표 전송
        if (isGameOver || !isPlayerTurn) return;
        sendMove(row, col);
      } else {
        // 싱글 모드: 로컬 상태 업데이트
        handleSquareSingle(row, col);
      }
    },
    [mode, isGameOver, isPlayerTurn, sendMove, handleSquareSingle],
  );

  const isTurn = currentPlayer.nickname;

  return (
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 items-center md:items-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-12 flex flex-col items-center justify-center md:justify-center gap-4">
        <Players playerInfos={playersInfos} isTurn={!isGameOver && isTurn} />
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
