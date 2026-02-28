import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocketManager } from "@/shared/managers/SocketManager";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { eventManager } from "@/shared/managers/EventManager";

/**
 * 게임 서버 연결 (ticket 기반 인증)
 * API에서 받은 ticket으로 게임 서버에 접속
 */
export function useConnectGameServer() {
  const navigate = useNavigate();

  const connectGameServer = useCallback(
    (gameServerUrl: string, ticket: string) => {
      const { nickname } = getPlayerInfoFromStorage();
      const userId = sessionStorage.getItem("userId");

      if (!userId || !ticket) {
        console.error("userId or ticket not found");
        return;
      }

      console.log("[multi] connectGameServer called", {
        gameServerUrl,
        userId,
        nickname,
        ticket,
      });

      // Same-origin 연결 (nginx를 통해 backend로 프록시)
      // gameServerUrl 무시하고 현재 origin 사용
      gameSocketManager.connect(userId, nickname, "/", { ticket });

      // 서버에서 roomId 받기
      const handleRoomAssigned = (data: any) => {
        console.log("[multi] ROOM_ASSIGNED received:", data);
        const assignedRoomId = data.roomId;
        sessionStorage.setItem("roomId", assignedRoomId);

        // 게임방으로 이동
        navigate(`/game/${assignedRoomId}`, { state: { mode: "multi" } });
      };

      // 한 번만 실행되도록 설정
      eventManager.once("ROOM_ASSIGNED", handleRoomAssigned);
    },
    [navigate],
  );

  return { connectGameServer };
}
