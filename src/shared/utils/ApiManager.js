import { eventManager } from "./EventManager";
/* ========================================================= */
/* API 통신 관리 */
/* ========================================================= */

class ApiManager {
  constructor(basePath = "") {
    this.basePath = basePath;
  }

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
    return await this.request("/api/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nickname }),
    });
  }

  // GET /api/room - 방 확인
  async checkRoom(roomId) {
    return await this.request(`/api/room?roomId=${roomId}`, { method: "GET" });
  }

  // GET /api/roomList
  async getRoomList() {
    return await this.request("/api/roomList", { method: "GET" });
  }

  // POST /api/user
  async createUser(data) {
    const { userId, nickname, profile } = data;
    return this.request("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nickname, profile }),
    });
  }
}

export const apiManager = new ApiManager();
