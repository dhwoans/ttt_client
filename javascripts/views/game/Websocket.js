import { getUserId, getUserNickname } from "../../temp/gameInfo.js";
class GameConnection {
  constructor(url, reciever) {
    this.reciever = reciever;
    this.url = url;
  }

  connect() {
    this.socket = new WebSocket(this.url);

    this.socket.onopen = () => this.handleOpen();
    this.socket.onmessage = (e) => this.handleMessage(e);
    this.socket.onclose = () => this.handleClose();
    this.socket.onerror = () => this.handleError();
  }
  checkConnetion() {
    if (this.socket && this.socket.readyState === WebSocket.OPEN) {
      return true;
    } else {
      return false;
    }
  }
  handleOpen() {
    const data = {
      type: "JOIN",
      //url로 직접치고 들어오면 막힘
      roomId: sessionStorage.getItem("roomId"),
      nickname: getUserNickname(),
      sender: getUserId(),
    };
    this.sendMessage(data);
  }

  handleMessage(event) {
    let data;
    try {
      data = JSON.parse(event.data);
    } catch (e) {
      console.error("Error parsing received JSON:", e);
      this.logs.socketDisConnection();
      return;
    }

    console.log(`Received: ${JSON.stringify(data, null, 2)}`);
    data = Array.isArray(data) ? data : [data];
    data.forEach((data) => {
      if (data.type === "MOVE") {
        this.reciever.handleMove(data);
      } else if (data.type === "INFO") {
        this.reciever.handleInfo(data);
      } else if (data.type === "CHAT") {
        this.reciever.handleChat(data);
      } else if (data.type === "JOIN") {
        this.reciever.handleJoin(data);
      } else if (data.type === "LEAVE") {
        this.reciever.handleLeave(data);
      } else if (data.type === "READY") {
        this.reciever.handleReady(data);
      } else if (data.type === "PLAYING") {
        this.reciever.handleGameStart(data);
      } else if (data.type === "ERROR") {
        this.reciever.handleError(data);
      } else if (data.type === "GAME_OVER") {
        this.reciever.handleGameOver(data);
      } else if (data.type === "RESET") {
        this.reciever.handleReset(data)
      }
    });
  }

  sendMessage(dataObject) {
    if (this.checkConnetion()) {
      this.socket.send(JSON.stringify(dataObject));
      console.log("Sent JSON:", dataObject);
    }
  }

  handleClose() {
    // this.sendMessage({ type: "info", message: "out", sender: this.nickname });
    console.log("Disconnected from the server");
  }
  handleError() {}
}

export default GameConnection;
