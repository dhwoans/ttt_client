import empty_fric from "/assets/empty_fric.gif";


class EmptyLobby {
  constructor(props = {}) {
    this.src = props.src || empty_fric;
    this.message = props.message || "404";
    this.repeat = Number(props.repeat) || 1;
  }

  rendering() {
    const container = document.createElement("div");
    container.classList.add("empty-lobby-message");

    const $img = document.createElement("img");
    $img.src = this.src;
    container.appendChild($img);

    for (let i = 0; i < this.repeat; i++) {
      const $message = document.createElement("h1");
      $message.textContent = this.message;
      container.appendChild($message);
    }

    return container;
  }
}

export default EmptyLobby;
