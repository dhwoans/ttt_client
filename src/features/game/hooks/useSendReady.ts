import { gameSocketManager } from "@/shared/managers/SocketManager";

/**
 * Ready 상태를 서버에 전송하는 훅
 */
export function useSendReady() {
  const getSessionInfo = () => ({
    roomId: sessionStorage.getItem("roomId"),
    userId: sessionStorage.getItem("userId"),
    nickname: sessionStorage.getItem("nickname"),
  });

  const sendReady = (isReady: boolean) => {
    const { roomId, userId, nickname } = getSessionInfo();
    gameSocketManager.sendMessage("READY", {
      type: "READY",
      message: [roomId, userId, isReady],
      sender: nickname,
    });
  };

  return { sendReady };
}
