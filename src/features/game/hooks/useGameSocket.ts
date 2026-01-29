import { useEffect, useRef } from "react";
import io from "socket.io-client";
import { eventManager } from "@/shared/utils/EventManager.js";
import { GAME_EVENTS } from "@/shared/utils/eventList.js";

export function useGameSocket() {
  const socketRef = useRef(null);
  const connectedRef = useRef(false);

  useEffect(() => {
    const roomId = sessionStorage.getItem("roomId");
    const userId = sessionStorage.getItem("userId");
    const userNickname = sessionStorage.getItem("nickname");

    // 소켓 연결
    socketRef.current = io("/room", {
      path: "/ws/",
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      auth: {
        roomId: roomId,
        userId: userId,
      },
    });

    socketRef.current.on("connect", () => {
      if (connectedRef.current) return; // 중복 방지
      connectedRef.current = true;
      console.log("연결 성공 ID:", socketRef.current.id);
      socketRef.current.emit("JOIN", {
        type: "JOIN",
        message: [roomId, userId],
        sender: userNickname,
      });
    });

    socketRef.current.on("disconnect", () => {
      connectedRef.current = false;
    });

    // 메시지 핸들러 등록
    GAME_EVENTS.forEach(({ name, handler, log }) => {
      socketRef.current.on(name, (data) => {
        if (log) {
          console.log(`${name} 수신:`, JSON.stringify(data));
        }
        // 이벤트 버스로 보냄
        eventManager.emit(name, data);
      });
    });

    // 클린업
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  const sendMessage = (event, dataObject) => {
    if (!socketRef.current) return;
    console.log(`${event} 신호 서버로 보냄`);
    socketRef.current.emit(event, dataObject);
    if (event === "LEAVE") {
      socketRef.current.disconnect();
    }
  };

  const disconnect = () => {
    if (socketRef.current) {
      socketRef.current.disconnect();
    }
  };

  return {
    sendMessage,
    disconnect,
    socket: socketRef.current,
  };
}

// Sender 헬퍼
export function createSocketSender(sendMessage) {
  return {
    handleReady: (isReady) => {
      const roomId = sessionStorage.getItem("roomId");
      const userId = sessionStorage.getItem("userId");
      const userNickname = sessionStorage.getItem("nickname");

      sendMessage("READY", {
        type: "READY",
        message: [roomId, userId, isReady],
        sender: userNickname,
      });
    },

    handleLeave: () => {
      const roomId = sessionStorage.getItem("roomId");
      const userId = sessionStorage.getItem("userId");
      const userNickname = sessionStorage.getItem("nickname");

      sendMessage("LEAVE", {
        type: "LEAVE",
        message: [roomId, userId],
        sender: userNickname,
      });
    },

    handleMove: (x, y) => {
      const roomId = sessionStorage.getItem("roomId");
      const userId = sessionStorage.getItem("userId");
      const userNickname = sessionStorage.getItem("nickname");

      sendMessage("MOVE", {
        type: "MOVE",
        message: [roomId, userId, [x, y]],
        sender: userNickname,
      });
    },

    handleChat: (message) => {
      const roomId = sessionStorage.getItem("roomId");
      const userId = sessionStorage.getItem("userId");
      const userNickname = sessionStorage.getItem("nickname");

      sendMessage("CHAT", {
        type: "CHAT",
        message: message,
        sender: userNickname,
      });
    },
  };
}
