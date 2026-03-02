import io from "socket.io-client";

type Socket = any;

import { eventManager } from "@/shared/managers/EventManager";
import { GAME_EVENTS } from "@/shared/constants/eventList";

class GameSocketManager {
  private socket: Socket | null = null;
  private currentTicket: string | null = null;

  public connect(
    userId: string,
    nickname: string,
    serverUrl: string = "/room",
    options: { roomId?: string; ticket?: string } = {},
  ) {
    const { roomId, ticket } = options;

    console.log("[socket.connect] 호출 시작:", {
      userId,
      nickname,
      serverUrl,
      ticket,
    });

    // ticket이 다르면 기존 연결을 끊고 새로 연결
    if (this.socket && this.socket.connected) {
      if (ticket && this.currentTicket === ticket) {
        console.log("[socket.connect] 동일한 ticket으로 이미 연결됨, 재사용");
        return;
      } else {
        console.log(
          "[socket.connect] 다른 ticket 또는 새 연결 필요, 기존 소켓 정리",
        );
        this.socket.disconnect();
        this.socket = null;
      }
    }

    // 이미 소켓 인스턴스가 있다면 정리
    if (this.socket) {
      console.log("[socket.connect] 기존 socket 정리");
      this.socket.disconnect();
    }

    // 현재 ticket 저장
    this.currentTicket = ticket || null;

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
      console.log("[socket] 연결 성공, socket.id:", this.socket?.id);
      if (roomId) {
        console.log("[socket] JOIN 메시지 발송:", { roomId, userId, nickname });
        this.socket?.emit("JOIN", {
          type: "JOIN",
          message: [roomId, userId],
          sender: nickname,
        });
      }
    });

    this.socket.on("disconnect", () => {
      console.log("[socket] 연결 종료");
    });

    this.socket.on("connect_error", (error: any) => {
      console.error("[socket] connect_error:", error?.message || error);
    });

    // 메시지 핸들러 등록
    GAME_EVENTS.forEach(({ name, log }) => {
      this.socket?.on(name, (data: any) => {
        if (log) {
          console.log(`[socket] ${name} 수신:`, JSON.stringify(data));
        }
        eventManager.emit(name, data);
      });
    });
  }

  public sendMessage(event: string, dataObject: any) {
    console.log(
      `[socket.sendMessage] 호출: event=${event}, socket=${this.socket ? "존재" : "없음"}`,
    );

    if (!this.socket) {
      console.error(
        `[socket.sendMessage] socket이 없어서 메시지 전송 불가: ${event}`,
      );
      return;
    }

    console.log(`[socket.sendMessage] socket 상태:`, {
      connected: this.socket.connected,
      id: this.socket.id,
    });

    console.log(`[socket] ${event} 신호 서버로 보냄:`, dataObject);
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
      console.log("[socket.disconnect] 소켓 연결 종료");
      this.socket.disconnect();
      this.socket = null;
      this.currentTicket = null;
    }
  }

  public getSocket() {
    return this.socket;
  }
}

export const gameSocketManager = new GameSocketManager();
