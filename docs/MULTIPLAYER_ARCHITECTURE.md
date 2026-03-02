# 멀티플레이 아키텍처 및 통신 흐름

## 📋 목차

1. [개요](#개요)
2. [시스템 아키텍처](#시스템-아키텍처)
3. [서버 구성](#서버-구성)
4. [통신 흐름](#통신-흐름)
5. [티켓 기반 인증](#티켓-기반-인증)
6. [소켓 이벤트](#소켓-이벤트)
7. [주요 컴포넌트](#주요-컴포넌트)
8. [시퀀스 다이어그램](#시퀀스-다이어그램)

---

## 개요

틱택토 멀티플레이 시스템은 **API 서버**와 **게임 서버**(웹소켓)의 2-tier 아키텍처로 구성됩니다.
API 서버는 HTTP 기반으로 인증 및 티켓 발급을 담당하고, 게임 서버는 Socket.io를 통해 실시간 게임 진행을 관리합니다.

### 핵심 특징

- **티켓 기반 인증**: API 서버에서 발급한 일회성 티켓으로 게임 서버 접속
- **분리된 책임**: API 서버(인증/매칭), 게임 서버(실시간 게임 진행)
- **이벤트 기반 통신**: Socket.io의 이벤트 시스템으로 상태 동기화
- **세션 관리**: SessionStorage를 통한 클라이언트 상태 관리

---

## 시스템 아키텍처

```
┌──────────────┐
│   Client     │
│  (Browser)   │
└──────┬───────┘
       │
       │ 1. POST /api/ticket (HTTP)
       ▼
┌──────────────────────┐
│    API Server        │
│  (REST API)          │
│                      │
│  - 티켓 발급          │
│  - 사용자 인증        │
│  - 게임서버 URL 제공  │
└──────┬───────────────┘
       │
       │ 2. ticket + gameServerUrl 반환
       ▼
┌──────────────┐
│   Client     │ sessionStorage에 저장:
│              │  - gameServerUrl
│              │  - ticket
│              │  - userId
└──────┬───────┘
       │
       │ 3. Socket.io 연결 (ticket을 auth로 전달)
       ▼
┌──────────────────────┐
│   Game Server        │
│  (Socket.io)         │
│                      │
│  - 티켓 검증          │
│  - 방 배정            │
│  - 게임 로직 처리     │
│  - 실시간 이벤트      │
└──────┬───────────────┘
       │
       │ 4. ROOM_ASSIGNED 이벤트
       ▼
┌──────────────┐
│   Client     │
│  게임 시작    │
└──────────────┘
```

---

## 서버 구성

### 1. API 서버 (HTTP REST API)

**역할**

- 사용자 생성 및 관리
- 게임 입장 티켓 발급
- 게임 서버 URL 정보 제공
- 매칭 로직 (선택적)

**주요 엔드포인트**

| Method | Path          | 설명                | 요청                   | 응답                                 |
| ------ | ------------- | ------------------- | ---------------------- | ------------------------------------ |
| POST   | `/api/ticket` | 게임 입장 티켓 요청 | -                      | `{ success, gameServerUrl, ticket }` |
| POST   | `/api/user`   | 사용자 생성         | `{ nickname, avatar }` | `{ success, message }`               |

**티켓 발급 예시**

```typescript
// API Response
{
  "success": true,
  "gameServerUrl": "https://game.example.com",
  "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. 게임 서버 (Socket.io WebSocket)

**역할**

- 티켓 기반 인증 처리
- 플레이어 방 배정 (매칭)
- 실시간 게임 상태 동기화
- 게임 로직 검증 (치트 방지)
- 채팅 및 이벤트 브로드캐스팅

**주요 이벤트**

| 이벤트          | 방향            | 설명           | 데이터                                        |
| --------------- | --------------- | -------------- | --------------------------------------------- |
| `connect`       | Client → Server | 소켓 연결 요청 | auth: `{ userId, ticket, roomId? }`           |
| `ROOM_ASSIGNED` | Server → Client | 방 배정 완료   | `{ roomId }`                                  |
| `JOIN`          | Client ↔ Server | 방 입장        | `{ type, message: [roomId, userId], sender }` |
| `READY`         | Client ↔ Server | 준비 완료      | `{ userId }`                                  |
| `PLAYING`       | Server → Client | 게임 시작      | `{ players, currentPlayer }`                  |
| `MOVE`          | Client ↔ Server | 수 두기        | `{ position, userId }`                        |
| `GAME_OVER`     | Server → Client | 게임 종료      | `{ winner, board }`                           |
| `CHAT`          | Client ↔ Server | 채팅 메시지    | `{ message, sender }`                         |
| `LEAVE`         | Client → Server | 방 나가기      | `{ userId }`                                  |

---

## 통신 흐름

### 전체 프로세스 (단계별)

#### **Step 1: 멀티플레이 버튼 클릭**

```typescript
// src/features/lobby/components/MultiMode.tsx
<motion.div onClick={handleMultiMode}>
  멀티플레이
</motion.div>
```

사용자가 멀티플레이 버튼을 클릭하면 `useMultiMode` 훅이 실행됩니다.

#### **Step 2: API 서버에 티켓 요청**

```typescript
// src/features/lobby/hooks/useMultiMode.ts
const { getGameTicket } = useGetGameTicket();

// 1️⃣ API에서 ticket 받기
const response = await getGameTicket();
```

`getGameTicket()` 함수는 내부적으로 다음을 수행합니다:

```typescript
// src/features/lobby/hooks/useGetGameTicket.ts
const getGameTicket = async () => {
  // API 서버로 게임 티켓 요청
  const response = await useJoinRoom();

  if (response?.success && response?.data) {
    const apiResponse = response.data;
    const gameServerUrl = apiResponse.gameServerUrl;
    const ticket = apiResponse.ticket;

    if (gameServerUrl && ticket) {
      // 게임 서버 정보를 세션에 저장
      sessionStorage.setItem("gameServerUrl", gameServerUrl);
      sessionStorage.setItem("gameTicket", ticket);

      return { success: true, gameServerUrl, ticket };
    }
  }

  return { success: false };
};
```

실제 HTTP 요청은 `ApiManager`가 처리합니다:

```typescript
// src/shared/managers/ApiManager.ts
async joinRoom(): Promise<JoinRoomResponse | null> {
  return await this.request<JoinRoomResponse>("/api/ticket", {
    method: "POST",
  });
}
```

**HTTP 요청**

```http
POST /api/ticket HTTP/1.1
Host: api.example.com
Content-Type: application/json
```

**HTTP 응답**

```json
{
  "success": true,
  "gameServerUrl": "https://game.example.com",
  "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiJ1c2VyMTIzIiwiaWF0IjoxNzA5MzY0MDAwLCJleHAiOjE3MDkzNjQ2MDB9.signature"
}
```

#### **Step 3: SessionStorage에 정보 저장**

```javascript
sessionStorage.setItem("gameServerUrl", gameServerUrl);
sessionStorage.setItem("gameTicket", ticket);
```

저장되는 정보:

- `gameServerUrl`: 게임 서버 주소
- `gameTicket`: 인증용 일회성 티켓
- `userId`: 사용자 ID (이전에 저장됨)
- `nickname`: 사용자 닉네임 (이전에 저장됨)

#### **Step 4: 게임 서버에 WebSocket 연결**

```typescript
// src/features/lobby/hooks/useMultiMode.ts
const { connectGameServer } = useConnectGameServer();

// 2️⃣ ticket으로 게임 서버 연결
connectGameServer(response.gameServerUrl!, response.ticket!);
```

`connectGameServer()`는 다음을 수행합니다:

```typescript
// src/features/lobby/hooks/useConnectGameServer.ts
const connectGameServer = useCallback(
  (gameServerUrl: string, ticket: string) => {
    const { nickname } = getPlayerInfoFromStorage();
    const userId = sessionStorage.getItem("userId");

    if (!userId || !ticket) {
      console.error("userId or ticket not found");
      return;
    }

    // Socket.io 연결 (ticket을 auth로 전달)
    gameSocketManager.connect(userId, nickname, "/", { ticket });

    // 서버에서 roomId 받기
    const handleRoomAssigned = (data: any) => {
      const assignedRoomId = data.roomId;
      sessionStorage.setItem("roomId", assignedRoomId);

      // 게임방으로 이동
      navigate(`/game/${assignedRoomId}`, { state: { mode: "multi" } });
    };

    // 한 번만 실행되도록 설정
    eventManager.once("ROOM_ASSIGNED", handleRoomAssigned);
  },
  [navigate],
);
```

#### **Step 5: Socket.io 연결 수립**

```typescript
// src/shared/managers/SocketManager.ts
public connect(
  userId: string,
  nickname: string,
  serverUrl: string = "/room",
  options: { roomId?: string; ticket?: string } = {},
) {
  const { roomId, ticket } = options;

  // Socket.io 클라이언트 초기화
  this.socket = io(serverUrl, {
    path: "/socket.io",
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 5000,
    reconnectionAttempts: 5,
    auth: {
      roomId: roomId,
      userId: userId,
      ticket: ticket,  // 티켓을 auth로 전달
    },
  });

  // 연결 성공 핸들러
  this.socket.on("connect", () => {
    console.log("연결 성공 ID:", this.socket?.id);
    if (roomId) {
      this.socket?.emit("JOIN", {
        type: "JOIN",
        message: [roomId, userId],
        sender: nickname,
      });
    }
  });

  // 이벤트 리스너 등록
  GAME_EVENTS.forEach(({ name, log }) => {
    this.socket?.on(name, (data: any) => {
      if (log) console.log(`${name} 수신:`, data);
      eventManager.emit(name, data);
    });
  });
}
```

**WebSocket Handshake**

```javascript
// Client → Server
{
  "auth": {
    "userId": "user123",
    "ticket": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "roomId": null  // 멀티플레이는 null (서버가 배정)
  }
}
```

#### **Step 6: 서버의 티켓 검증 및 방 배정**

게임 서버는 다음을 수행합니다:

1. **티켓 검증**: JWT 토큰 검증 (서명, 만료시간 확인)
2. **사용자 확인**: 티켓 내 userId와 요청 userId 일치 확인
3. **방 배정**: 대기 중인 방에 배정 또는 새 방 생성
4. **ROOM_ASSIGNED 이벤트 전송**

```javascript
// Server → Client
{
  "event": "ROOM_ASSIGNED",
  "data": {
    "roomId": "room_abc123",
    "players": [],
    "gameState": "waiting"
  }
}
```

#### **Step 7: 클라이언트의 방 정보 저장 및 라우팅**

```typescript
// ROOM_ASSIGNED 이벤트 수신
const handleRoomAssigned = (data: any) => {
  const assignedRoomId = data.roomId;

  // roomId를 세션에 저장
  sessionStorage.setItem("roomId", assignedRoomId);

  // 게임방 페이지로 이동
  navigate(`/game/${assignedRoomId}`, { state: { mode: "multi" } });
};
```

#### **Step 8: 게임 페이지에서 플레이어 정보 처리**

게임 페이지(`/game/:roomId`)에서는 다음 이벤트들을 처리합니다:

```typescript
// EXISTING_PLAYERS 이벤트: 새 플레이어가 들어왔을 때, 그 플레이어에게 기존 플레이어들의 정보 전달
socket.on(
  "EXISTING_PLAYERS",
  (data: {
    players: Array<{
      connId: string; // userId
      nickname: string;
      isReady: boolean;
      avatar: string; // 아바타 ID
      imageSrc?: string; // 아바타 이미지 URL (선택사항)
    }>;
    roomId: string;
  }) => {
    // 기존 플레이어들의 정보를 playersInfos에 추가
    const existingPlayers = data.players.map((player) => ({
      nickname: player.nickname,
      avatar: player.avatar, // 서버에서 받은 아바타
      imageSrc: player.imageSrc || "", // 서버에서 받은 이미지
    }));
    setPlayersInfos((prev) => [...prev, ...existingPlayers]);

    // 기존 플레이어들의 준비 상태 저장
    const readyStatus: Record<string, boolean> = {};
    data.players.forEach((player) => {
      readyStatus[player.connId] = player.isReady;
    });
    setPlayersReadyStatus(readyStatus);
  },
);

// PLAYER_JOINED 이벤트: 새 플레이어가 방에 들어옴
socket.on(
  "PLAYER_JOINED",
  (data: {
    player: {
      userId: string;
      nickname: string;
      isReady: boolean;
      avatar: string; // 아바타 ID
      imageSrc?: string; // 아바타 이미지 URL (선택사항)
    };
    roomId: string;
  }) => {
    // 새 플레이어 정보를 playersInfos에 추가
    setPlayersInfos((prev) => [
      ...prev,
      {
        nickname: data.player.nickname,
        avatar: data.player.avatar,
        imageSrc: data.player.imageSrc || "",
      },
    ]);

    // 새 플레이어의 준비 상태 저장
    setPlayersReadyStatus((prev) => ({
      ...prev,
      [data.player.userId]: data.player.isReady,
    }));
  },
);

// PLAYER_READY 이벤트: 플레이어 준비 상태 변경
socket.on(
  "PLAYER_READY",
  (data: {
    userId: string;
    nickname: string;
    isReady: boolean;
    roomId: string;
  }) => {
    // 준비 상태 업데이트
  },
);

// PLAYING 이벤트: 게임 시작
socket.on("PLAYING", (data) => {
  // 게임 시작, 플레이어 순서 결정
});

// MOVE 이벤트: 수 두기
socket.on("MOVE", (data) => {
  // 보드 상태 업데이트
});

// GAME_OVER 이벤트: 게임 종료
socket.on("GAME_OVER", (data) => {
  // 승자 표시, 모달 표시
});

// CHAT 이벤트: 채팅 메시지
socket.on("CHAT", (data) => {
  // 채팅 메시지 표시
});
```

// CHAT 이벤트: 채팅 메시지
socket.on("CHAT", (data) => {
// 채팅 메시지 표시
});

````

---

## 티켓 기반 인증

### 왜 티켓을 사용하는가?

1. **보안**: 웹소켓 연결 전에 HTTP 기반 인증을 거쳐 검증된 사용자만 접속
2. **분리**: API 서버와 게임 서버의 책임 분리
3. **일회성**: 티켓은 한 번만 사용 가능 (재사용 공격 방지)
4. **만료**: 시간 제한으로 오래된 티켓 무효화

### 티켓 생성 (API 서버)

```javascript
// 예시: JWT 기반 티켓 생성
const jwt = require("jsonwebtoken");

function createGameTicket(userId) {
  const payload = {
    userId: userId,
    iat: Math.floor(Date.now() / 1000), // 발급 시간
    exp: Math.floor(Date.now() / 1000) + 600, // 10분 후 만료
  };

  const secret = process.env.JWT_SECRET;
  const ticket = jwt.sign(payload, secret);

  return ticket;
}
````

### 티켓 검증 (게임 서버)

```javascript
// 예시: Socket.io 미들웨어에서 티켓 검증
io.use((socket, next) => {
  const ticket = socket.handshake.auth.ticket;
  const userId = socket.handshake.auth.userId;

  if (!ticket) {
    return next(new Error("Ticket required"));
  }

  try {
    // JWT 검증
    const decoded = jwt.verify(ticket, process.env.JWT_SECRET);

    // userId 일치 확인
    if (decoded.userId !== userId) {
      return next(new Error("Invalid ticket"));
    }

    // 티켓을 사용된 것으로 표시 (선택적)
    markTicketAsUsed(ticket);

    // 소켓에 사용자 정보 저장
    socket.userId = userId;
    socket.authenticated = true;

    next();
  } catch (err) {
    next(new Error("Ticket verification failed"));
  }
});
```

### 티켓 플로우

```
┌─────────┐                    ┌────────────┐                ┌─────────────┐
│ Client  │                    │ API Server │                │ Game Server │
└────┬────┘                    └─────┬──────┘                └──────┬──────┘
     │                               │                              │
     │  POST /api/ticket             │                              │
     │─────────────────────────────▶ │                              │
     │                               │                              │
     │                               │ 1. 사용자 확인               │
     │                               │ 2. 티켓 생성 (JWT)           │
     │                               │ 3. 티켓 저장 (Redis)         │
     │                               │                              │
     │  { ticket, gameServerUrl }    │                              │
     │ ◀─────────────────────────────│                              │
     │                               │                              │
     │  Socket.io connect (ticket)                                  │
     │──────────────────────────────────────────────────────────────▶│
     │                               │                              │
     │                               │                              │ 1. 티켓 검증
     │                               │                              │ 2. 사용자 인증
     │                               │                              │ 3. 방 배정
     │                               │                              │
     │  ROOM_ASSIGNED { roomId }                                    │
     │ ◀──────────────────────────────────────────────────────────────│
     │                               │                              │
```

---

## 소켓 이벤트

### 클라이언트 → 서버 이벤트

| 이벤트  | 페이로드                                                        | 설명             |
| ------- | --------------------------------------------------------------- | ---------------- |
| `JOIN`  | `{ type: "JOIN", message: [roomId, userId], sender: nickname }` | 방에 입장        |
| `READY` | `{ userId }`                                                    | 준비 완료 표시   |
| `MOVE`  | `{ position, userId, roomId }`                                  | 틱택토 수 두기   |
| `CHAT`  | `{ message, sender, roomId }`                                   | 채팅 메시지 전송 |
| `LEAVE` | `{ userId, roomId }`                                            | 방 나가기        |

### 서버 → 클라이언트 이벤트

| 이벤트             | 페이로드                                                                | 설명                                   |
| ------------------ | ----------------------------------------------------------------------- | -------------------------------------- |
| `ROOM_ASSIGNED`    | `{ roomId, players, gameState }`                                        | 방 배정 완료                           |
| `EXISTING_PLAYERS` | `{ players: [{connId, nickname, isReady, avatar, imageSrc?}], roomId }` | 기존 플레이어 정보 (새 플레이어에게만) |
| `PLAYER_JOINED`    | `{ player: {userId, nickname, isReady, avatar, imageSrc?}, roomId }`    | 새 플레이어 입장 (기존 플레이어들에게) |
| `PLAYER_READY`     | `{ userId, nickname, isReady, roomId }`                                 | 플레이어 준비 상태 변경                |
| `PLAYER_LEFT`      | `{ userId, nickname, roomId }`                                          | 플레이어 퇴장 알림                     |
| `PLAYING`          | `{ players, currentPlayer, board }`                                     | 게임 시작                              |
| `MOVE`             | `{ position, userId, board, nextPlayer }`                               | 수가 두어짐                            |
| `GAME_OVER`        | `{ winner, board, reason }`                                             | 게임 종료                              |
| `CHAT`             | `{ message, sender, timestamp }`                                        | 채팅 메시지 수신                       |
| `LEAVE_SUCCESS`    | `{ success: true }`                                                     | 방 나가기 성공 (본인)                  |

### 이벤트 처리 구조

클라이언트는 `EventManager`를 통해 소켓 이벤트를 관리합니다:

```typescript
// src/shared/managers/EventManager.ts
class EventManager {
  private listeners = new Map();

  emit(event: string, data: any) {
    const handlers = this.listeners.get(event);
    handlers?.forEach((handler) => handler(data));
  }

  on(event: string, handler: Function) {
    // 이벤트 리스너 등록
  }

  once(event: string, handler: Function) {
    // 한 번만 실행되는 리스너 등록
  }

  off(event: string, handler: Function) {
    // 이벤트 리스너 제거
  }
}
```

게임 이벤트 목록:

```typescript
// src/shared/constants/eventList.ts
export const GAME_EVENTS = [
  { name: "CHAT", handler: "handleChat", log: true },
  { name: "JOIN", handler: "handleJoin", log: true },
  { name: "LEAVE", handler: "handleLeave" },
  { name: "READY", handler: "handleReady", log: true },
  { name: "MOVE", handler: "handleMove", log: true },
  { name: "PLAYING", handler: "handlePlaying", log: true },
  { name: "GAME_OVER", handler: "handleGameOver", log: true },
  { name: "ROOM_ASSIGNED", handler: "handleRoomAssigned", log: true },
  { name: "LEAVE_SUCCESS", handler: "handleLeaveSuccess", log: true },
  { name: "PLAYER_LEFT", handler: "handlePlayerLeft", log: true },
  { name: "PLAYER_READY", handler: "handlePlayerReady", log: true },
  { name: "EXISTING_PLAYERS", handler: "handleExistingPlayers", log: true },
  { name: "PLAYER_JOINED", handler: "handlePlayerJoined", log: true },
];
```

---

## 주요 컴포넌트

### 1. ApiManager

**위치**: `src/shared/managers/ApiManager.ts`

**책임**

- HTTP 요청 관리
- API 서버와의 통신
- 응답 에러 처리

**주요 메서드**

```typescript
class ApiManager {
  // 티켓 발급 요청
  async joinRoom(): Promise<JoinRoomResponse | null>;

  // 사용자 생성
  async createUser(userData: {
    nickname;
    avatar;
  }): Promise<CreateUserResponse | null>;

  // 범용 요청 메서드
  async request<T>(path: string, options: RequestInit): Promise<T | null>;
}
```

### 2. GameSocketManager

**위치**: `src/shared/managers/SocketManager.ts`

**책임**

- Socket.io 연결 관리
- 이벤트 송수신
- 재연결 처리

**주요 메서드**

```typescript
class GameSocketManager {
  // 소켓 연결
  connect(
    userId: string,
    nickname: string,
    serverUrl: string,
    options: { roomId?; ticket? },
  );

  // 메시지 전송
  sendMessage(event: string, dataObject: any);

  // 연결 종료
  disconnect();

  // 소켓 인스턴스 반환
  getSocket(): Socket | null;
}
```

### 3. EventManager

**위치**: `src/shared/managers/EventManager.ts`

**책임**

- 이벤트 리스너 관리
- 소켓 이벤트와 React 컴포넌트 연결
- 이벤트 발행/구독 패턴

**주요 메서드**

```typescript
class EventManager {
  // 이벤트 발행
  emit(event: string, data: any);

  // 이벤트 구독
  on(event: string, handler: Function);

  // 일회성 이벤트 구독
  once(event: string, handler: Function);

  // 이벤트 구독 해제
  off(event: string, handler: Function);
}
```

### 4. 핵심 Hook들

#### useMultiMode

```typescript
// 멀티플레이 시작 로직
const handleMultiMode = async () => {
  // 1. 티켓 발급
  const response = await getGameTicket();

  // 2. 게임 서버 연결
  if (response.success) {
    connectGameServer(response.gameServerUrl, response.ticket);
  }
};
```

#### useGetGameTicket

```typescript
// API 서버로 티켓 요청
const getGameTicket = async () => {
  const response = await useJoinRoom();

  // sessionStorage에 저장
  sessionStorage.setItem("gameServerUrl", gameServerUrl);
  sessionStorage.setItem("gameTicket", ticket);

  return { success, gameServerUrl, ticket };
};
```

#### useConnectGameServer

```typescript
// 게임 서버에 소켓 연결
const connectGameServer = (gameServerUrl: string, ticket: string) => {
  // 소켓 연결
  gameSocketManager.connect(userId, nickname, "/", { ticket });

  // ROOM_ASSIGNED 이벤트 대기
  eventManager.once("ROOM_ASSIGNED", (data) => {
    sessionStorage.setItem("roomId", data.roomId);
    navigate(`/game/${data.roomId}`, { state: { mode: "multi" } });
  });
};
```

#### useGameSocketConnection

```typescript
// 게임 페이지에서 소켓 이벤트 구독
useEffect(() => {
  // 이벤트 리스너 등록
  eventManager.on("MOVE", handleMove);
  eventManager.on("PLAYING", handlePlaying);
  eventManager.on("GAME_OVER", handleGameOver);
  eventManager.on("CHAT", handleChat);

  return () => {
    // 클린업: 이벤트 리스너 제거
    eventManager.off("MOVE", handleMove);
    eventManager.off("PLAYING", handlePlaying);
    eventManager.off("GAME_OVER", handleGameOver);
    eventManager.off("CHAT", handleChat);
  };
}, []);
```

#### useSendLeave

**위치**: `src/features/game/hooks/useSendLeave.ts`

멀티플레이 방에서 나갈 때 서버에 LEAVE 이벤트를 전송하는 훅입니다.

```typescript
/**
 * 게임 방 나가기를 서버에 알리는 훅
 *
 * 서버 이벤트:
 * - LEAVE_SUCCESS: 본인의 나가기 성공
 * - PLAYER_LEFT: 다른 플레이어들에게 전달되는 플레이어 퇴장 알림
 */
export function useSendLeave() {
  const sendLeave = useCallback(() => {
    const { roomId, userId, nickname } = getSessionInfo();

    // LEAVE 이벤트 발송
    gameSocketManager.sendMessage("LEAVE", {
      type: "LEAVE",
      message: [roomId, userId],
      sender: nickname,
    });

    // LEAVE_SUCCESS 이벤트 수신 처리 (본인의 나가기 성공)
    const handleLeaveSuccess = (data: { success: boolean }) => {
      console.log("[leave] 방 나가기 성공:", data);
      eventManager.emit("LEAVE_SUCCESS", data);
    };

    // PLAYER_LEFT 이벤트 수신 처리 (다른 플레이어 퇴장 알림)
    const handlePlayerLeft = (data: {
      userId: string;
      nickname: string;
      roomId: string;
    }) => {
      console.log("[leave] 플레이어 퇴장:", data);
      eventManager.emit("PLAYER_LEFT", data);
    };

    // 이벤트 리스너 등록
    eventManager.once("LEAVE_SUCCESS", handleLeaveSuccess);
    eventManager.on("PLAYER_LEFT", handlePlayerLeft);

    return () => {
      eventManager.off("PLAYER_LEFT", handlePlayerLeft);
    };
  }, []);

  return { sendLeave };
}
```

**사용 예시** (GameRoomPage.tsx):

```typescript
const { sendLeave } = useSendLeave();

const handleExit = () => {
  if (mode !== "single") {
    // 멀티플레이: LEAVE 이벤트 발송
    sendLeave();
    // LEAVE_SUCCESS 이벤트를 기다리므로 여기서 navigate하지 않음
    return;
  }
  // 싱글플레이: 바로 로비로 이동
  navigate("/lobby");
};
```

**서버 응답**:

| 이벤트          | 발신자                      | 설명                    |
| --------------- | --------------------------- | ----------------------- |
| `LEAVE_SUCCESS` | Game Server → Client        | 본인의 나가기 성공      |
| `PLAYER_LEFT`   | Game Server → Other Clients | 다른 플레이어 퇴장 알림 |

```javascript
// LEAVE_SUCCESS 이벤트
{
  success: true
}

// PLAYER_LEFT 이벤트 (다른 플레이어들이 수신)
{
  userId: "user123",
  nickname: "Player1",
  roomId: "room_abc123"
}
```

#### useSendReady

**위치**: `src/features/game/hooks/useSendReady.ts`

준비 상태를 서버에 전송하는 훅입니다. Ready 페이지에서 준비 버튼을 눌렀을 때 호출됩니다.

```typescript
/**
 * Ready 상태를 서버에 전송하는 훅
 *
 * 서버 이벤트:
 * - PLAYER_READY: 모든 플레이어에게 준비 상태 변경 알림
 */
export function useSendReady() {
  const sendReady = useCallback((isReady: boolean) => {
    const { roomId, userId, nickname } = getSessionInfo();

    // READY 이벤트 발송
    gameSocketManager.sendMessage("READY", {
      type: "READY",
      message: [roomId, userId, isReady],
      sender: nickname,
      isReady,
    });

    // PLAYER_READY 이벤트 수신 처리 (모든 플레이어가 수신)
    const handlePlayerReady = (data: {
      userId: string;
      nickname: string;
      isReady: boolean;
      roomId: string;
    }) => {
      console.log(
        `[ready] ${data.nickname}님이 ${data.isReady ? "준비완료" : "준비취소"}`,
      );
      eventManager.emit("PLAYER_READY", data);
    };

    eventManager.on("PLAYER_READY", handlePlayerReady);

    return () => {
      eventManager.off("PLAYER_READY", handlePlayerReady);
    };
  }, []);

  return { sendReady };
}
```

**사용 예시** (GameRoomPage.tsx):

```typescript
const { sendReady } = useSendReady();

const handleReady = () => {
  if (mode === "single") {
    // 싱글플레이: 로컬 상태 업데이트
    setPhase("playing");
  } else {
    // 멀티플레이: READY 이벤트 발송
    sendReady(true);
  }
};
```

**서버 응답**:

| 이벤트         | 발신자                    | 설명                                  |
| -------------- | ------------------------- | ------------------------------------- |
| `PLAYER_READY` | Game Server → All Clients | 모든 플레이어에게 준비 상태 변경 알림 |

```javascript
// PLAYER_READY 이벤트 (모든 플레이어가 수신)
{
  userId: "user123",
  nickname: "Player1",
  isReady: true,
  roomId: "room_abc123"
}
```

#### 5. GameRoomPage (게임 페이지 이벤트 처리)

**위치**: `src/pages/GameRoomPage.tsx`

게임 페이지는 멀티플레이의 모든 이벤트를 중앙에서 관리합니다. 여러 `useEffect`로 각 이벤트를 처리합니다.

**1. EXISTING_PLAYERS 이벤트 처리 (새 플레이어가 방에 들어올 때)**

```typescript
useEffect(() => {
  if (mode !== "multi") return;

  const handleExistingPlayers = (data: {
    players: Array<{
      connId: string; // userId
      nickname: string;
      isReady: boolean;
      avatar: string; // 서버에서 제공
      imageSrc?: string; // 서버에서 제공 (선택사항)
    }>;
    roomId: string;
  }) => {
    // 기존 플레이어들의 정보를 playersInfos에 추가
    const existingPlayers = data.players.map((player) => ({
      nickname: player.nickname,
      avatar: player.avatar,
      imageSrc: player.imageSrc || "",
    }));
    setPlayersInfos((prev) => [...prev, ...existingPlayers]);

    // 기존 플레이어들의 준비 상태 저장
    const readyStatus: Record<string, boolean> = {};
    data.players.forEach((player) => {
      readyStatus[player.connId] = player.isReady;
    });
    setPlayersReadyStatus(readyStatus);
  };

  eventManager.on("EXISTING_PLAYERS", handleExistingPlayers);
  return () => {
    eventManager.off("EXISTING_PLAYERS", handleExistingPlayers);
  };
}, [mode, setPlayersInfos]);
```

**2. PLAYER_JOINED 이벤트 처리 (새 플레이어가 방에 들어옴)**

```typescript
useEffect(() => {
  if (mode !== "multi") return;

  const handlePlayerJoined = (data: {
    player: {
      userId: string;
      nickname: string;
      isReady: boolean;
      avatar: string; // 서버에서 제공
      imageSrc?: string; // 서버에서 제공 (선택사항)
    };
    roomId: string;
  }) => {
    toast.info(`${data.player.nickname}님이 들어왔습니다!`);

    // 새 플레이어 정보를 playersInfos에 추가
    setPlayersInfos((prev) => [
      ...prev,
      {
        nickname: data.player.nickname,
        avatar: data.player.avatar,
        imageSrc: data.player.imageSrc || "",
      },
    ]);

    // 새 플레이어의 준비 상태 저장
    setPlayersReadyStatus((prev) => ({
      ...prev,
      [data.player.userId]: data.player.isReady,
    }));
  };

  eventManager.on("PLAYER_JOINED", handlePlayerJoined);
  return () => {
    eventManager.off("PLAYER_JOINED", handlePlayerJoined);
  };
}, [mode, setPlayersInfos]);
```

**3. PLAYER_READY 이벤트 처리 (플레이어 준비 상태 변경)**

```typescript
useEffect(() => {
  if (mode !== "multi") return;

  const handlePlayerReady = (data: {
    userId: string;
    nickname: string;
    isReady: boolean;
    roomId: string;
  }) => {
    // 준비 상태 업데이트
    setPlayersReadyStatus((prev) => ({
      ...prev,
      [data.userId]: data.isReady,
    }));
  };

  eventManager.on("PLAYER_READY", handlePlayerReady);
  return () => {
    eventManager.off("PLAYER_READY", handlePlayerReady);
  };
}, [mode]);
```

**4. PLAYER_LEFT 이벤트 처리 (플레이어 퇴장)**

```typescript
useEffect(() => {
  if (mode !== "multi") return;

  const handlePlayerLeft = (data: {
    userId: string;
    nickname: string;
    roomId: string;
  }) => {
    toast.warning(`${data.nickname}님이 게임을 나갔습니다.`);

    // 상대 플레이어 정보 제거
    setPlayersInfos((prev) => prev.filter((p) => p.nickname !== data.nickname));

    // 준비 상태 제거
    setPlayersReadyStatus((prev) => {
      const next = { ...prev };
      delete next[data.userId];
      return next;
    });

    // 게임 중이면 로비로 돌아가기
    if (phase === "playing") {
      setTimeout(() => {
        toast.info("게임이 중단되었습니다.");
        localStorage.removeItem("singleGameState");
        navigate("/lobby");
      }, 1500);
    }
  };

  eventManager.on("PLAYER_LEFT", handlePlayerLeft);
  return () => {
    eventManager.off("PLAYER_LEFT", handlePlayerLeft);
  };
}, [mode, phase, setPlayersInfos, navigate]);
```

**5. LEAVE_SUCCESS 이벤트 처리 (본인 퇴장 성공)**

```typescript
useEffect(() => {
  const handleLeaveSuccess = (data: { success: boolean }) => {
    if (data.success) {
      localStorage.removeItem("singleGameState");
      navigate("/lobby");
    }
  };

  eventManager.once("LEAVE_SUCCESS", handleLeaveSuccess);
  return () => {
    // cleanup
  };
}, [navigate]);
```

**GameRoomPage 플로우**:

```
들어온다
  ↓
ROOM_ASSIGNED 수신
  ↓
GameRoomPage로 라우팅
  ↓
EXISTING_PLAYERS 수신 (정보 저장)
  ↓
기존 플레이어들은 PLAYER_JOINED 수신
  ↓
Ready 페이지 표시
  ↓
[준비 버튼 클릭] → READY 이벤트 발송 → PLAYER_READY 브로드캐스트
  ↓
양쪽 모두 준비 → PLAYING 이벤트 → 게임 시작
  ↓
게임 진행 (MOVE 이벤트)
  ↓
누군가 [나가기] → LEAVE 이벤트 → LEAVE_SUCCESS + 상대방에게 PLAYER_LEFT
```

---

**Ready 페이지 통합** (Ready.tsx):

```typescript
export default function Ready({
  onReady,
  onExit,
  playersInfos,
  playersReadyStatus = {}, // 플레이어 준비 상태
  mode = "single",
}: SingleReadyProps) {
  const [isReady, setIsReady] = useState(false);

  const handleReadyClick = () => {
    if (!isReady) {
      onReady(); // useSendReady().sendReady(true) 호출
    }
    setIsReady((prev) => !prev);
  };

  // 멀티플레이: 준비 상태 표시
  const getPlayerReadyStatus = (nickname: string) => {
    if (nickname === playersInfos[0]?.nickname) {
      return isReady ? "🎯 준비완료" : "";
    } else {
      return Object.values(playersReadyStatus).some((ready) => ready)
        ? "🎯 준비완료"
        : "";
    }
  };

  return (
    <section className="flex flex-col items-center justify-center min-h-screen gap-8 p-8">
      <VersusBanner playersInfos={playersInfos} />

      {/* 멀티플레이: 플레이어 준비 상태 표시 */}
      {mode === "multi" && (
        <div className="flex gap-16 items-center justify-center mb-4">
          {playersInfos.map((player) => (
            <div key={player.nickname} className="flex flex-col items-center gap-2">
              <img src={player.imageSrc} alt={player.nickname} />
              <p className="font-bold">{player.nickname}</p>
              <p className="text-sm font-bold text-green-600">
                {getPlayerReadyStatus(player.nickname)}
              </p>
            </div>
          ))}
        </div>
      )}

      <div className="flex flex-col gap-4">
        <button onClick={() => handleReadyClick()}>
          {isReady ? "취소" : "준비"}
        </button>
        <button onClick={() => onExit()}>나가기</button>
      </div>

      {/* 멀티플레이: 대기 메시지 */}
      {mode === "multi" && playersInfos.length < 2 && (
        <p>상대방을 기다리는 중입니다...</p>
      )}

      {/* 멀티플레이: 양쪽 모두 준비 완료 시 메시지 */}
      {mode === "multi" && allPlayersReady && (
        <p>✨ 게임 시작 준비 완료! ✨</p>
      )}
    </section>
  );
}
```

---

## 시퀀스 다이어그램

### 멀티플레이 전체 플로우

```
┌────────┐     ┌──────────┐     ┌────────────┐     ┌─────────────┐     ┌─────────┐
│ User   │     │ Client   │     │ API Server │     │ Game Server │     │ Browser │
└───┬────┘     └────┬─────┘     └─────┬──────┘     └──────┬──────┘     └────┬────┘
    │               │                  │                   │                 │
    │ 1. "멀티플레이" 클릭                │                   │                 │
    │──────────────▶│                  │                   │                 │
    │               │                  │                   │                 │
    │               │ 2. POST /api/ticket                  │                 │
    │               │─────────────────▶│                   │                 │
    │               │                  │                   │                 │
    │               │                  │ 3. 티켓 생성       │                 │
    │               │                  │    (JWT)          │                 │
    │               │                  │                   │                 │
    │               │ 4. { ticket, gameServerUrl }         │                 │
    │               │◀─────────────────│                   │                 │
    │               │                  │                   │                 │
    │               │ 5. sessionStorage 저장               │                 │
    │               │─────────────────────────────────────────────────────▶│
    │               │                  │                   │                 │
    │               │ 6. Socket.io connect (auth: { userId, ticket })       │
    │               │──────────────────────────────────────▶│                 │
    │               │                  │                   │                 │
    │               │                  │                   │ 7. 티켓 검증    │
    │               │                  │                   │    JWT verify   │
    │               │                  │                   │                 │
    │               │                  │                   │ 8. 방 배정      │
    │               │                  │                   │    (매칭 로직)  │
    │               │                  │                   │                 │
    │               │ 9. ROOM_ASSIGNED { roomId }          │                 │
    │               │◀──────────────────────────────────────│                 │
    │               │                  │                   │                 │
    │               │ 10. sessionStorage.setItem("roomId") │                 │
    │               │─────────────────────────────────────────────────────▶│
    │               │                  │                   │                 │
    │               │ 11. navigate(`/game/${roomId}`)      │                 │
    │               │─────────────────────────────────────────────────────▶│
    │               │                  │                   │                 │
    │ 12. 게임 화면 표시                │                   │                 │
    │◀──────────────│                  │                   │                 │
    │               │                  │                   │                 │
    │               │ 13. JOIN 이벤트 전송                  │                 │
    │               │──────────────────────────────────────▶│                 │
    │               │                  │                   │                 │
    │               │ 14. 상대방 입장 대기...              │                 │
    │               │                  │                   │                 │
```

### 게임 진행 플로우

```
┌─────────────┐                    ┌─────────────┐
│  Player 1   │                    │  Player 2   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ READY 전송                       │
       │─────────────────▶ Game Server   │
       │                        │         │
       │                        │         │ READY 전송
       │                        │ ◀───────│
       │                        │         │
       │                  양쪽 모두 준비   │
       │                  PLAYING 브로드캐스트
       │                        │         │
       │ PLAYING 수신           │         │ PLAYING 수신
       │◀───────────────────────│─────────▶
       │                        │         │
       │ (Player 1 차례)        │         │
       │ MOVE 전송              │         │
       │─────────────────▶      │         │
       │                   보드 업데이트   │
       │                   유효성 검증     │
       │                        │         │
       │ MOVE 브로드캐스트       │         │
       │◀───────────────────────│─────────▶
       │                        │         │
       │                        │  (Player 2 차례)
       │                        │         │ MOVE 전송
       │                        │ ◀───────│
       │                        │         │
       │                   승리 조건 확인  │
       │                   GAME_OVER 발행 │
       │                        │         │
       │ GAME_OVER 수신         │         │ GAME_OVER 수신
       │◀───────────────────────│─────────▶
       │                        │         │
```

### 플레이어 입장 플로우

```
┌─────────────┐                    ┌──────────────┐
│  Player 1   │                    │   Player 2   │
│  (기존)     │                    │   (새로 들어옴)
└──────┬──────┘                    └──────┬───────┘
       │                                  │
       │                                  │ ROOM_ASSIGNED 수신
       │                                  │ roomId 저장
       │                                  │
       │                                  │ /game/{roomId} 라우팅
       │ 게임서버에서 EXISTING_PLAYERS   │
       │ 전송 (Player 2에게만)           │
       │                                  │◀──────────────┐
       │                                  │                │
       │                          기존 플레이어 정보 저장   │
       │                          playersInfos에 추가    │
       │                                  │                │
       │ PLAYER_JOINED 브로드캐스트      │                │
       │ (Player 1에게 Player 2 정보)   │                │
       │◀──────────────────────────────────                │
       │                                  │                │
       │ (UI 업데이트:                      │                │
       │  "Player 2님이 들어왔습니다!")    │                │
       │                                  │                │
       │ playersInfos에 Player 2 추가     │                │
       │                                  │                │
```

### Ready 페이지 플로우

```
┌─────────────┐                    ┌─────────────┐
│  Player 1   │                    │  Player 2   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ ["준비" 버튼 클릭]               │
       │ READY({ isReady: true })         │
       │─────────────────▶ Game Server   │
       │                        │         │
       │                        │ PLAYER_READY 브로드캐스트
       │                        │ (모든 플레이어에게)
       │                        │         │
       │ PLAYER_READY 수신      │         │
       │◀───────────────────────│─────────▶
       │                        │         │
       │ (UI 업데이트:              │         │
       │  "🎯 준비완료" 표시)      │         │
       │                        │         │
       │                        │         │ ["준비" 버튼 클릭]
       │                        │         │ READY({ isReady: true })
       │                        │ ◀───────│
       │                        │         │
       │                        │ PLAYER_READY 브로드캐스트
       │                        │         │
       │ PLAYER_READY 수신      │         │
       │◀───────────────────────│─────────▶
       │                        │         │ PLAYER_READY 수신
       │                        │         │◀───────────────┐
       │                        │         │                │
       │  [양쪽 모두 준비 완료]   │         │                │
       │  PLAYING 브로드캐스트   │         │                │
       │  게임 시작              │         │ 게임 시작      │
       │                        │         │                │
```

### Leave 플로우 (Ready 페이지)

```
┌─────────────┐                    ┌─────────────┐
│  Player 1   │                    │  Player 2   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ ["나가기" 버튼 클릭]             │
       │ LEAVE()                          │
       │─────────────────▶ Game Server   │
       │                        │         │
       │                        │         │
       │                  방에서 제거     │
       │                        │         │
       │ LEAVE_SUCCESS 수신     │         │
       │◀──────────────────     │         │
       │ (localStorage 정리)     │         │
       │ navigate("/lobby")      │         │
       │─────────────────────────────────▶│
       │                        │         │
       │                        │ PLAYER_LEFT 브로드캐스트
       │                        │         │
       │                        │         │ PLAYER_LEFT 수신
       │                        │         │◀───────────────┐
       │                        │         │                │
       │                        │         │ (toast 표시)   │
       │                        │         │ (UI 업데이트)  │
       │                        │         │                │
```

### Leave 플로우 (게임 중)

```
┌─────────────┐                    ┌─────────────┐
│  Player 1   │                    │  Player 2   │
└──────┬──────┘                    └──────┬──────┘
       │                                  │
       │ [뒤로가기 또는 ExitModal]        │
       │ "나가기" 버튼 클릭               │
       │ LEAVE()                          │
       │─────────────────▶ Game Server   │
       │                        │         │
       │                  방에서 제거     │
       │                        │         │
       │ LEAVE_SUCCESS 수신     │         │
       │◀──────────────────     │         │
       │ (localStorage 정리)     │         │
       │ navigate("/lobby")      │         │
       │─────────────────────────────────▶│
       │                        │         │
       │                        │ PLAYER_LEFT 브로드캐스트
       │                        │         │
       │                        │         │ PLAYER_LEFT 수신
       │                        │         │◀───────────────┐
       │                        │         │                │
       │                        │         │ (toast 표시:   │
       │                        │         │  상대방이 나감) │
       │                        │         │                │
       │                        │         │ 1.5초 후:      │
       │                        │         │                │
       │                        │         │ navigate("/lobby")
       │                        │         │─────────────────▶
       │                        │         │                │
```

---

## 상태 관리

### SessionStorage 저장 항목

| 키              | 값             | 저장 시점        | 사용처            |
| --------------- | -------------- | ---------------- | ----------------- |
| `userId`        | 사용자 ID      | 사용자 생성 시   | 모든 서버 통신    |
| `nickname`      | 닉네임         | 사용자 생성 시   | 게임 표시, 채팅   |
| `avatar`        | 아바타 이미지  | 사용자 생성 시   | 플레이어 표시     |
| `gameServerUrl` | 게임 서버 주소 | 티켓 발급 후     | 소켓 연결         |
| `gameTicket`    | 인증 티켓      | 티켓 발급 후     | 소켓 인증         |
| `roomId`        | 방 ID          | ROOM_ASSIGNED 후 | 게임 진행, 이벤트 |

### React State

```typescript
// 게임 상태 (useGameState)
interface GameState {
  board: (string | null)[]; // 보드 상태
  currentPlayer: string | null; // 현재 플레이어
  winner: string | null; // 승자
  isDraw: boolean; // 무승부 여부
  isGameOver: boolean; // 게임 종료 여부
}

// 방 상태 (useRoomState)
interface RoomState {
  players: Player[]; // 플레이어 목록
  ready: Record<string, boolean>; // 준비 상태
  allReady: boolean; // 모두 준비 완료
}

// 채팅 상태
interface ChatState {
  messages: ChatMessage[]; // 채팅 메시지 목록
}
```

---

## 에러 처리

### 1. 티켓 발급 실패

```typescript
// API 서버 응답 실패
if (!response.success) {
  toast.error("❌ 입장 실패.");
  // UI에 에러 표시
}
```

**원인**

- API 서버 다운
- 네트워크 오류
- 서버 과부하

### 2. 소켓 연결 실패

```typescript
socket.on("connect_error", (error) => {
  console.error("[socket] connect_error:", error.message);
  // 재연결 시도 (자동)
});
```

**원인**

- 잘못된 티켓
- 만료된 티켓
- 게임 서버 다운
- 방화벽/프록시 문제

### 3. 티켓 검증 실패

```typescript
// 서버에서 연결 거부
socket.on("disconnect", (reason) => {
  if (reason === "io server disconnect") {
    // 서버가 강제로 연결 종료 (티켓 문제)
    toast.error("인증 실패. 다시 시도해주세요.");
    navigate("/lobby");
  }
});
```

### 4. 재연결 처리

```typescript
// Socket.io 자동 재연결 설정
this.socket = io(serverUrl, {
  reconnection: true,
  reconnectionDelay: 1000, // 첫 재연결 딜레이 1초
  reconnectionDelayMax: 5000, // 최대 딜레이 5초
  reconnectionAttempts: 5, // 최대 5번 시도
});

// 재연결 성공
socket.on("reconnect", (attemptNumber) => {
  console.log("재연결 성공:", attemptNumber);
  // 상태 복구 로직
});

// 재연결 실패
socket.on("reconnect_failed", () => {
  toast.error("서버 연결 실패. 로비로 돌아갑니다.");
  navigate("/lobby");
});
```

---

## 보안 고려사항

### 1. 티켓 유효성

- ✅ **짧은 만료 시간**: 티켓은 10분 후 만료 (재사용 방지)
- ✅ **일회성**: 한 번 사용하면 무효화
- ✅ **JWT 서명**: 변조 방지

### 2. 서버 측 검증

게임 서버가 반드시 검증해야 할 사항:

- ✅ 티켓 서명 검증
- ✅ 티켓 만료 시간 확인
- ✅ 티켓 내 userId와 요청 userId 일치 확인
- ✅ 이미 사용된 티켓인지 확인
- ✅ 게임 로직 서버 측 검증 (클라이언트 신뢰 금지)

### 3. 민감 정보 보호

- ❌ 클라이언트는 게임 로직을 검증하지 않음
- ✅ 모든 MOVE 이벤트는 서버에서 유효성 검증
- ✅ 승리 조건은 서버에서만 판단
- ✅ SessionStorage 사용 (XSS 취약성 주의)

---

## 성능 최적화

### 1. 연결 재사용

```typescript
// 이미 연결된 소켓은 재사용
if (this.socket && this.socket.connected) {
  return;
}
```

### 2. 이벤트 디바운싱

```typescript
// 채팅 메시지 전송 시 디바운스
const sendChat = debounce((message) => {
  gameSocketManager.sendMessage("CHAT", { message });
}, 300);
```

### 3. 불필요한 렌더링 방지

```typescript
// React.memo로 컴포넌트 최적화
export default React.memo(Board);

// useMemo로 계산 캐싱
const winningLine = useMemo(() => {
  return calculateWinner(board);
}, [board]);
```

### 4. 이벤트 리스너 정리

```typescript
// 컴포넌트 언마운트 시 이벤트 리스너 제거
useEffect(() => {
  eventManager.on("MOVE", handleMove);

  return () => {
    eventManager.off("MOVE", handleMove);
  };
}, [handleMove]);
```

---

## 디버깅 팁

### 1. 콘솔 로그

이벤트에 로그 플래그 설정:

```typescript
export const GAME_EVENTS = [
  { name: "MOVE", handler: "handleMove", log: true }, // 로그 활성화
  { name: "CHAT", handler: "handleChat", log: false }, // 로그 비활성화
];
```

### 2. Socket.io 디버그 모드

```typescript
localStorage.setItem("debug", "socket.io-client:socket");
```

### 3. SessionStorage 확인

개발자 도구 > Application > Session Storage에서 확인:

- `gameServerUrl`
- `gameTicket`
- `roomId`
- `userId`

### 4. 네트워크 탭

개발자 도구 > Network > WS (WebSocket) 탭에서 소켓 통신 확인

---

## 확장 가능성

### 1. 다중 게임 서버

API 서버가 로드 밸런싱을 통해 여러 게임 서버 중 하나를 선택:

```typescript
function selectGameServer() {
  const servers = [
    "https://game1.example.com",
    "https://game2.example.com",
    "https://game3.example.com",
  ];

  // 로드가 가장 낮은 서버 선택
  return servers[Math.floor(Math.random() * servers.length)];
}
```

### 2. 매칭 시스템

- **랜덤 매칭**: 현재 구현 (대기 중인 방에 자동 배정)
- **랭크 매칭**: 레이팅 기반 매칭
- **친구 매칭**: 친구 초대 코드로 특정 방 입장

### 3. 관전 모드

```typescript
// 관전 전용 소켓 연결
gameSocketManager.connect(userId, nickname, "/", {
  ticket,
  role: "spectator",
  targetRoomId: roomId,
});
```

### 4. 재접속 처리

방 ID를 알고 있다면 재접속 가능:

```typescript
// 기존 roomId로 재접속
const roomId = sessionStorage.getItem("roomId");
if (roomId) {
  gameSocketManager.connect(userId, nickname, "/", { roomId, ticket });
}
```

---

## 참고 자료

### 관련 파일

- [MultiMode 컴포넌트](../src/features/lobby/components/MultiMode.tsx)
- [useMultiMode 훅](../src/features/lobby/hooks/useMultiMode.ts)
- [useGetGameTicket 훅](../src/features/lobby/hooks/useGetGameTicket.ts)
- [useConnectGameServer 훅](../src/features/lobby/hooks/useConnectGameServer.ts)
- [ApiManager](../src/shared/managers/ApiManager.ts)
- [SocketManager](../src/shared/managers/SocketManager.ts)
- [EventManager](../src/shared/managers/EventManager.ts)
- [이벤트 목록](../src/shared/constants/eventList.ts)

### 관련 문서

- [PROJECT_STRUCTURE.md](./PROJECT_STRUCTURE.md) - 프로젝트 전체 구조
- [GAMEMANAGER.md](./GAMEMANAGER.md) - 게임 매니저 상세
- [RECOVERY_MECHANISM.md](./RECOVERY_MECHANISM.md) - 복구 메커니즘

### 외부 라이브러리

- [Socket.io Client](https://socket.io/docs/v4/client-api/) - WebSocket 클라이언트
- [React Router](https://reactrouter.com/) - 라우팅
- [React Toastify](https://fkhadra.github.io/react-toastify/) - 토스트 알림

---

## 요약

1. **멀티플레이 버튼 클릭** → `useMultiMode` 훅 실행
2. **API 서버에 티켓 요청** → `POST /api/ticket`
3. **티켓 및 게임 서버 URL 수신** → SessionStorage에 저장
4. **게임 서버에 WebSocket 연결** → Socket.io with ticket auth
5. **티켓 검증 및 방 배정** → 서버에서 `ROOM_ASSIGNED` 이벤트 전송
6. **게임 페이지로 이동** → `/game/{roomId}`
7. **게임 진행** → Socket 이벤트로 실시간 동기화

이 아키텍처는 **보안**(티켓 기반 인증), **확장성**(서버 분리), **실시간성**(WebSocket)을 모두 만족하는 구조입니다.
