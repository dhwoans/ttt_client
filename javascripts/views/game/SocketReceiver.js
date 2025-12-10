import initGame from "./init.js";

class Recever {
  constructor(logs, modal, player, board) {
    (this.logs = logs),
      (this.modal = modal),
      (this.player = player),
      (this.board = board);
  }
  handleError(data) {
    //일단 404로 보냄
    window.location.href = "/error";
  }
  handleInfo(data) {
    if (data.message === "O" || data.message === "X") {
      setSymbol(data.message);
      this.player.rendering("player1");
      this.logs.socketConnection();
    } else {
      this.logs.socketDisConnection();
    }
  }

  handleMove(data) {
    const { type, message, sender } = data;
    const [nickname, move] = message;
    const x = Math.floor(move / 3);
    const y = move % 3;
    const moveMessage = `${nickname}님이 ${x},${y}에 수를 뒀습니다`;
    this.logs.update([type, moveMessage, sender]);
    this.logs.setInfo([x, y]);
    this.board.updateBoard();
    // 게임 오버 렌더링
  }

  handleChat(data) {
    const { type, message, sender } = data;
    this.logs.update([type, message, sender]);
  }
  handleJoin(data) {
    const { type, userId, nickname } = data;
    if (!this.player.hasUser(userId)) {
      this.player.rendering(userId, nickname);
      const sendMessage = `${nickname}이/가 입장했습니다.👋👋👋`;
      this.logs.update([type, sendMessage, "system"]);
    }
    this.logs.socketConnection();
  }
  handleLeave(data) {
    const { type, message, sender } = data;
    const [userId, nickname] = message;
    if (this.player.hasUser(userId)) {
      this.player.leavePlayer(userId);
    }
    const sendMessage = `${nickname}이/가 나갔습니다.🖐️🖐️🖐️`;
    this.logs.update([type, sendMessage, sender]);
  }
  handleReady(data) {
    const [userId, status] = data.message;
    this.player.highlight(userId, status);
  }
  handleGameStart(data) {
    const { type, message, sender } = data;
    this.player.removeAllhighlight();
    const { playerId, nickname } = message;
    if (!this.board.status) {
      this.board.status = true;
      this.board.renderingGameBoard();
      // 시작 알림
      const startMessage = "게임이 시작되었습니다.";
      this.logs.update(["", startMessage, sender]);
    }

    // 이번턴 플레이어 하이트라이트
    this.player.highlight(playerId, true);
    // 버튼 비활성화
    if (playerId === sessionStorage.getItem("userId")) {
      this.board.offBtn(false);
    } else {
      this.board.offBtn(true);
    }
  }
  handleGameOver(data) {
    const { type, message, sender } = data;
    this.player.removeAllhighlight();
    this.modal.rendering(message);
  }
  handleReset(data) {
    initGame();
    const { type, message, sender } = data;
    this.logs.update(["", message, sender]);
  }
}

export default Recever;
