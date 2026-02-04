import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useJoinRoom } from "../hooks/useJoinRoom";
import { toast } from "react-toastify";

export function useMultiMode() {
  const navigate = useNavigate();

  const handleMultiMode = useCallback(async () => {
    toast.info("🎮 비집고 들어가는 중");
    try {
      const response = await useJoinRoom();
      if (response && response.success && "data" in response && response.data) {
        toast.success("🎟️ 입장 티켓내는 중");
        sessionStorage.setItem("gameServerUrl", response.data.gameServerUrl);
        sessionStorage.setItem("gameTicket", response.data.ticket);
        toast.info("🚀 곧 게임방으로 이동합니다!");
        navigate("/game/lobby");
      } else {
        toast.error("❌ 서버 연결에 실패했어요. 잠시 후 다시 시도해 주세요.");
      }
    } catch (error) {
      console.error("멀티플레이 서버 연결 오류:", error);
      toast.error("⚠️ 연결 중 문제가 발생했어요. 네트워크를 확인해 주세요.");
    }
  }, [navigate]);

  return { handleMultiMode };
}
