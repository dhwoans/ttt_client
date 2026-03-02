import { useEffect } from "react";
import { eventManager } from "@/shared/managers/EventManager";

/**
 * 플레이어 준비 상태 수신 처리
 * - PLAYER_READY 이벤트 수신
 * - 다른 플레이어의 준비 상태 업데이트
 */
export function useReceivePlayerReady(
  mode: "single" | "multi",
  setPlayersReadyStatus: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) {
  useEffect(() => {
    if (mode !== "multi") return;

    const handlePlayerReady = (data: {
      userId: string;
      nickname: string;
      isReady: boolean;
      roomId: string;
    }) => {
      console.log(`[room] PLAYER_READY 수신:`, data);
      console.log(
        `[room] ${data.nickname}님이 ${data.isReady ? "준비완료" : "준비취소"}`,
      );

      setPlayersReadyStatus((prev) => ({
        ...prev,
        [data.userId]: data.isReady,
      }));
    };

    eventManager.on("PLAYER_READY", handlePlayerReady);
    return () => {
      console.log("[room] PLAYER_READY 리스너 제거");
      eventManager.off("PLAYER_READY", handlePlayerReady);
    };
  }, [mode, setPlayersReadyStatus]);
}
