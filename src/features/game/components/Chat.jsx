import { useState, useEffect, useRef } from "react";
import { eventManager } from "../../../shared/utils/EventManager";
import SpeechBalloon from "./SpeechBalloon";

export default function Chat({ sender }) {
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("Connecting to server...");
  const [chatLogs, setChatLogs] = useState([]);
  const inputRef = useRef(null);

  useEffect(() => {
    const updateChat = (data) => {
      const [type, messageText, senderName] = data;
      setChatLogs((prev) => [
        { type, message: messageText, sender: senderName, id: Date.now() },
        ...prev,
      ]);
    };

    eventManager.on("JOIN", updateChat);
    eventManager.on("LEAVE", updateChat);
    eventManager.on("CHAT", updateChat);
    eventManager.on("MOVE", updateChat);

    return () => {
      eventManager.off("JOIN", updateChat);
      eventManager.off("LEAVE", updateChat);
      eventManager.off("CHAT", updateChat);
      eventManager.off("MOVE", updateChat);
    };
  }, []);

  const handleMessage = () => {
    if (message.trim() === "") {
      inputRef.current?.focus();
      return;
    }
    eventManager.emit("CHAT", message);
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-white rounded-lg border-4 border-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] p-4">
      <div
        id="status"
        className="text-sm font-semibold text-gray-600 mb-3 text-center"
      >
        {status}
      </div>

      <ol
        id="log"
        className="flex-1 overflow-y-auto space-y-2 mb-3 pr-2 scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-100"
      >
        {chatLogs.map((log) => (
          <SpeechBalloon
            key={log.id}
            type={log.type}
            message={log.message}
            sender={log.sender}
          />
        ))}
      </ol>

      <div className="flex gap-2">
        <input
          ref={inputRef}
          id="message-input"
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder="메시지를 입력하세요"
          className="flex-1 px-4 py-2 border-2 border-black rounded-lg focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <button
          onClick={handleMessage}
          className="px-4 py-2 bg-accent border-2 border-black rounded-lg shadow-[3px_3px_0px_0px_rgba(0,0,0,1)] hover:shadow-none hover:translate-x-[3px] hover:translate-y-[3px] transition-all active:scale-95"
        >
          <span className="material-symbols-outlined">arrow_forward_ios</span>
        </button>
      </div>
    </div>
  );
}
