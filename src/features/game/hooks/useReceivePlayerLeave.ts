import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { eventManager } from "@/shared/managers/EventManager";
import type { PlayerLeftEvent, LeaveSuccessEvent } from "@share";
import { GamePlayerInfo } from "./useRoomState";

/**
 * 플레이어 퇴장 이벤트 수신 처리
 * - PLAYER_LEFT: 다른 플레이어 퇴장
 * - LEAVE_SUCCESS: 본인 퇴장 성공
 */
export function useReceivePlayerLeave(
  mode: "single" | "multi",
  phase: "ready" | "playing",
  setPlayersInfos: React.Dispatch<React.SetStateAction<GamePlayerInfo[]>>,
  setPlayersReadyStatus: React.Dispatch<
    React.SetStateAction<Record<string, boolean>>
  >,
) {
  const navigate = useNavigate();

  // PLAYER_LEFT 이벤트 처리 (상대 플레이어 퇴장)
  useEffect(() => {
    if (mode !== "multi") return;

    const handlePlayerLeft = (data: PlayerLeftEvent) => {
      console.log(`[room] ${data.nickname}님이 나갔습니다`);
      toast.warning(`${data.nickname}님이 게임을 나갔습니다.`);

      // 상대 플레이어 정보 제거
      setPlayersInfos((prev) =>
        prev.filter((p) => p.nickname !== data.nickname),
      );

      // 준비 상태 제거
      setPlayersReadyStatus((prev) => {
        const next = { ...prev };
        delete next[data.connId];
        return next;
      });

      // 게임 중이면 준비상태로 돌아가기
      // 임시로 로비로 퇴장
      if (phase === "playing") {
        setTimeout(() => {
          localStorage.removeItem("gameState");
          navigate("/lobby");
        }, 1500);
      }
    };

    eventManager.on("PLAYER_LEFT", handlePlayerLeft);
    return () => {
      console.log("[room] PLAYER_LEFT 리스너 제거");
      eventManager.off("PLAYER_LEFT", handlePlayerLeft);
    };
  }, [mode, phase, setPlayersInfos, setPlayersReadyStatus, navigate]);

  // LEAVE_SUCCESS 이벤트 처리 (본인 퇴장 성공)
  useEffect(() => {
    const handleLeaveSuccess = (data: LeaveSuccessEvent) => {
      if (data.success) {
        console.log("[room] 방 나가기 성공");
        localStorage.removeItem("gameState");
        navigate("/lobby");
      }
    };

    eventManager.once("LEAVE_SUCCESS", handleLeaveSuccess);
    return () => {
      // cleanup
    };
  }, [navigate]);
}
