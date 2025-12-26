import { io } from "socket.io-client";
import { LOBBY_EVENTS } from "../../util/socketEvent";

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
    LOBBY_EVENTS.forEach(({ name, handler, log }) => {
      if (typeof this[handler] !== "function") {
        console.warn(`[Warning] 핸들러 ${handler}가 구현되지 않았습니다.`);
        return;
      }

      this.socket.on(name, (data) => {
        if (log) {
          console.log(`[${name}] Received:`, JSON.stringify(data, null, 2));
        }
        this[handler](data);
      });
    });
  }
  disconnect() {
    this.socket.disconnect();
  }
  onConnect() {
    console.log("연결 성공 ID:", this.socket.id);
    this.socket.emit("joinLobby", this.socket.id);
  }

  onJoinLobby() {
    console.log("[joinLobby] 서버 신호 수신");
  }

  onRoomCreate(data) {
    this.lobby.addRoom(data);
  }

  onRoomRemove(data) {
    this.lobby.removeRoom(data);
  }

  onPlayerPlus(data) {
    this.lobby.changePlayer(data, 1);
  }

  onPlayerMinus(data) {
    this.lobby.changePlayer(data, -1);
  }
}

export default LobbySocket;
