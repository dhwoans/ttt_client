import { useMemo } from "react";

export interface PlayerInfo {
  nickname: string;
  avatarIndex: number;
}

// sessionStorage에서 플레이어 정보를 가져오는 훅
export function usePlayerInfo(): PlayerInfo {
  return useMemo<PlayerInfo>(() => {
    return {
      nickname: sessionStorage.getItem("nickname") || "플레이어",
      avatarIndex: Number(sessionStorage.getItem("avator") || 3),
    };
  }, []);
}
