import initGame from "./init.js";
import dance_fricGIF from "/assets/Dance_fric.gif";
import loose_fricGIF from "/assets/loose_fric.gif";
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
    // 자동나가기
    this.autoExit();
  }
  checkWinner(playerId, h2, img) {
    let result = "무승부";
    img.src = loose_fricGIF;
    if ("DRAW" !== playerId) {
      result = playerId === this.userId ? "승리" : "패배";
      img.src = playerId === this.userId ? dance_fricGIF : loose_fricGIF;
    }
    h2.textContent = result;
  }
  handleRestartBtn() {
    // 모달 닫기 및 요소 제거
    this.gameOverElement.close();
    document.body.removeChild(this.gameOverElement);
    // 클라이언트에서 게임 재시작 (렌더링 초기화)
    initGame(this.sender);
  }
  autoExit() {
    setTimeout(() => {
      this.gameOverElement.close();
      document.body.removeChild(this.gameOverElement);
      this.sender.handleLeave();
      window.sessionStorage.removeItem("roomId");
      window.location.href = "/";
    }, 5000);
  }
}

export default GameOverModal;
