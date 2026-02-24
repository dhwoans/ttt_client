import { gameSocketManager } from "@/shared/managers/SocketManager";

/**
 * 게임 방 나가기를 서버에 알리는 훅
 */
export function useSendLeave() {
  const getSessionInfo = () => ({
    roomId: sessionStorage.getItem("roomId"),
    userId: sessionStorage.getItem("userId"),
    nickname: sessionStorage.getItem("nickname"),
  });

  const sendLeave = () => {
    const { roomId, userId, nickname } = getSessionInfo();
    gameSocketManager.sendMessage("LEAVE", {
      type: "LEAVE",
      message: [roomId, userId],
      sender: nickname,
    });
  };

  return { sendLeave };
}
