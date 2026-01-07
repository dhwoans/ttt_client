import dance_fricGIF from "/assets/Dance_fric.gif";
import loose_fricGIF from "/assets/loose_fric.gif";
import JSConfetti from "js-confetti";
class GameOverModal {
  constructor(sender) {
    this.sender = sender;
    this.gameOverElement = document.createElement("dialog");
    this.gameOverElement.classList.add("exit");
    this.userId = sessionStorage.getItem("userId");
    this.result = "무승부";
  }

  rendering(playerId) {
    this.checkWinner(playerId);
    this.#actionConfetti();

    this.gameOverElement.innerHTML = "";
    const h2 = document.createElement("h2");
    const btnContainer = document.createElement("div");
    const img = document.createElement("img");
    const restartBtn = document.createElement("button");
    const exitBtn = document.createElement("button");

    h2.classList.add("result");
    this.gameOverElement.classList.add("game-over");

    img.src = this.result === "승리" ? dance_fricGIF : loose_fricGIF;
    h2.textContent = this.result;
    restartBtn.textContent = "다시하기";
    exitBtn.textContent = "나가기";

    restartBtn.addEventListener("click", () => this.handleRestartBtn());
    exitBtn.addEventListener("click", () => {
      this.#exit();
    });

    this.gameOverElement.appendChild(h2);
    this.gameOverElement.appendChild(img);
    btnContainer.appendChild(restartBtn);
    btnContainer.appendChild(exitBtn);
    this.gameOverElement.appendChild(btnContainer);

    document.body.appendChild(this.gameOverElement);
    this.gameOverElement.showModal();
    // 자동나가기
    this.autoExitTimer = this.#autoExit(5000);
  }
  #exit() {
    this.sender.handleLeave();
    this.gameOverElement.close();
    sessionStorage.removeItem("PLAYING");
    window.sessionStorage.removeItem("roomId");
    window.location.href = "/";
  }
  checkWinner(playerId) {
    if (playerId === "DRAW") return;
    this.result = playerId === this.userId ? "승리" : "패배";
  }

  handleRestartBtn() {
    // 자동종료 타이머 초기화
    clearTimeout(this.autoExitTimer);
    // 모달 닫기 및 요소 제거
    this.gameOverElement.close();
    document.body.removeChild(this.gameOverElement);
  }
  #autoExit(time) {
    return setTimeout(() => {
      this.#exit();
    }, time);
  }
  #actionConfetti() {
    const emoji = this.result == "승리" ? "🐸" : "💩";
    const jsConfetti = new JSConfetti();
    jsConfetti.addConfetti({
      emojis: [emoji],
      emojiSize: 30,
      confettiNumber: 50,
    });
  }
}

export default GameOverModal;
