import { useSingleGameStore } from "@/stores/singleGameStore";

interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
}

/**
 * 플레이어의 수를 처리하는 훅
 */
export function usePlayerMove(
  isGameOver: boolean,
  isPlayerTurn: boolean,
  playersInfos: GamePlayerInfo[],
  turns: any[],
) {
  const addTurn = useSingleGameStore((state) => state.addTurn);

  const handleSquare = (row: number, col: number) => {
    if (isGameOver || !isPlayerTurn) return;

    const nextPlayer = playersInfos[turns.length % 2];
    addTurn({
      square: { row, col },
      symbol: nextPlayer.avatar,
      nickname: nextPlayer.nickname,
    });
  };

  return { handleSquare };
}
