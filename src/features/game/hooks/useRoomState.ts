import { useState } from "react";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { animalList } from "@/shared/constants/avatarCandidates";
import type { GamePlayerInfo, RoomPhase } from "../types/TicTacToeGameTypes";

// 방 화면에서 공유하는 기본 상태 관리
// 내 플레이어 정보, 현재 phase를 초기화 및 저장.
export function useRoomState() {
  const saved = localStorage.getItem("gameState");
  const playerInfo = getPlayerInfoFromStorage();
  const myInfo: GamePlayerInfo = {
    nickname: playerInfo.nickname,
    avatar: animalList[playerInfo.avatarIndex][0],
    imageSrc: animalList[playerInfo.avatarIndex][2],
    userId: sessionStorage.getItem("userId") || undefined,
  };
  const [playersInfos, setPlayersInfos] = useState<GamePlayerInfo[]>([myInfo]);
  const [phase, setPhase] = useState<RoomPhase>(() => {
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.phase === "playing") return "playing";
      } catch {}
    }
    return "ready";
  });

  return {
    playersInfos,
    setPlayersInfos,
    phase,
    setPhase,
  };
}
