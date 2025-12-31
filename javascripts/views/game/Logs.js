class Logs {
  constructor(selector, sender) {
    this.element = selector;
    this.sender = sender;
    this.$input = document.createElement("input");
    this.$btn = document.createElement("button");
    this.$status = document.createElement("div");
    this.$log = document.createElement("ol");
    this.infos = [];
  }
  initState() {
    this.element.innerHTML = "";
    this.infos = [];
  }
  rendering() {
    //상태초기화
    this.initState();
    // UI 렌더링
    const $sendCotainer = document.createElement("div");

    this.$status.id = "status";
    this.$log.id = "log";
    $sendCotainer.classList.add("send-container");
    this.$input.id = "message-input";

    this.$input.tpye = "text";
    this.$input.placeholder = "Type your message";
    this.$btn.innerHTML = `<span class="material-symbols-outlined">
arrow_forward_ios
</span>`;
    this.$btn.classList.add("message-btn");
    this.$status.textContent = "Connecting to server...";
    this.$btn.addEventListener("click", () => {
      this.handleMessage();
    });
    this.$input.addEventListener("keydown", (e) => {
      if (e.key === "Enter") {
        console.log("Enter");
        this.handleMessage();
      }
    });

    $sendCotainer.appendChild(this.$input);
    $sendCotainer.append(this.$btn);
    this.element.appendChild(this.$status);
    this.element.appendChild(this.$log);
    this.element.appendChild($sendCotainer);
  }
  //웹소켓으로 메시지 전송
  handleMessage() {
    if (this.$input.value === "") {
      this.$input.focus();
    } else {
      this.sender.handleChat(this.$input.value);
      this.$input.value = "";
    }
  }

  setInfo(info) {
    const symbol = this.infos.length % 2 == 0 ? "X" : "O";
    const data = {
      symbol: symbol,
      move: info,
    };
    this.infos.push(data);
  }
  get moves() {
    return this.infos;
  }

  update([type, message, sender]) {
    const li = document.createElement("li");
    const chat = document.createElement("p");
    const nickname = document.createElement("small");
    if (sender === "system") {
      li.classList.add("system");
      chat.classList.add("system");
      li.appendChild(chat);
    } else if (type === "CHAT") {
      if (sender !== sessionStorage.getItem("nickname")) {
        li.classList.add("other");
        chat.classList.add("other");
        nickname.textContent = `${sender}`;
        // 이름 대화
        li.appendChild(chat);
        li.appendChild(nickname);
      } else {
        li.classList.add("me");
        chat.classList.add("me");
        nickname.textContent = `${sender}`;
        // 대화 이름
        li.appendChild(nickname);
        li.appendChild(chat);
      }
    }
    chat.textContent = `${message}`;
    this.$log.prepend(li);
  }

  socketConnection() {
    this.$status.textContent = "🟢 🟢 🟢 ";
  }
  socketDisConnection() {
    this.$status.textContent = "🔴 🔴 🔴";
  }
}

export default Logs;
