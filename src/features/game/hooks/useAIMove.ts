import { useEffect } from "react";
import { ticTacToeAI } from "@/shared/utils/AIPlayer";
import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";

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
  const addMove = useTicTacToeGameStore((state) => state.addMove);

  useEffect(() => {
    // Multiplayer uses server-authoritative moves; never run local AI there.
    if (mode === "multi" || isGameOver || isPlayerTurn) {
      return;
    }

    const aiTimer = setTimeout(() => {
      if (!playersInfos[0] || !playersInfos[1]) return;
      const playerSymbol = playersInfos[0].avatar;
      const botSymbol = playersInfos[1].avatar;
      const aiMove = ticTacToeAI.getBestMove(board, botSymbol, playerSymbol);

      if (aiMove) {
        addMove({
          square: { row: aiMove.row, col: aiMove.col },
          symbol: botSymbol,
          nickname: playersInfos[1].nickname,
        });
      }
    }, 1000);

    return () => clearTimeout(aiTimer);
  }, [mode, isPlayerTurn, isGameOver, board, playersInfos, addMove]);
}
