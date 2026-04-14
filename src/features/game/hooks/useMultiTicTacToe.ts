import { useState, useCallback, useEffect } from "react";
import { useBackExitModal } from "@/shared/hooks/useBackExitModal";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { calcBoard, whoIsWin } from "../../../shared/utils/ticTacToeUtils";
import { useMultiNextTurn } from "./useNextTurn";
import { useReceiveMoveMade } from "./useReceiveMoveMade";
import { useReceiveGameOver } from "./useReceiveGameOver";
import { useReceiveGameStateUpdate } from "./useReceiveGameStateUpdate";
import { useReceiveNextTurn } from "./useReceiveNextTurn";
import { useReceiveTurnTimeoutStarted } from "./useReceiveTurnTimeoutStarted";
import type { UseTicTacToeProps } from "../types/GameHookTypes";

export function useMultiTicTacToe({ playersInfos, onExit }: UseTicTacToeProps) {
  const [showExitModal, setShowExitModal] = useState(false);
  const [showGameOverModal, setShowGameOverModal] = useState(false);
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

  useReceiveMoveMade({ playersInfos, setIsWaitingForServer });
  useReceiveGameOver();
  useReceiveGameStateUpdate(setCurrentTurnPlayerId);
  const { currentTurnPlayerId: receivedTurnPlayerId } = useReceiveNextTurn();
  const { turnTimeoutMs, turnTimeoutStartedAt } = useReceiveTurnTimeoutStarted(
    setCurrentTurnPlayerId,
  );

  useEffect(() => {
    if (receivedTurnPlayerId) {
      setCurrentTurnPlayerId(receivedTurnPlayerId);
    }
  }, [receivedTurnPlayerId]);

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
  const currentPlayer = currentTurnPlayerId
    ? (playersInfos.find((p) => p.userId === currentTurnPlayerId) ??
      playersInfos[0])
    : (playersInfos[0] ?? null);
  const isPlayerTurn = currentPlayer?.nickname === playersInfos[0]?.nickname;

  useEffect(() => {
    if (isGameOver) {
      const timer = setTimeout(() => setShowGameOverModal(true), 3000);
      return () => clearTimeout(timer);
    }
    setShowGameOverModal(false);
  }, [isGameOver]);

  const { handleSquare, isCurrentUserTurnByServer } = useMultiNextTurn({
    currentTurnPlayerId,
    isGameOver,
  });

  return {
    playersInfos,
    board,
    canSelectSquare:
      !isGameOver && isCurrentUserTurnByServer && !isWaitingForServer,
    handleSquare,
    isGameOver,
    currentTurnNickname: !isGameOver ? (currentPlayer?.nickname ?? "") : "",
    showExitModal,
    showGameOverModal,
    handleExitCancel,
    handleExit,
    isDraw,
    winner,
    countdownDurationMs: turnTimeoutMs ?? 10000,
    countdownStartTime: turnTimeoutStartedAt ?? turnStart,
  };
}
