import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useJoinRoom } from "../hooks/useJoinRoom";
import { toast } from "react-toastify";

export function useMultiMode() {
  const navigate = useNavigate();

  const handleMultiMode = useCallback(async () => {
    try {
      const toastId = toast.info("🎟️ 입장 티켓내는 중", { autoClose: false });
      const response = await useJoinRoom();
      if (response && response.success && "data" in response && response.data) {
        sessionStorage.setItem("gameServerUrl", response.data.gameServerUrl);
        sessionStorage.setItem("gameTicket", response.data.ticket);
        toast.update(toastId, {
          render: "👍 입장 성공",
          type: "success",
          autoClose: 1500,
          isLoading: false,
        });
        setTimeout(() => {
          navigate("/game/lobby");
        }, 1500);
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
  }, [navigate]);

  return { handleMultiMode };
}
