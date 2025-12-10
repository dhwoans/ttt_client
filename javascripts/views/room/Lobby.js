import { createRoom, getRoomList } from "../../temp/network.js";
import { effectrepeat, removeRepeat } from "../../temp/effect.js";
import emptyFricGif from "/assets/empty_fric.gif";
class Lobby {
  constructor() {
    this.$roomContainer = document.getElementById("room-container");
    this.$roomList = document.querySelector(".room-list");
    this.$makeRoomBtn = document.getElementById("makeRoom");
    this.$reloadBtn = document.getElementById("reload");
    this.$userId = document.getElementById("userId");
    this.$userId.textContent = sessionStorage.getItem("userId");
    //방만들기 , 초기화 버튼 이벤트
    this.$makeRoomBtn.addEventListener("click", async () => await createRoom());
    this.$reloadBtn.addEventListener("click", async () => this.rendering());
    effectrepeat(this.$makeRoomBtn, "pulse");
    this.rendering();
  }

  async rendering() {
    const roomList = await getRoomList();
    this.$roomList.innerHTML = "";
    if (!roomList || roomList.length === 0) {
      this.$roomList.innerHTML = `<div class="empty-lobby-message">
          <img src="${emptyFricGif}" />
          <h1>방이 없어요! 방이 없어요!</h1>
          <h1>방이 없어요! 방이 없어요!</h1>
          <h1>방이 없어요! 방이 없어요!</h1>
          <h1>방이 없어요! 방이 없어요!</h1>
        </div>
      </div>`;
      effectrepeat(this.$makeRoomBtn, "pulse");
      removeRepeat(this.$reloadBtn);
      return;
    }

    // const roomList = [];
    removeRepeat(this.$makeRoomBtn);
    effectrepeat(this.$reloadBtn, "pulse");
    const ul = document.createElement("ul");
    ul.classList.add("room-list");
    roomList.forEach((item) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      const h3 = document.createElement("h3");
      const small = document.createElement("small");
      const roomId = item.roomId;

      li.classList.add("room-item");
      btn.classList.add("room-btn");
      h3.classList.add("room-title");

      h3.textContent = item.isFull ? "인원 초과" : "방 있음";
      small.textContent = `${item.playerCount} / ${item.maxPlayers}`;

      if (item.isFull) {
        li.classList.add("full");
      }
      // btn.dataset.roomId = roomId
      btn.addEventListener("click", () => {
        if (item.playerCount < item.maxPlayers) {
          sessionStorage.setItem("roomId", roomId);
          console.log("in", roomId);
          // const result = await checkRoom(roomId);
          window.location.href = `/room/${roomId}`;
        }
      });

      btn.append(h3, small);
      li.append(btn);
      ul.appendChild(li);
    });

    this.$roomList.appendChild(ul);
  }
}

export default Lobby;
