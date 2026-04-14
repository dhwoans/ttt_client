import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { gameSocketManager } from "@/shared/utils/SocketManager";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { eventManager } from "@/shared/utils/EventManager";
import { toast } from "react-toastify";
import { ROUTES } from "@/shared/constants/routes";

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

      // EXISTING_PLAYERS를 한 번만 받아서 sessionStorage에 저장
      console.log("[multi] EXISTING_PLAYERS 리스너 등록 (once)");

      const handleExistingPlayers = (data: any) => {
        console.log(
          "[multi] EXISTING_PLAYERS 수신, sessionStorage에 저장:",
          data,
        );
        sessionStorage.setItem("existingPlayers", JSON.stringify(data.players));
        console.log(
          "[multi] existingPlayers sessionStorage 저장 완료:",
          data.players,
        );
      };

      // once 사용: 한 번만 실행되고 자동으로 리스너 제거
      eventManager.once("EXISTING_PLAYERS", handleExistingPlayers);
      console.log("[multi] EXISTING_PLAYERS 리스너 등록 완료");

      // 서버에서 roomId 받기
      const handleRoomAssigned = (data: any) => {
        console.log("[multi] ROOM_ASSIGNED received:", data);
        const assignedRoomId = data.roomId;
        sessionStorage.setItem("roomId", assignedRoomId);

        // 게임방으로 이동
        toast("🎟️ 입장권 내는 중...");
        setTimeout(() => {
          navigate(ROUTES.game.room(assignedRoomId));
        }, 1500);
      };

      // 한 번만 실행되도록 설정
      eventManager.once("ROOM_ASSIGNED", handleRoomAssigned);
    },
    [navigate],
  );

  return { connectGameServer };
}
