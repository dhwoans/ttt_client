import { io } from "socket.io-client";
import { eventManager } from "../../util/EventManager";
import { LOBBY_EVENTS } from "../../util/eventList";

class LobbySocket {
  constructor() {
    this.socket = io("/lobby", {
      path: "/ws/",
      auth: { userId: sessionStorage.getItem("userId") },
    });
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
    eventManager.emit(LOBBY_EVENTS);
    this.lobby.addRoom(data);
  }

  handleRoomRemove(data) {
    this.lobby.removeRoom(data);
  }

  handlePlayerPlus(data) {
    this.lobby.changePlayer(data, 1);
  }

  handlePlayerMinus(data) {
    this.lobby.changePlayer(data, -1);
  }
}

export default LobbySocket;
