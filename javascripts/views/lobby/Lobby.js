import { eventManager } from "../../util/EventManager.js";

class Lobby {
  constructor() {
    const userId = sessionStorage.getItem("userId");
    const userNickname = sessionStorage.getItem("nickname");
    this.roomInfoList = [];

    this.$roomContainer = document.getElementById("room-container");
    this.$roomList = document.querySelector(".room-list");
    this.$makeRoomBtn = document.getElementById("makeRoom");
    this.$reloadBtn = document.getElementById("reload");
    this.$userId = document.getElementById("userId");
    // init state
    this.$userId.textContent = userId;
    this.rendered = false;
    //방만들기 , 초기화 버튼 이벤트
    this.$makeRoomBtn.addEventListener("click", async () =>
      this.handleCreateRoom()
    );
    this.$reloadBtn.addEventListener("click", async () => this.rendering());
    effectrepeat(this.$makeRoomBtn, "pulse");
    // 방목록 받아오기
    this.#getInitRoomList();
  }

  async #getInitRoomList() {
    try {
      this.roomInfoList = (await getRoomList()) ?? [];
    } catch (err) {
      console.error(`${this.constructor.name} : ${err}`);
      this.roomInfoList = [];
    } finally {
      this.rendering();
    }
  }

  rendering() {
    if (!this.rendered && this.roomInfoList.length === 0) return;
    this.$roomList.innerHTML = "";
    if (this.roomInfoList.length === 0) {
      this.rendered = false;
      const emptyMessage = document.createElement("empty-message");
      emptyMessage.message = "방이 없어요 방이 없어요";
      emptyMessage.repeat = 5;

      this.$roomList.appendChild(emptyMessage);
      effectrepeat(this.$makeRoomBtn, "pulse");
      removeRepeat(this.$reloadBtn);
    } else {
      this.rendered = true;
      removeRepeat(this.$makeRoomBtn);
      effectrepeat(this.$reloadBtn, "pulse");

      const ul = document.createElement("room-list");
      ul.list = this.roomInfoList;
      this.$roomList.appendChild(ul);
    }
  }
  handleCreateRoom() {}
  // 생성렌더링
  addRoom(data) {
    this.roomInfoList.push(data);
    this.rendering();
  }
  removeRoom(data) {
    this.roomInfoList = this.roomInfoList.filter((room) => {
      room.roomId !== data.roomId;
    });
    this.rendering();
  }
  changePlayer(data, num) {
    this.roomInfoList.forEach((room) => {
      if (room.roomId === data.roomId) {
        room.currentPlayers += num;
      }
    });
    this.rendering();
  }
}

export default Lobby;
