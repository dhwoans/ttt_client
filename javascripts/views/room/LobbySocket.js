import { io } from "socket.io-client";

class LobbySocket {
  constructor(lobby) {
    this.socket = io("/lobby", {
      path: "/ws/",
      auth: { userId: sessionStorage.getItem("userId") },
    });
    this.lobby = lobby;
    this.handleMessage();
  }
  handleMessage() {
    this.socket.on("connect", () => {
      console.log("연결 성공 ID:", this.socket.id);
      this.socket.emit("joinLobby", this.socket.id);
    });

    this.socket.on("joinLobby", () => {
      console.log("[joinLobby] 서버에서 신호들어옴");
    });

    this.socket.on("ROOM_CREATE", (data) => {
      console.log(`[ROOM_CREATE] Received: ${JSON.stringify(data, null, 2)}`);
      this.lobby.addRoom(data);
    });
    this.socket.on("ROOM_REMOVE", (data) => {
      console.log(`[ROOM_REMOVE] Received: ${JSON.stringify(data, null, 2)}`);
      this.lobby.removeRoom(data);
    });
    this.socket.on("PLAYER_PLUS", (data) => {
      //roomId
      console.log(`[PLAYER_PLUS] Received: ${JSON.stringify(data, null, 2)}`);
      this.lobby.changePlayer(data, 1);
    });
    this.socket.on("PLAYER_MINUS", (data) => {
      //roomId
      console.log(`[PLAYER_MINUS] Received: ${JSON.stringify(data, null, 2)}`);
      this.lobby.changePlayer(data, -1);
    });
  }
  disconnect() {
    this.socket.disconnect();
  }
}

export default LobbySocket;
