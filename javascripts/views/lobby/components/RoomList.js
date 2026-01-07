class RoomList {
  constructor(props = {}) {
    this.list = props.list;
  }
  redering() {
    const ul = document.createElement("ul");
    ul.classList.add("room-list");
    this.roomList.forEach((item) => {
      const isFull = item.currentPlayers == item.maxPlayers;
      const roomItem = document.createElement("room-items");
      roomItem.item = item;
      if (isFull) {
        roomItem.classList.add("full");
      }
      ul.appendChild(roomItem);
    });
  }
}

export default RoomList;
