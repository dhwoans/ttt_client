import { io } from "socket.io-client";
import { getUserId, getUserNickname } from "../../temp/gameInfo.js";
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

  //reciever
  handleMessage() {
    this.socket.on("CHAT", (data) => {
      this.reciever.handleChat(data);
    });
    this.socket.on("JOIN", (data) => {
      console.log("join 수신 ", JSON.stringify(data));
      this.reciever.handleJoin(data);
    });
    this.socket.on("LEAVE", (data) => {
      this.reciever.handleLeave(data);
    });
    this.socket.on("READY", (data) => {
      console.log("READY 수신 ", JSON.stringify(data));
      this.reciever.handleReady(data);
    });
    this.socket.on("GAME_START", (data) => {
      this.reciever.handleGameStart(data);
    });
    this.socket.on("MOVE", (data) => {
      this.reciever.handleMove(data);
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
