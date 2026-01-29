import { http, HttpResponse } from "msw";

export const handlers = [
  // POST /api/user - 사용자 생성
  http.post("/api/user", async ({ request }) => {
    const body = (await request.json()) as any;
    const { nickname, profile } = body;

    if (!nickname || !profile) {
      return HttpResponse.json(
        { success: false, message: "닉네임과 프로필이 필요합니다." },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        success: true,
        message: 123,
      },
      { status: 201 },
    );
  }),

  // POST /api/room - 방 생성
  http.post("/api/room", async ({ request }) => {
    const body = (await request.json()) as any;
    const { userId } = body;

    if (!userId) {
      return HttpResponse.json(
        { success: false, message: "사용자 ID가 필요합니다." },
        { status: 400 },
      );
    }

    const roomId = `room-${Date.now()}`;
    return HttpResponse.json(
      {
        success: true,
        message: roomId,
      },
      { status: 201 },
    );
  }),

  // GET /api/room - 방 확인
  http.get("/api/room", ({ request }) => {
    const url = new URL(request.url);
    const roomId = url.searchParams.get("roomId");

    if (!roomId) {
      return HttpResponse.json(
        { success: false, message: "roomId가 필요합니다." },
        { status: 400 },
      );
    }

    return HttpResponse.json(
      {
        success: true,
        data: {
          roomId,
          ownerId: "owner-123",
          players: ["player-1", "player-2"],
          status: "waiting",
        },
      },
      { status: 200 },
    );
  }),

  // GET /api/roomList - 방 목록
  http.get("/api/roomList", () => {
    return HttpResponse.json(
      {
        success: true,
        data: [
          {
            roomId: "room-1",
            ownerId: "user-1",
            nickname: "room owner 1",
            playerCount: 1,
            maxPlayers: 2,
            status: "waiting",
          },
          {
            roomId: "room-2",
            ownerId: "user-2",
            nickname: "room owner 2",
            playerCount: 2,
            maxPlayers: 2,
            status: "playing",
          },
        ],
      },
      { status: 200 },
    );
  }),
];
