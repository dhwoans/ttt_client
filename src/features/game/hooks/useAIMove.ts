import { useEffect } from "react";
import { ticTacToeAI } from "@/shared/utils/AIPlayer";
import { useSingleGameStore } from "@/stores/singleGameStore";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

/**
 * AI의 자동 이동을 처리하는 훅
 */
export function useAIMove(
  isGameOver: boolean,
  isPlayerTurn: boolean,
  board: string[][],
  playersInfos: GamePlayerInfo[],
  mode: "single" | "multi" = "single",
) {
  const addTurn = useSingleGameStore((state) => state.addTurn);

  useEffect(() => {
    // Multiplayer uses server-authoritative moves; never run local AI there.
    if (mode === "multi" || isGameOver || isPlayerTurn) {
      return;
    }

    const aiTimer = setTimeout(() => {
      const playerSymbol = playersInfos[0].avatar;
      const botSymbol = playersInfos[1].avatar;
      const aiMove = ticTacToeAI.getBestMove(board, botSymbol, playerSymbol);

      if (aiMove) {
        addTurn({
          square: { row: aiMove.row, col: aiMove.col },
          symbol: botSymbol,
          nickname: playersInfos[1].nickname,
        });
      }
    }, 1000);

    return () => clearTimeout(aiTimer);
  }, [mode, isPlayerTurn, isGameOver, board, playersInfos, addTurn]);
}
