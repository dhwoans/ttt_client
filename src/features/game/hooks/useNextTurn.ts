import { useCallback, useMemo } from "react";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import { gameSocketManager } from "@/shared/managers/SocketManager";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
}

interface UseNextTurnConfig {
  mode: "single" | "multi";
  isPlayerTurn?: boolean;
  currentTurnPlayerId: string | null;
  playersInfos: GamePlayerInfo[];
  moveHistory?: any[];
  board: string[][];
  isGameOver: boolean;
}

/**
 * 보드 클릭 처리 훅
 * - 싱글 모드: 플레이어 수를 로컬에 저장
 * - 멀티 모드: 턴 체크 후 서버에 좌표 전송
 * - 턴 체크: currentTurnPlayerId와 sessionUserId/socketId 비교
 */
import { useSendPlayerMove } from "../hooks/useSendPlayerMove";
import { useAIMove } from "./useAIMove";

export function useNextTurn({
  mode,
  isPlayerTurn,
  currentTurnPlayerId,
  playersInfos,
  moveHistory,
  board,
  isGameOver,
}: UseNextTurnConfig) {
  const addMove = useTicTacToeGameStore((state) => state.addMove);
  const { sendMove } = useSendPlayerMove();

  // AI 턴 로직도 이곳으로 이동
  useAIMove(isGameOver, isPlayerTurn, board, playersInfos, mode);

  // 턴 체크 (멀티 모드에서만 사용)
  const isCurrentUserTurnByServer = useMemo(() => {
    if (mode !== "multi") return false;

    const sessionUserId = sessionStorage.getItem("userId");
    const socketConnId =
      sessionStorage.getItem("socketId") ??
      gameSocketManager.getSocket()?.id ??
      null;

    return (
      !!currentTurnPlayerId &&
      (currentTurnPlayerId === sessionUserId ||
        currentTurnPlayerId === socketConnId)
    );
  }, [mode, currentTurnPlayerId]);

  const handleSquare = useCallback(
    (row: number, col: number) => {
      console.log("[Playing] handleSquare 호출:", {
        row,
        col,
        mode,
      });
      if (mode === "single") {
        // 싱글 모드: 플레이어 수를 로컬에 저장
        if (!isPlayerTurn) return;

        const nextPlayer = playersInfos[moveHistory!.length % 2];
        if (!nextPlayer) return;
        addMove({
          square: { row, col },
          symbol: nextPlayer.avatar,
          nickname: nextPlayer.nickname,
        });
      } else {
        // 멀티 모드: 턴 확인 후 서버에 좌표 전송
        if (!isCurrentUserTurnByServer) {
          console.log("[Playing] 클릭 거부: 내 턴이 아님");
          return;
        }
        console.log("[Playing] sendMove 호출:", { row, col });
        sendMove(row, col);
      }
    },
    [
      mode,
      isPlayerTurn,
      isCurrentUserTurnByServer,
      playersInfos,
      moveHistory,
      sendMove,
      addMove,
    ],
  );

  return { handleSquare, isCurrentUserTurnByServer };
}
