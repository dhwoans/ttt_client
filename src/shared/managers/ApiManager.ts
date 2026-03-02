import { animalList } from "../constants/randomAvatar";
import { getPlayerInfoFromStorage } from "../utils/playerStorage";

interface JoinRoomResponse {
  success: boolean;
  gameServerUrl: string;
  ticket: string;
}
interface CreateUserResponse {
  success: boolean;
  message: string;
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
  // 접속가능한 게임서버주소,입장티켓 리턴
  async joinRoom(): Promise<JoinRoomResponse | null> {
    const userId = sessionStorage.getItem("userId");
    const { nickname, avatarIndex } = getPlayerInfoFromStorage();
    const avatar = animalList[avatarIndex]?.[0];

    if (!userId) {
      console.error("[API] userId not found in sessionStorage");
      return null;
    }

    return await this.request<JoinRoomResponse>("/api/ticket", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, nickname, avatar }),
    });
  }
  // POST /api/user - 사용자 생성
  async createUser(userData: {
    nickname: string;
    avatar?: string;
  }): Promise<CreateUserResponse | null> {
    return await this.request("/api/user", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });
  }
}

export const apiManager = new ApiManager();
