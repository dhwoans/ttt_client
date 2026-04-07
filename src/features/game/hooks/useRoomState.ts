import { useState } from "react";
import { getPlayerInfoFromStorage } from "@/shared/utils/playerStorage";
import { animalList } from "@/shared/constants/randomAvatar";
import { useLocation } from "react-router-dom";
import type { RoomPhase } from "../types";

export interface GamePlayerInfo {
  nickname: string;
  avatar: string;
  imageSrc: string;
  userId?: string;
}

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
  const location = useLocation();
  const resolveMode = (): "single" | "multi" => {
    const locationMode = location.state?.mode as "single" | "multi" | undefined;
    if (locationMode === "single" || locationMode === "multi") {
      return locationMode;
    }

    const sessionMode = sessionStorage.getItem("gameMode");
    if (sessionMode === "single" || sessionMode === "multi") {
      return sessionMode;
    }

    if (sessionStorage.getItem("roomId")) {
      return "multi";
    }

    return "single";
  };

  const [mode, setMode] = useState<"single" | "multi">(() => resolveMode());

  return {
    playersInfos,
    setPlayersInfos,
    phase,
    setPhase,
    mode,
    setMode,
  };
}
