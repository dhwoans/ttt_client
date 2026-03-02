import { useEffect } from "react";
import { eventManager } from "@/shared/managers/EventManager";

// 시작전 게임정보 저장
const preprocessGameStart = (botInfo: any) => {
  localStorage.setItem(
    "singleGameState",
    JSON.stringify({
      phase: "playing",
      bot: botInfo,
      turnStart: Date.now(),
      turns: [],
      isTimeOver: false,
      timeoutBy: null,
    }),
  );
};

/**
 * 게임 페이즈 관련 이벤트 처리
 * - PLAYING: 게임 시작
 * - ROOM_ASSIGNED: 방 배정
 */
export function useGamePhaseEvents(
  setPhase: (phase: "ready" | "playing") => void,
) {
  // PLAYING 신호 수신 시 phase 변경 및 전처리
  useEffect(() => {
    const handlePlaying = (data: any) => {
      console.log("[room] PLAYING 이벤트 수신, 게임 시작:", data);
      preprocessGameStart(data.bot ?? null);
      setPhase("playing");
    };

    eventManager.on("PLAYING", handlePlaying);
    return () => {
      console.log("[room] PLAYING 리스너 제거");
      eventManager.off("PLAYING", handlePlaying);
    };
  }, [setPhase]);

  // 멀티플레이 시작: ROOM_ASSIGNED 수신
  useEffect(() => {
    const handleRoomAssigned = (data: any) => {
      console.log("[room] ROOM_ASSIGNED 수신, 멀티플레이 시작 준비");
    };

    eventManager.on("ROOM_ASSIGNED", handleRoomAssigned);
    return () => {
      console.log("[room] ROOM_ASSIGNED 리스너 제거");
      eventManager.off("ROOM_ASSIGNED", handleRoomAssigned);
    };
  }, []);
}
