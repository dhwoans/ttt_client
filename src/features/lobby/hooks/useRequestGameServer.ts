import { useJoinRoom } from "./useJoinRoom";

/**
 * API 서버로 게임 서버 요청 및 티켓 받기
 */
export function useRequestGameServer() {
  const requestGameServer = async () => {
    // API 서버로 게임 서버 요청
    const response = await useJoinRoom();

    if (response && response.success && "data" in response && response.data) {
      // 게임 서버 정보를 세션에 저장
      sessionStorage.setItem("gameServerUrl", response.data.gameServerUrl);
      sessionStorage.setItem("gameTicket", response.data.ticket);

      return {
        success: true,
        gameServerUrl: response.data.gameServerUrl,
        ticket: response.data.ticket,
      };
    }

    return { success: false };
  };

  return { requestGameServer };
}
