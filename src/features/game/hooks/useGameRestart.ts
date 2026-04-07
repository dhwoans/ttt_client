import { useTicTacToeGameStore } from "@/stores/ticTacToeGameStore";
import type { RoomPhase } from "../types";

interface GameRestartConfig {
  setPhase: (phase: RoomPhase) => void;
  mode: "single" | "multi";
  sendReady: (isReady: boolean) => void;
  handleReady: (isReady: boolean) => void;
}

/**
 * 게임 재시작 처리 훅
 * - phase를 ready로 변경
 * - localStorage 제거
 * - zustand store 초기화
 * - 자동 준비 처리 (싱글: handleReady, 멀티: sendReady)
 */
export function useGameRestart(config: GameRestartConfig) {
  const resetGame = useTicTacToeGameStore((state) => state.resetGame);

  const handleRestart = () => {
    // 게임 종료 후 다시하기는 준비 화면으로 돌아가서 다시 ready를 받는다.
    config.setPhase("ready");

    // 남아있는 로컬 상태 정리
    localStorage.removeItem("gameState");
    sessionStorage.removeItem("currentTurnPlayerId");
    // (isWaitingForServer 등은 Playing 컴포넌트가 언마운트되면 사라지므로 별도 처리는 필요 없음)

    // zustand 스토어 초기화
    resetGame();

    // 멀티/싱글 공통: 즉시 자동 준비 처리
    setTimeout(() => {
      if (config.mode === "multi") {
        // 멀티: 서버에 준비 상태 전송
        config.sendReady(true);
      } else {
        // 싱글: ready 콜백 실행
        config.handleReady(true);
      }
    }, 0);
  };

  return { handleRestart };
}
