class RoomItems {
  constructor(props = {}) {
    this.item = props.item;
  }
  redering() {
    const li = document.createElement("li");
    const btn = document.createElement("button");
    const h3 = document.createElement("h3");
    const small = document.createElement("small");
    const roomId = this.item.roomId;
    const isfull = this.item.currentPlayers == this.item.maxPlayers;

    li.classList.add("room-item");
    btn.classList.add("room-btn");
    h3.classList.add("room-title");

    h3.textContent = isfull ? "인원 초과" : "방 있음";
    small.textContent = `${this.item.currentPlayers} / ${this.item.maxPlayers}`;

    if (isfull) {
      li.classList.add("full");
    }

    btn.addEventListener("click", () => {
      if (this.item.currentPlayers < this.item.maxPlayers) {
        sessionStorage.setItem("roomId", roomId);
        window.lobbyWebsocket.disconnect();
        window.location.href = `/room/${roomId}`;
      }
    });

    btn.append(h3, small);
    li.append(btn);
  }
}

export default RoomItems;
