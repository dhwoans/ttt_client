import Board from "../features/game/components/Board";
import Players from "../features/game/components/Players";
import GameOverModal from "@/shared/modals/GameOverModal";
import Countdown from "@/shared/components/Countdown";
import ExitModal from "@/shared/modals/ExitModal";
import { useState, useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { calcBoard, whoIsWin } from "../features/game/util/ticTacToeUtils";
import { useAIMove } from "../features/game/hooks/useAIMove";
import { useGameTimeout } from "../features/game/hooks/useGameTimeout";
import { useNextTurn } from "../features/game/hooks/useNextTurn";
import { useReceiveMoveMade } from "../features/game/hooks/useReceiveMoveMade";
import { useReceiveGameOver } from "../features/game/hooks/useReceiveGameOver";
import { useReceiveGameStateUpdate } from "../features/game/hooks/useReceiveGameStateUpdate";
import { useReceiveNextTurn } from "../features/game/hooks/useReceiveNextTurn";
import { useReceiveTurnTimeoutStarted } from "../features/game/hooks/useReceiveTurnTimeoutStarted";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
}

interface PlayingProps {
  playersInfos: GamePlayerInfo[];
  mode?: "single" | "multi";
  onExit?: () => void;
  onRestart?: () => void;
}
export default function Playing({
  playersInfos,
  mode = "single",
  onExit,
  onRestart,
}: PlayingProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(
    () => sessionStorage.getItem("currentTurnPlayerId"),
  );
  const [isWaitingForServer, setIsWaitingForServer] = useState(false);
  const handleExitIntent = useCallback(() => {
    setShowExitModal(true);
  }, []);
  useBackExitModal(handleExitIntent, true);
  const handleExitCancel = () => setShowExitModal(false);
  const handleExit = () => {
    onExit?.();
  };

  // 멀티플레이 이벤트 구독
  useReceiveMoveMade(mode, playersInfos, setIsWaitingForServer);
  useReceiveGameOver();
  useReceiveGameStateUpdate(setCurrentTurnPlayerId);
  const { currentTurnPlayerId: receivedTurnPlayerId } = useReceiveNextTurn();
  const { turnTimeoutMs, turnTimeoutStartedAt } = useReceiveTurnTimeoutStarted(
    mode,
    setCurrentTurnPlayerId,
  );

  // receivedTurnPlayerId 업데이트 감지
  useEffect(() => {
    if (receivedTurnPlayerId) {
      setCurrentTurnPlayerId(receivedTurnPlayerId);
    }
  }, [receivedTurnPlayerId]);

  // 게임 상태 직접 계산
  const moveHistory = useTicTacToeGameStore((state) => state.moveHistory);
  const turnStart = useTicTacToeGameStore((state) => state.turnStart);
  const board = calcBoard(moveHistory);
  const winner = whoIsWin(board, moveHistory);
  const isDraw = moveHistory.length === 9;
  const isGameOver = !!winner || isDraw;
  const currentPlayer =
    mode === "multi" && currentTurnPlayerId
      ? (playersInfos.find((p) => p.userId === currentTurnPlayerId) ??
        playersInfos[0])
      : (playersInfos[moveHistory.length % 2] ?? playersInfos[0]);
  const isPlayerTurn = currentPlayer?.nickname === playersInfos[0]?.nickname;
  // ...existing code...

  const { handleTimeout } = useGameTimeout(currentPlayer.nickname);

  // board 클릭 처리 (싱글/멀티 모드 분기 처리)
  const { handleSquare, isCurrentUserTurnByServer } = useNextTurn({
    mode,
    isPlayerTurn,
    currentTurnPlayerId,
    playersInfos,
    moveHistory,
    board,
    isGameOver,
  });

  const canSelectSquare =
    !isGameOver &&
    (mode === "multi"
      ? isCurrentUserTurnByServer && !isWaitingForServer
      : isPlayerTurn);

  return (
    <main className="flex flex-col md:flex-row min-h-screen p-4 md:p-8 items-center md:items-center">
      <div className="w-full md:w-auto mb-6 md:mb-0 md:mr-12 flex flex-col items-center justify-center md:justify-center gap-4">
        <Players
          playerInfos={playersInfos}
          isTurn={!isGameOver && currentPlayer.nickname}
        />
        {!isGameOver && (
          <Countdown
            durationMs={mode === "multi" ? (turnTimeoutMs ?? 10000) : 10000}
            format="mmss"
            className="text-3xl font-bold text-red-600"
            onComplete={mode === "single" ? handleTimeout : undefined}
            initialStartTime={
              mode === "multi" ? (turnTimeoutStartedAt ?? turnStart) : turnStart
            }
          />
        )}
      </div>
      <div className="flex items-center justify-center flex-1">
        <Board
          list={board}
          selectSquare={canSelectSquare ? handleSquare : false}
        />
      </div>

      {showExitModal && (
        <ExitModal
          onClose={handleExitCancel}
          sender={{ handleLeave: handleExit }}
        />
      )}

      {isGameOver && moveHistory.length > 0 && (
        <GameOverModal
          winner={isDraw ? "DRAW" : winner}
          handleRestart={onRestart}
          onExit={handleExit}
        />
      )}
    </main>
  );
}
