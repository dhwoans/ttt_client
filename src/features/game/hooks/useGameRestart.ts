import { useSingleGameStore } from "@/stores/singleGameStore";

/**
 * 게임 재시작 처리 훅
 */
export function useGameRestart() {
  const resetGame = useSingleGameStore((state) => state.resetGame);

  const handleRestart = () => {
    resetGame();
  };

  return { handleRestart };
}
