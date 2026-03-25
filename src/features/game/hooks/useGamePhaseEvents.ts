import { useEffect } from "react";
import { eventManager } from "@/shared/managers/EventManager";
import { gameSocketManager } from "@/shared/managers/SocketManager";

// 시작전 게임정보 저장
const preprocessGameStart = (botInfo: any) => {
  localStorage.setItem(
    "gameState",
    JSON.stringify({
      phase: "playing",
      bot: botInfo,
      turnStart: Date.now(),
      moveHistory: [],
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

      // socket.id 저장 (턴 ID 비교 시 필요)
      const socketId = gameSocketManager.getSocket()?.id;
      if (socketId) {
        sessionStorage.setItem("socketId", socketId);
        console.log("[room] socket.id 저장:", socketId);
      }

      preprocessGameStart(data.bot ?? null);
      setPhase("playing");

      // 멀티플레이: 게임 상태 정보 브로드캐스트
      if (data.currentTurnPlayerId) {
        sessionStorage.setItem("currentTurnPlayerId", data.currentTurnPlayerId);
        console.log(
          "[room] PLAYING 이벤트에서 currentTurnPlayerId 저장:",
          data.currentTurnPlayerId,
        );
        eventManager.emit("GAME_STATE_UPDATE", {
          currentTurnPlayerId: data.currentTurnPlayerId,
          roomId: data.roomId,
          status: data.status,
          players: data.players,
        });
      } else {
        console.warn("[room] PLAYING 이벤트에 currentTurnPlayerId 없음:", data);
      }
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
