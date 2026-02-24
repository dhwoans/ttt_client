import { useSingleGameStore } from "@/stores/singleGameStore";

/**
 * 타임아웃 처리 훅
 */
export function useGameTimeout(currentPlayerNickname: string) {
  const setTimeOver = useSingleGameStore((state) => state.setTimeOver);

  const handleTimeout = () => {
    setTimeOver(currentPlayerNickname);
  };

  return { handleTimeout };
}
