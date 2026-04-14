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

/**
 * 게임 세션 종료 시 관련 상태 초기화
 * 모든 퇴장 경로에 사용
 */
export function clearGameSession() {
  // localStorage
  localStorage.removeItem("gameState");

  // sessionStorage - 게임/방 관련
  sessionStorage.removeItem("roomId");
  sessionStorage.removeItem("socketId");
  sessionStorage.removeItem("currentTurnPlayerId");
  sessionStorage.removeItem("existingPlayers");
  sessionStorage.removeItem("gameServerUrl");
  sessionStorage.removeItem("gameTicket");
  sessionStorage.removeItem("readyTimeoutSnapshot");
  sessionStorage.removeItem("turnTimeoutSnapshot");
}
