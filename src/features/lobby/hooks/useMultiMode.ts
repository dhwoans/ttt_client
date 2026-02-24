import { useCallback } from "react";
import { toast } from "react-toastify";
import { useRequestGameServer } from "./useRequestGameServer";
import { useConnectToGameServer } from "./useConnectToGameServer";

export function useMultiMode() {
  const { requestGameServer } = useRequestGameServer();
  const { connectToGameServer } = useConnectToGameServer();

  const handleMultiMode = useCallback(async () => {
    try {
      const toastId = toast.info("🎟️ 입장 티켓내는 중", { autoClose: false });

      // API 서버로 게임 서버 요청
      const response = await requestGameServer();

      if (response.success) {
        toast.update(toastId, {
          render: "👍 입장 성공. 방 배정 대기중...",
          type: "success",
          autoClose: 1500,
          isLoading: false,
        });

        // 게임서버 연결 요청 (roomId 없이, ticket으로 접속)
        connectToGameServer(response.gameServerUrl!, response.ticket!);
      } else {
        toast.update(toastId, {
          render: "❌ 입장 실패.",
          type: "error",
          autoClose: 2000,
          isLoading: false,
        });
      }
    } catch (error) {
      toast.error("⚠️ 연결 중 문제 발생.");
    }
  }, [requestGameServer, connectToGameServer]);

  return { handleMultiMode };
}
