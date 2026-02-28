import io from "socket.io-client";

type Socket = any;

import { eventManager } from "@/shared/managers/EventManager";
import { GAME_EVENTS } from "@/shared/constants/eventList";

class GameSocketManager {
  private socket: Socket | null = null;

  public connect(
    userId: string,
    nickname: string,
    serverUrl: string = "/room",
    options: { roomId?: string; ticket?: string } = {},
  ) {
    if (this.socket && this.socket.connected) return;

    // 이미 소켓 인스턴스가 있다면 정리
    if (this.socket) {
      this.socket.disconnect();
    }

    const { roomId, ticket } = options;

    console.log("[socket] connect request", {
      serverUrl,
      path: "/socket.io",
      auth: {
        roomId,
        userId,
        ticket,
      },
    });

    this.socket = io(serverUrl, {
      path: "/socket.io",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        roomId: roomId,
        userId: userId,
        ticket: ticket,
      },
    });

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

    this.socket.on("disconnect", () => {
      console.log("연결 종료");
    });

    this.socket.on("connect_error", (error: any) => {
      console.error("[socket] connect_error:", error?.message || error);
    });

    // 메시지 핸들러 등록
    GAME_EVENTS.forEach(({ name, log }) => {
      this.socket?.on(name, (data: any) => {
        if (log) {
          console.log(`${name} 수신:`, JSON.stringify(data));
        }
        eventManager.emit(name, data);
      });
    });
  }

  public sendMessage(event: string, dataObject: any) {
    if (!this.socket) return;
    console.log(`${event} 신호 서버로 보냄`);
    this.socket.emit(event, dataObject);
    if (event === "LEAVE") {
      this.disconnect();
    }
  }

  private getSessionInfo() {
    return {
      roomId: sessionStorage.getItem("roomId"),
      userId: sessionStorage.getItem("userId"),
      nickname: sessionStorage.getItem("nickname"),
    };
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  public getSocket() {
    return this.socket;
  }
}

export const gameSocketManager = new GameSocketManager();
