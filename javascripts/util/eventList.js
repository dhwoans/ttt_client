export const GAME_EVENTS = [
  { name: "CHAT", handler: "handleChat", log: true },
  { name: "JOIN", handler: "handleJoin", log: true },
  { name: "LEAVE", handler: "handleLeave" },
  { name: "READY", handler: "handleReady", log: true },
  { name: "MOVE", handler: "handleMove", log: true },
  { name: "PLAYING", handler: "handlePlaying", log: true },
  { name: "GAME_OVER", handler: "handleGameOver", log: true },
];

export const LOBBY_EVENTS = [
  { name: "connect", handler: "handleConnect", log: true },
  { name: "joinLobby", handler: "handleJoinLobby", log: true },
  { name: "ROOM_CREATE", handler: "handleRoomCreate", log: true },
  { name: "ROOM_REMOVE", handler: "handleRoomRemove", log: true },
  { name: "PLAYER_PLUS", handler: "handlePlayerPlus", log: true },
  { name: "PLAYER_MINUS", handler: "handlePlayerMinus", log: true },
];

//socketSender

// eventManager.on("BOARD_UPDATE", (x, y) => this.handleBoard(x, y));
// eventManager.on("CHAT_UPDATE", (message) => this.handleChat(message));
// eventManager.on("READY_UPDATE", (status) => this.handleReady(status));
// eventManager.on("LEAVE", () => this.handleLeave());
