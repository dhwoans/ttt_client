import { getUserNickname } from "../../temp/gameInfo.js";

class Sender {
  connectSocket(socket) {
    this.socket = socket;
    this.roomId = sessionStorage.getItem("roomId");
  }

  handleBoard(x, y) {
    const data = {
      type: "MOVE",
      message: [this.roomId, 3 * x + y],
      sender: getUserNickname(),
    };
    this.socket.sendMessage("MOVE", data);
  }
  handleChat(message) {
    const data = {
      type: "CHAT",
      message: [this.roomId, message],
      sender: getUserNickname(),
    };
    this.socket.sendMessage("CHAT", data);
  }
  handleReady(status) {
    const data = {
      type: "READY",
      message: [this.roomId, status],
      sender: getUserNickname(),
    };
    this.socket.sendMessage("READY", data);
  }
  handleLeave() {
    const data = {
      type: "LEAVE",
      message: [this.roomId],
      sender: getUserNickname(),
    };
    this.socket.sendMessage("LEAVE", data);
  }
  handleReset() {
    const data = {
      type: "RESET",
      message: [this.roomId],
      sender: getUserNickname(),
    };
    this.socket.sendMessage("RESET", data);
  }
}

export default Sender;
