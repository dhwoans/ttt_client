import empty_fric from "/assets/empty_fric.gif";


class EmptyLobbyMessage {
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


// <div class="empty-lobby-message">
//   <img src="/assets/empty_fric.gif" />
//   <h1>방이 없어요! 방이 없어요!</h1>
//   <h1>방이 없어요! 방이 없어요!</h1>
//   <h1>방이 없어요! 방이 없어요!</h1>
//   <h1>방이 없어요! 방이 없어요!</h1>
// </div>;

export default EmptyLobbyMessage;
