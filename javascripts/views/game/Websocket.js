import { io } from "socket.io-client";
import { getUserId, getUserNickname } from "../../util/gameInfo.js";
import { GAME_EVENTS } from "../../util/socketEvent.js";
class GameConnection {
  constructor(url, reciever) {
    this.reciever = reciever;
    this.url = url;
    this.roomId = sessionStorage.getItem("roomId");
    this.userId = sessionStorage.getItem("userId");
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
        sender: getUserNickname(),
      });
    });

    this.socket.on("disconnect", () => {
      this.connected = false;
    });
  }
  // if (data.type === "MOVE") {
  //   this.reciever.handleMove(data);
  // } else if (data.type === "INFO") {
  //   this.reciever.handleInfo(data);
  // } else if (data.type === "CHAT") {
  //   this.reciever.handleChat(data);
  // } else if (data.type === "JOIN") {
  //   this.reciever.handleJoin(data);
  // } else if (data.type === "LEAVE") {
  //   this.reciever.handleLeave(data);
  // } else if (data.type === "READY") {
  //   this.reciever.handleReady(data);
  // } else if (data.type === "PLAYING") {
  //   this.reciever.handleGameStart(data);
  // } else if (data.type === "ERROR") {
  //   this.reciever.handleError(data);
  // } else if (data.type === "GAME_OVER") {
  //   this.reciever.handleGameOver(data);
  // } else if (data.type === "RESET") {
  //   this.reciever.handleReset(data);
  // }

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

export default GameConnection;
