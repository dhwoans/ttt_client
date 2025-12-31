import { createRoom, getRoomList } from "../../util/network.js";
import { effectrepeat, removeRepeat } from "../../util/effect.js";
import emptyFricGif from "/assets/empty_fric.gif";
class Lobby {
  constructor() {
    const userId = sessionStorage.getItem("userId");
    const userNickname = sessionStorage.getItem("nickname");
    this.roomList = [];
    this.$roomContainer = document.getElementById("room-container");
    this.$roomList = document.querySelector(".room-list");
    this.$makeRoomBtn = document.getElementById("makeRoom");
    this.$reloadBtn = document.getElementById("reload");
    this.$userId = document.getElementById("userId");
    this.$userId.textContent = userId;
    this.rendered = false;
    //방만들기 , 초기화 버튼 이벤트
    this.$makeRoomBtn.addEventListener(
      "click",
      async () => await createRoom(userId, userNickname)
    );
    this.$reloadBtn.addEventListener("click", async () => this.rendering());
    effectrepeat(this.$makeRoomBtn, "pulse");
    // 방목록 받아오기
    this.#getInitRoomList();
  }

  async #getInitRoomList() {
    try {
      this.roomList = await getRoomList();
    } catch (err) {
      console.error(`${this.constructor.name} : ${err}`);
      this.roomList = [];
    } finally {
      this.rendering();
    }
  }

  rendering() {
    if (!this.rendered && this.roomList.length === 0) return;
    if (this.roomList.length === 0) {
      this.rendered = false;
      this.$roomList.innerHTML = "";
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
    this.rendered = true;
    this.$roomList.innerHTML = "";
    removeRepeat(this.$makeRoomBtn);
    effectrepeat(this.$reloadBtn, "pulse");
    const ul = document.createElement("ul");
    ul.classList.add("room-list");
    this.roomList.forEach((item) => {
      const li = document.createElement("li");
      const btn = document.createElement("button");
      const h3 = document.createElement("h3");
      const small = document.createElement("small");
      const roomId = item.roomId;
      const isfull = item.currentPlayers == item.maxPlayers;

      li.classList.add("room-item");
      btn.classList.add("room-btn");
      h3.classList.add("room-title");

      h3.textContent = isfull ? "인원 초과" : "방 있음";
      small.textContent = `${item.currentPlayers} / ${item.maxPlayers}`;

      if (isfull) {
        li.classList.add("full");
      }
      // btn.dataset.roomId = roomId
      btn.addEventListener("click", () => {
        if (item.currentPlayers < item.maxPlayers) {
          sessionStorage.setItem("roomId", roomId);
          window.lobbyWebsocket.disconnect();
          window.location.href = `/room/${roomId}`;
        }
      });

      btn.append(h3, small);
      li.append(btn);
      ul.appendChild(li);
    });

    this.$roomList.appendChild(ul);
  }
  // 방생성
  addRoom(data) {
    this.roomList.push(data);
    this.rendering();
  }
  removeRoom(data) {
    this.roomList = this.roomList.filter((room) => {
      room.roomId !== data.roomId;
    });
    this.rendering();
  }
  changePlayer(data, num) {
    this.roomList.forEach((room) => {
      if (room.roomId === data.roomId) {
        room.currentPlayers += num;
      }
    });
    this.rendering();
  }
}

export default Lobby;
