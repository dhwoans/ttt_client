import { useJoinRoom } from "./useJoinRoom";

/**
 * API 서버로 게임 티켓 요청
 */
export function useGetGameTicket() {
  const getGameTicket = async () => {
    // API 서버로 게임 티켓 요청
    const response = await useJoinRoom();

    if (response?.success && response?.data) {
      // 응답 포맷: data = { success, ticket, gameServerUrl }
      const apiResponse = response.data;
      const gameServerUrl = apiResponse.gameServerUrl;
      const ticket = apiResponse.ticket;

      if (gameServerUrl && ticket) {
        // 게임 서버 정보를 세션에 저장
        sessionStorage.setItem("gameServerUrl", gameServerUrl);
        sessionStorage.setItem("gameTicket", ticket);

        return {
          success: true,
          gameServerUrl,
          ticket,
        };
      }
    }

    return { success: false };
  };

  return { getGameTicket };
}
