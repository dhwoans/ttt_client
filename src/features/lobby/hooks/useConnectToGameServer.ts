import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocketManager } from "@/shared/managers/SocketManager";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { eventManager } from "@/shared/managers/EventManager";

/**
 * 게임 서버 연결 요청 (roomId 없이, ticket으로 접속)
 */
export function useConnectToGameServer() {
  const navigate = useNavigate();

  const connectToGameServer = useCallback(
    (gameServerUrl: string, ticket: string) => {
      const { nickname } = getPlayerInfoFromStorage();
      const userId = sessionStorage.getItem("userId");

      if (!userId) {
        return { success: false, error: "userId not found" };
      }

      // 게임 서버 연결 요청
      gameSocketManager.connect(userId, nickname, gameServerUrl, { ticket });

      // 웹소켓에서 roomId를 받으면 이동
      const handleRoomAssigned = (data: any) => {
        const assignedRoomId = data.roomId;
        sessionStorage.setItem("roomId", assignedRoomId);

        // 게임방으로 이동
        navigate(`/game/${assignedRoomId}`, { state: { mode: "multi" } });
      };

      // 한 번만 실행되도록 설정
      eventManager.once("ROOM_ASSIGNED", handleRoomAssigned);

      return { success: true };
    },
    [navigate],
  );

  return { connectToGameServer };
}
