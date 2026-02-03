interface JoinRoomResponse {
  success: boolean;
  gameServerUrl: string;
  ticket: string;
}

/* ========================================================= */
/* API 통신 관리 */
/* ========================================================= */
class ApiManager {
  private basePath: string;

  constructor(basePath: string = "") {
    this.basePath = basePath;
  }

  async request<T>(path: string, options: RequestInit = {}): Promise<T | null> {
    try {
      const res = await fetch(this.basePath + path, options);
      const data = await res.json();
      return data;
    } catch (err) {
      console.error(`[network] request error ${path}:`, err);
      return null;
    }
  }
  // GET /api/room - 멀티플레이 서버 입장 정보 요청
  async joinRoom(): Promise<JoinRoomResponse | null> {
    return await this.request<JoinRoomResponse>("/api/room", {
      method: "GET",
    });
  }
}

export const apiManager = new ApiManager();
