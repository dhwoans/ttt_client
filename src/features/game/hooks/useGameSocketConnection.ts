import { useEffect } from "react";
import { gameSocketManager } from "@/shared/managers/SocketManager";

/**
 * 게임 소켓 연결을 관리하는 훅
 * 컴포넌트 마운트 시 연결, 언마운트 시 종료
 */
export function useGameSocketConnection() {
  useEffect(() => {
    const roomId = sessionStorage.getItem("roomId");
    const userId = sessionStorage.getItem("userId");
    const userNickname = sessionStorage.getItem("nickname");
    const gameServerUrl = sessionStorage.getItem("gameServerUrl");

    if (roomId && userId && userNickname) {
      gameSocketManager.connect(
        userId,
        userNickname,
        gameServerUrl || "/room",
        {
          roomId,
        },
      );
    }

    // 클린업
    return () => {
      gameSocketManager.disconnect();
    };
  }, []);

  const disconnect = () => {
    gameSocketManager.disconnect();
  };

  const getSocket = () => gameSocketManager.getSocket();

  return { disconnect, getSocket };
}
