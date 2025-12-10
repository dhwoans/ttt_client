class GameOverModal {
  constructor(sender) {
    this.sender = sender;
    this.gameOverElement = document.createElement("dialog");
    this.gameOverElement.classList.add("exit");
    this.userId = sessionStorage.getItem("userId");
  }

  rendering(playerId) {
    const h2 = document.createElement("h2");
    const btnContainer = document.createElement("div");
    const img = document.createElement("img");
    const restartBtn = document.createElement("button");
    const exitBtn = document.createElement("button");

    h2.classList.add("result");
    this.gameOverElement.classList.add("game-over");

    this.checkWinner(playerId, h2, img);
    restartBtn.textContent = "다시하기";
    exitBtn.textContent = "나가기";

    restartBtn.addEventListener("click", () => this.handleRestartBtn());
    exitBtn.addEventListener("click", () => {
      this.gameOverElement.close();
      this.sender.handleLeave();
      window.sessionStorage.removeItem("roomId");
      window.location.href = "/";
    });

    this.gameOverElement.appendChild(h2);
    this.gameOverElement.appendChild(img);
    btnContainer.appendChild(restartBtn);
    btnContainer.appendChild(exitBtn);
    this.gameOverElement.appendChild(btnContainer);

    document.body.appendChild(this.gameOverElement);
    this.gameOverElement.showModal();
  }
  checkWinner(playerId, h2, img) {
    let result = "무승부";
    img.src = "../../../assets/loose_fric.gif";
    if ("DRAW" !== playerId) {
      result = playerId === this.userId ? "승리" : "패배";
      img.src =
        playerId === this.userId
          ? "../../../assets/Dance_fric.gif"
          : "../../../assets/loose_fric.gif";
    }
    h2.textContent = result;
  }
  handleRestartBtn() {
    // 서버에 초기화 요청
    this.sender.handleReset();
    this.gameOverElement.close();
    document.body.removeChild(this.gameOverElement);
    
  }
}

export default GameOverModal;
