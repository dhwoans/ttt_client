/* ========================================================= */
/* API 통신 관리 */
/* ========================================================= */

interface CreateRoomResponse {
  success: boolean;
  message: string;
  roomId?: string;
}

interface CheckRoomResponse {
  success: boolean;
  message: string;
  room?: any;
}

interface RoomListResponse {
  success: boolean;
  rooms: any[];
}

interface CreateUserResponse {
  success: boolean;
  message: string;
}

interface CreateUserData {
  nickname: string;
  profile: string;
}

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

  // POST /api/room - 방 생성
  async createRoom(
    userId: string,
    nickname: string,
  ): Promise<CreateRoomResponse | null> {
    return await this.request<CreateRoomResponse>("/api/room", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userId, nickname }),
    });
  }

  // GET /api/room - 방 확인
  async checkRoom(roomId: string): Promise<CheckRoomResponse | null> {
    return await this.request<CheckRoomResponse>(`/api/room?roomId=${roomId}`, {
      method: "GET",
    });
  }

  // GET /api/roomList
  async getRoomList(): Promise<RoomListResponse | null> {
    return await this.request<RoomListResponse>("/api/roomList", {
      method: "GET",
    });
  }

  // POST /api/user
  async createUser(data: CreateUserData): Promise<CreateUserResponse | null> {
    const { nickname, profile } = data;
    return this.request<CreateUserResponse>("/api/user", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ nickname, profile }),
    });
  }
}

export const apiManager = new ApiManager();
