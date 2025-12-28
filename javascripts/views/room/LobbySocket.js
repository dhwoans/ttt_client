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
  handleConnect() {
    console.log("서버 연결 성공. ID:", this.socket.id);
    this.socket.emit("joinLobby", this.socket.id);
  }

  handleJoinLobby(data) {
    // 서버로부터 로비 입장 확인을 받았을 때의 처리
    console.log("로비 입장 완료");
  }

  handleRoomCreate(data) {
    this.lobby.addRoom(data);
  }

  handleRoomRemove(data) {
    this.lobby.removeRoom(data);
  }

  handlePlayerPlus(data) {
    // data에 roomId가 포함되어 있다고 가정
    this.lobby.changePlayer(data, 1);
  }

  handlePlayerMinus(data) {
    this.lobby.changePlayer(data, -1);
  }
}

export default LobbySocket;
