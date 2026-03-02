import { gameSocketManager } from "@/shared/managers/SocketManager";
import { useCallback } from "react";

/**
 * 게임 방 나가기를 서버에 알리는 훅
 *
 * 서버 이벤트:
 * - LEAVE_SUCCESS: 본인의 나가기 성공 (GameRoomPage에서 처리)
 * - PLAYER_LEFT: 다른 플레이어들에게 전달되는 플레이어 퇴장 알림 (GameRoomPage에서 처리)
 */
export function useSendPlayerLeave() {
  const getSessionInfo = () => ({
    roomId: sessionStorage.getItem("roomId"),
    userId: sessionStorage.getItem("userId"),
    nickname: sessionStorage.getItem("nickname"),
  });

  const sendLeave = useCallback(() => {
    const { roomId, userId, nickname } = getSessionInfo();

    console.log("[leave] 방 나가기 요청:", { roomId, userId, nickname });

    // LEAVE 이벤트 발송
    gameSocketManager.sendMessage("LEAVE", {
      type: "LEAVE",
      message: [roomId, userId],
      sender: nickname,
    });
  }, []);

  return { sendLeave };
}
