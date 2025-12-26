import Player from "./Player.js";
import gameBoard from "./GameBoard.js";
import Logs from "./Logs.js";
import GameOverModal from "./GameOverModal.js";
import EixtModal from "./ExitModal.js";

import GameConnection from "./Websocket.js";
import Reciever from "./SocketReceiver.js";
import Sender from "./SocketSender.js";

const reciever = new Reciever(logs, modal, player, board);
const socket = new GameConnection("/game", reciever);
const sender = new Sender();
sender.connectSocket(sender);

const initGame = (sender) => {
  const $gameBoard = document.getElementById("game-board");
  const $logs = document.getElementById("messages-container");
  const $player = document.getElementById("players");

  $player.innerHTML = "";
  $gameBoard.innerHTML = "";
  $logs.innerHTML = "";

  const exitModal = new EixtModal(sender);
  const player = new Player(sender);
  const modal = new GameOverModal(sender);
  const logs = new Logs($logs, sender);
  const board = new gameBoard($gameBoard, logs, sender);



  window.addEventListener("beforeunload", function () {
    sender.handleLeave();
    // this.window.sessionStorage.removeItem("roomId");
  });
};

export default initGame;
