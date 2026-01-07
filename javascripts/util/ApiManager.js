import { eventManager } from "./EventManager";
/* ========================================================= */
/* API 통신 관리 */
/* ========================================================= */

class ApiManager {
  constructor(basePath = "") {
    this.basePath = basePath;
    this.setupListeners();
  }

  setupListeners() {
    // eventManager의 이벤트를 listen
    eventManager.on("CREATE_ROOM", (data) =>
      this.createRoom(data.userId, data.nickname)
    );
    eventManager.on("GET_ROOM_LIST", () => this.getRoomList());
  }

  // 내부 fetch 래퍼
  async request(path, options = {}) {
    try {
      const res = await fetch(this.basePath + path, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`[network] request error ${path}:`, err);
      return null;
    }
  }

  // POST /api/room - 방 생성
  async createRoom(userId, nickname) {
    const data = await this.request("/api/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nickname }),
    });

    // 결과를 다시 emit (UI가 listen 가능)
    eventManager.emit("ROOM_CREATED", data);
    return data;
  }

  // GET /api/room - 방 확인
  async checkRoom(roomId) {
    return this.request(`/api/room?roomId=${roomId}`, { method: "GET" });
  }

  // GET /api/roomList
  async getRoomList() {
    const data = await this.request("/api/roomList", { method: "GET" });
    eventManager.emit("ROOM_LIST_LOADED", data);
    return data;
  }

  // POST /api/user
  async createUser(userId, nickname) {
    return this.request("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nickname }),
    });
  }
}

export const apiManager = new ApiManager();
