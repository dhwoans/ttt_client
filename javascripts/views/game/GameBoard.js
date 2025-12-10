import { effectrepeat, removeRepeat } from "../../temp/effect.js";
class GameBoard {
  constructor(selector, logs, sender) {
    this.element = selector;
    this.logs = logs;
    this.$exitBtn = document.createElement("button");
    this.$readyBtn = document.createElement("button");
    this.sender = sender;
    this.status = false;
    this.#rendering();
  }
  #rendering() {
    const $image = document.createElement("img");
    $image.src = "/assets/Tic_Tac_Toe.gif";
    this.$exitBtn.innerHTML = "나가기";
    this.$readyBtn.innerHTML = "준비";

    this.$exitBtn.classList.add("exit");
    this.$readyBtn.classList.add("ready");
    effectrepeat(this.$readyBtn, "pulse");
    this.$readyBtn.addEventListener("click", () => this.handleReady());
    this.$exitBtn.addEventListener("click", () => this.handleExit());
    this.element.appendChild($image);
    this.element.appendChild(this.$readyBtn);
    this.element.appendChild(this.$exitBtn);
  }
  renderingGameBoard() {
    this.element.innerHTML = "";
    for (let x = 0; x < 3; x++) {
      const li = document.createElement("li");
      const ol = document.createElement("ol");

      li.appendChild(ol);
      this.element.appendChild(li);
      for (let y = 0; y < 3; y++) {
        const lli = document.createElement("li");
        const btn = document.createElement("button");
        lli.dataset.raw = x;
        lli.dataset.col = y;
        btn.addEventListener("click", () => this.handleCell(x, y));
        lli.appendChild(btn);
        ol.appendChild(lli);
      }
    }
  }
  #renderingProgress(duration) {
    const maxTime = duration / 100;
    let remainingTime = 0;

    const $progress = document.createElement("progress");
    $progress.value = 0;
    $progress.max = maxTime;

    this.$readyBtn.replaceWith($progress);

    const intervalId = setInterval(() => {
      remainingTime++;
      $progress.value = remainingTime;
      if (remainingTime > maxTime) {
        clearInterval(intervalId);
        $progress.replaceWith(this.$readyBtn);
      }
    }, 50);
  }
  handleReady() {
    if (this.$readyBtn.textContent === "준비") {
      removeRepeat(this.$readyBtn);

      // 서버로 ready 신호보내기
      this.sender.handleReady(true);
      this.$readyBtn.textContent = "취소";
      this.#renderingProgress(5000);
    } else if (this.$readyBtn.textContent === "취소") {
      effectrepeat(this.$readyBtn, "pulse");
      // 서버로 ready 취소
      this.sender.handleReady(false);
      this.$readyBtn.textContent = "준비";
    }
    this.$readyBtn.classList.toggle("cancel");
  }
  handleExit() {
    this.sender.handleLeave();
    window.sessionStorage.removeItem("roomId");
    window.location.href = "/";
  }
  updateBoard() {
    console.log(this.logs.infos);
    this.logs.infos.map((log) => {
      const { symbol, move } = log;
      const $btn = this.element.querySelector(
        `li[data-raw="${move[0]}"][data-col="${move[1]}"] > button`
      );
      if ($btn) {
        $btn.textContent = symbol;
        $btn.disabled = true;
      }
    });
  }

  handleCell(x, y) {
    this.sender.handleBoard(x, y);
    //버튼비활성화
    this.offBtn(true);
  }

  offBtn(flag) {
    const $btns = this.element.querySelectorAll("button");
    $btns.forEach((btn) => {
      if (btn.textContent === "") btn.disabled = flag;
    });
  }
}

export default GameBoard;
