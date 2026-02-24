import { useMemo } from "react";
import { calcBoard, whoIsWin } from "../util/ticTacToeUtils";
import { useSingleGameStore } from "@/stores/singleGameStore";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

/**
 * 게임 상태 관리 (Zustand store 사용)
 */
export function useGameState(playersInfos: GamePlayerInfo[]) {
  const { turns, isTimeOver, timeoutBy, turnStart } = useSingleGameStore();

  const board = useMemo(() => calcBoard(turns), [turns]);
  const winner = useMemo(() => whoIsWin(board, turns), [board, turns]);
  const isDraw = turns.length === 9;
  const currentPlayer = playersInfos[turns.length % 2];
  const isPlayerTurn = currentPlayer.nickname === playersInfos[0].nickname;
  const isGameOver = !!winner || isDraw || isTimeOver;

  return {
    // 상태
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
  };
}
