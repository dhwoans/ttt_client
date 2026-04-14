export const ROUTES = {
  root: "/",
  login: "/login",
  lobby: "/lobby",
  game: {
    single: "/game/single",
    roomPattern: "/game/room/:roomId",
    room: (roomId: string) => `/game/room/${roomId}`,
    localHostPattern: "/game/local/host/:sessionId",
    localGuestPattern: "/game/local/guest/:sessionId",
    localHost: (sessionId: string) => `/game/local/host/${sessionId}`,
    localGuest: (sessionId: string) => `/game/local/guest/${sessionId}`,
  },
} as const;

export const isAuthenticated = () => {
  const userId = sessionStorage.getItem("userId");
  const nickname = sessionStorage.getItem("nickname");
  return !!(userId && nickname);
};
