import { io } from "socket.io-client";
import { eventManager } from "../../util/EventManager.js";
import { GAME_EVENTS } from "../../util/eventList.js";
class GameSocket {
  constructor(url) {
    this.url = url;
    this.roomId = sessionStorage.getItem("roomId");
    this.userId = sessionStorage.getItem("userId");
    this.userNickname = sessionStorage.getItem("nickname");
    this.connected = false; // 중복 연결 방지
    this.connect();
    this.handleMessage();
  }

  connect() {
    this.socket = io("/room", {
      path: "/ws/",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        roomId: this.roomId,
        userId: this.userId,
      },
    });
    this.socket.on("connect", () => {
      if (this.connected) return; // 중복 방지
      this.connected = true;
      console.log("연결 성공 ID:", this.socket.id);
      this.socket.emit("JOIN", {
        type: "JOIN",
        message: [this.roomId, this.userId],
        sender: this.userNickname,
      });
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
    });
  }
  // export const GAME_EVENTS = [
  //   { name: "CHAT", handler: "handleChat", log: true },
  //   { name: "JOIN", handler: "handleJoin", log: true },
  //   { name: "LEAVE", handler: "handleLeave" },
  //   { name: "READY", handler: "handleReady", log: true },
  //   { name: "MOVE", handler: "handleMove", log: true },
  //   { name: "PLAYING", handler: "handlePlaying", log: true },
  //   { name: "GAME_OVER", handler: "handleGameOver", log: true },
  // ];

  //reciever
  handleMessage() {
    GAME_EVENTS.forEach(({ name, handler, log }) => {
      this.socket.on(name, (data) => {
        if (log) {
          console.log(`${name} 수신:`, JSON.stringify(data));
        }
        
        // 해당 메서드 확인 후 실행
        if (this.reciever[handler]) {
          this.reciever[handler](data);
        } else {
          console.error(`Handler ${handler}가 reciever에 정의되지 않음.`);
        }
      });
    });
  }
  //sender
  sendMessage(event, dataObject) {
    console.log(`${event} 신호 서버로 보냄`);
    this.socket.emit(event, dataObject);
    if (event === "LEAVE") this.disconnect();
  }

  disconnect() {
    this.socket.disconnect();
  }

  handleClose() {
    console.log("Disconnected from the server");
  }
  handleError() {}
}

export const socket = new GameSocket();
