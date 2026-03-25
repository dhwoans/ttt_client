import { useEffect, useState } from "react";
import { eventManager } from "@/shared/managers/EventManager";

/**
 * NEXT_TURN 이벤트 수신 훅
 * - currentTurnPlayerId 상태 관리
 * - NEXT_TURN 이벤트 리스너 등록
 * - sessionStorage에 저장
 */
export function useReceiveNextTurn() {
  const [currentTurnPlayerId, setCurrentTurnPlayerId] = useState<string | null>(
    () => sessionStorage.getItem("currentTurnPlayerId"),
  );

  useEffect(() => {
    const handleNextTurn = (data: any) => {
      if (data.nextPlayerId) {
        setCurrentTurnPlayerId(data.nextPlayerId);
        sessionStorage.setItem("currentTurnPlayerId", data.nextPlayerId);
      }
    };

    eventManager.on("NEXT_TURN", handleNextTurn);
    return () => {
      eventManager.off("NEXT_TURN", handleNextTurn);
    };
  }, []);

  return { currentTurnPlayerId, setCurrentTurnPlayerId };
}
