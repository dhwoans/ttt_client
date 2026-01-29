// sessionStorage에서 플레이어 정보를 읽어오는 헬퍼 함수

export interface PlayerInfo {
  nickname: string;
  avatarIndex: number;
}

export function getPlayerInfoFromStorage(): PlayerInfo {
  return {
    nickname: sessionStorage.getItem("nickname") || "플레이어",
    avatarIndex: Number(sessionStorage.getItem("avator") || 3),
  };
}
