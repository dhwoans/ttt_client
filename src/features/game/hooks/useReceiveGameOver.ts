import { useEffect } from "react";
import { eventManager } from "@/shared/managers/EventManager";

/**
 * GAME_OVER 이벤트 수신 훅
 * - 게임 종료 이벤트 처리
 */
export function useReceiveGameOver() {
  useEffect(() => {
    const handleGameOver = (data: any) => {
      console.log("[Playing] GAME_OVER 수신:", data);
    };

    eventManager.on("GAME_OVER", handleGameOver);
    return () => {
      eventManager.off("GAME_OVER", handleGameOver);
    };
  }, []);
}
