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
 * 게임 세션 종료 시 관련 상태를 모두 초기화합니다.
 * handleExit, READY_TIMEOUT_EXPIRED 등 모든 퇴장 경로에서 사용합니다.
 */
export function clearGameSession() {
  // localStorage
  localStorage.removeItem("gameState");

  // sessionStorage - 게임/방 관련
  sessionStorage.removeItem("roomId");
  sessionStorage.removeItem("gameMode");
  sessionStorage.removeItem("socketId");
  sessionStorage.removeItem("currentTurnPlayerId");
  sessionStorage.removeItem("existingPlayers");
  sessionStorage.removeItem("gameServerUrl");
  sessionStorage.removeItem("gameTicket");
  sessionStorage.removeItem("readyTimeoutSnapshot");
  sessionStorage.removeItem("turnTimeoutSnapshot");
}
