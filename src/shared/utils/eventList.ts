// 이벤트 이름을 지을 때 대상:액션

interface EventConfig {
  name: string;
  handler: string;
  log?: boolean;
}

export const GAME_EVENTS: EventConfig[] = [
  { name: "CHAT", handler: "handleChat", log: true },
  { name: "JOIN", handler: "handleJoin", log: true },
  { name: "LEAVE", handler: "handleLeave" },
  { name: "READY", handler: "handleReady", log: true },
  { name: "MOVE", handler: "handleMove", log: true },
  { name: "PLAYING", handler: "handlePlaying", log: true },
  { name: "GAME_OVER", handler: "handleGameOver", log: true },
];

export const LOBBY_EVENTS: EventConfig[] = [
  { name: "connect", handler: "handleConnect", log: true },
  { name: "joinLobby", handler: "handleJoinLobby", log: true },
  { name: "ROOM_CREATE", handler: "handleRoomCreate", log: true },
  { name: "ROOM_REMOVE", handler: "handleRoomRemove", log: true },
  { name: "PLAYER_PLUS", handler: "handlePlayerPlus", log: true },
  { name: "PLAYER_MINUS", handler: "handlePlayerMinus", log: true },
];
