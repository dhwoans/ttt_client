export const GAME_EVENTS = [
  { name: "CHAT", handler: "handleChat", log: true },
  { name: "JOIN", handler: "handleJoin", log: true },
  { name: "LEAVE", handler: "handleLeave" },
  { name: "READY", handler: "handleReady", log: true },
  { name: "MOVE", handler: "handleMove", log: true },
  { name: "GAME_START", handler: "handleGameStart", log: true },
  { name: "PLAYING", handler: "handleGameStart", log: true },
  { name: "GAME_OVER", handler: "handleGameOver", log: true },
];

export const LOBBY_EVENTS = [
  { name: "connect", handler: "onConnect", log: true },
  { name: "joinLobby", handler: "onJoinLobby", log: true },
  { name: "ROOM_CREATE", handler: "onRoomCreate", log: true },
  { name: "ROOM_REMOVE", handler: "onRoomRemove", log: true },
  { name: "PLAYER_PLUS", handler: "onPlayerPlus", log: true },
  { name: "PLAYER_MINUS", handler: "onPlayerMinus", log: true },
];
