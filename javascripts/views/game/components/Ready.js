class Ready {
  constructor() {}
  rendering() {
    this.$exitBtn = document.createElement("button");
    this.$readyBtn = document.createElement("button");
    const $image = document.createElement("img");
    $image.src = tictactoe;
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
}

export default Ready;
