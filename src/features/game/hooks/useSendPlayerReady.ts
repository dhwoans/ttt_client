import { gameSocketManager } from "@/shared/managers/SocketManager";
import { useCallback } from "react";

/**
 * Ready 상태를 서버에 전송하는 훅
 *
 * 서버 이벤트:
 * - PLAYER_READY: 모든 플레이어에게 준비 상태 변경 알림 (GameRoomPage에서 처리)
 */
export function useSendPlayerReady() {
  const getSessionInfo = () => ({
    roomId: sessionStorage.getItem("roomId"),
    userId: sessionStorage.getItem("userId"),
    nickname: sessionStorage.getItem("nickname"),
  });

  const sendReady = useCallback((isReady: boolean) => {
    const { roomId, userId, nickname } = getSessionInfo();

    console.log(
      `[ready] READY ${isReady ? "준비" : "취소"} 메시지 전송 시작:`,
      {
        roomId,
        userId,
        nickname,
        isReady,
      },
    );

    if (!roomId || !userId) {
      console.error("[ready] 필수 정보 없음", { roomId, userId });
      return;
    }

    // READY 이벤트 발송
    const messageData = {
      type: "READY",
      message: [roomId, userId, isReady],
      sender: nickname,
      isReady,
    };

    console.log(`[ready] 전송할 메시지:`, JSON.stringify(messageData, null, 2));
    gameSocketManager.sendMessage("READY", messageData);
    console.log(`[ready] READY ${isReady ? "준비" : "취소"} 메시지 전송 완료`);
  }, []);

  return { sendReady };
}
