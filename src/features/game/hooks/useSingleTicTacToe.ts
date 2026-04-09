import { useState, useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { calcBoard, whoIsWin } from "../util/ticTacToeUtils";
import { useGameTimeout } from "./useGameTimeout";
import { useNextTurn } from "./useNextTurn";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
}

interface UseSingleTicTacToeProps {
  playersInfos: GamePlayerInfo[];
  onExit?: () => void;
}

export function useSingleTicTacToe({
  playersInfos,
  onExit,
}: UseSingleTicTacToeProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);

  const handleExitIntent = useCallback(() => {
    setShowExitModal(true);
  }, []);
  useBackExitModal(handleExitIntent, true);

  const handleExitCancel = () => setShowExitModal(false);
  const handleExit = () => {
    onExit?.();
  };

  const moveHistory = useTicTacToeGameStore((state) => state.moveHistory);
  const turnStart = useTicTacToeGameStore((state) => state.turnStart);
  const timeoutBy = useTicTacToeGameStore((state) => state.timeoutBy);
  const board = calcBoard(moveHistory);
  const boardWinner = whoIsWin(board, moveHistory);
  const isDraw = moveHistory.length === 9;
  const timeoutWinner = timeoutBy
    ? (playersInfos.find((p) => p.nickname !== timeoutBy)?.nickname ?? null)
    : null;
  const winner = timeoutWinner ?? boardWinner;
  const isGameOver = !!winner || isDraw || !!timeoutBy;
  const currentPlayer = playersInfos[moveHistory.length % 2] ?? playersInfos[0];
  const isPlayerTurn = currentPlayer?.nickname === playersInfos[0]?.nickname;

  const { handleTimeout } = useGameTimeout(currentPlayer?.nickname ?? "");

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => setShowGameOverModal(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowGameOverModal(false);
  }, [isGameOver]);

  const { handleSquare } = useNextTurn({
    mode: "single",
    isPlayerTurn,
    currentTurnPlayerId: null,
    playersInfos,
    moveHistory,
    board,
    isGameOver,
  });

  return {
    playersInfos,
    board,
    canSelectSquare: !isGameOver && isPlayerTurn,
    handleSquare,
    isGameOver,
    currentTurnNickname: !isGameOver ? (currentPlayer?.nickname ?? "") : "",
    showExitModal,
    showGameOverModal,
    handleExitCancel,
    handleExit,
    isDraw,
    winner,
    countdownDurationMs: 10000,
    countdownStartTime: turnStart,
    countdownOnComplete: handleTimeout,
  };
}
