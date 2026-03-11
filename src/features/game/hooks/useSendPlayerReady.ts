import { gameSocketManager } from "@/shared/managers/SocketManager";
import type { ReadyEventPayload } from "@share";
import { useCallback } from "react";

/**
 * Ready 상태를 서버에 전송하는 훅
 *
 * 서버 이벤트:
 * - PLAYER_READY: 모든 플레이어에게 준비 상태 변경 알림 (GameRoomPage에서 처리)
 */
export function useSendPlayerReady() {
  const sendReady = useCallback((isReady: boolean) => {
    const roomId = sessionStorage.getItem("roomId");
    const userId = sessionStorage.getItem("userId");

    if (!roomId || !userId) {
      console.error("[ready] 필수 정보 없음", { roomId, userId });
      return;
    }

    const payload: ReadyEventPayload = { isReady };
    console.log(`[ready] READY ${isReady ? "준비" : "취소"} 전송:`, payload);
    gameSocketManager.sendMessage("READY", payload);
  }, []);

  return { sendReady };
}
