import { useCallback } from "react";
import { toast } from "react-toastify";
import { useGetGameTicket } from "./useGetGameTicket";
import { useConnectGameServer } from "./useConnectGameServer";

export function useMultiMode() {
  const { getGameTicket } = useGetGameTicket();
  const { connectGameServer } = useConnectGameServer();

  const handleMultiMode = useCallback(async () => {
    try {
      const toastId = toast.info("🎟️ 입장 티켓 발급 중...", {
        autoClose: false,
      });

      // 1️⃣ API에서 ticket 받기
      const response = await getGameTicket();
      console.log("[multi] getGameTicket response:", response);

      if (response.success) {
        console.log("[multi] gameServerUrl received:", response.gameServerUrl);
        console.log("[multi] ticket received:", response.ticket);
        toast.update(toastId, {
          render: "👍 티켓 발급 완료. 방 배정 대기중...",
          type: "success",
          autoClose: 1500,
          isLoading: false,
        });

        // 2️⃣ ticket으로 게임 서버 연결
        connectGameServer(response.gameServerUrl!, response.ticket!);
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
  }, [getGameTicket, connectGameServer]);

  return { handleMultiMode };
}
