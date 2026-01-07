import { eventManager } from "../../util/EventManager";

class Sender {
  connectSocket(socket) {
    this.socket = socket;
    this.roomId = sessionStorage.getItem("roomId");
    this.userNickname = sessionStorage.getItem("nickname");
  }
  setupEventListeners() {
    eventManager.on("BOARD_UPDATE", (x, y) => this.handleBoard(x, y));
    eventManager.on("CHAT_UPDATE", (message) => this.handleChat(message));
    eventManager.on("READY_UPDATE", (status) => this.handleReady(status));
    eventManager.on("LEAVE", () => this.handleLeave());
  }

  handleBoard(x, y) {
    const data = {
      type: "MOVE",
      message: [this.roomId, 3 * x + y],
      sender: this.userNickname,
    };
    this.socket.sendMessage("MOVE", data);
  }
  handleChat(message) {
    const data = {
      type: "CHAT",
      message: [this.roomId, message],
      sender: this.userNickname,
    };
    this.socket.sendMessage("CHAT", data);
  }
  handleReady(status) {
    const data = {
      type: "READY",
      message: [this.roomId, status],
      sender: this.userNickname,
    };
    this.socket.sendMessage("READY", data);
  }
  handleLeave() {
    const data = {
      type: "LEAVE",
      message: [this.roomId],
      sender: this.userNickname,
    };
    this.socket.sendMessage("LEAVE", data);
  }
}

export default Sender;
