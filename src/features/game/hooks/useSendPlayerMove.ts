import { gameSocketManager } from "@/shared/managers/SocketManager";

/**
 * 플레이어의 이동(좌표) 정보를 서버에 전송하는 훅
 */
export function useSendPlayerMove() {
  const getSessionInfo = () => ({
    roomId: sessionStorage.getItem("roomId"),
    userId: sessionStorage.getItem("userId"),
    nickname: sessionStorage.getItem("nickname"),
  });

  const sendMove = (x: number, y: number) => {
    const { roomId, userId, nickname } = getSessionInfo();
    gameSocketManager.sendMessage("MOVE", {
      type: "MOVE",
      message: [roomId, userId, [x, y]],
      sender: nickname,
    });
  };

  return { sendMove };
}
