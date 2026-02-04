import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useJoinRoom } from "../hooks/useJoinRoom";

export function useMultiMode() {
  const navigate = useNavigate();

  const handleMultiMode = useCallback(async () => {
    try {
      const response = await useJoinRoom();
      if (response && response.success && "data" in response && response.data) {
        console.log("게임 서버 주소:", response.data.gameServerUrl);
        console.log("입장 티켓:", response.data.ticket);
        let socket: any;
        if (import.meta.env.VITE_SOCKET_MOCK === "true") {
          const SocketMock = await import("socket.io-mock");
          console.log("웹소켓 테스트 mock:");
          socket = new SocketMock.default();
          setTimeout(() => {
            socket.socketClient.emit("roomId", "mock-room-123");
          }, 500);
        } else {
          // 실제 게임서버 연결
        }
        socket.on("connect", () => {
          console.log("웹소켓 연결 성공:", socket.id);
        });
        socket.on("connect_error", (err: any) => {
          console.error("웹소켓 연결 실패:", err);
        });
        socket.on("roomId", (roomId: string) => {
          console.log("게임서버에서 받은 roomId:", roomId);
          navigate(`/game/${roomId}`);
        });
      } else {
        alert("게임 서버 연결에 실패했습니다.");
      }
    } catch (error) {
      console.error("멀티플레이 서버 연결 오류:", error);
      alert("멀티플레이 서버 연결 중 오류가 발생했습니다.");
    }
  }, [navigate]);

  return { handleMultiMode };
}
