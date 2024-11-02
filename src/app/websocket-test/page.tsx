"use client";

import { useState, useEffect } from "react";
import { useWebSocket } from "@/contexts/WebSocketContext";

export default function WebSocketTest() {
  const { isConnected, sendMessage, socket } = useWebSocket();
  const [message, setMessage] = useState("");
  const [receivedMessages, setReceivedMessages] = useState<string[]>([]);

  useEffect(() => {
    if (socket) {
      socket.onmessage = (event) => {
        setReceivedMessages((prev) => [...prev, event.data]);
      };
    }
  }, [socket]);

  const handleSendMessage = () => {
    if (message.trim()) {
      sendMessage(message);
      setMessage("");
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">WebSocket Test Page</h1>

      <div className="mb-4">
        <div className="flex items-center gap-2">
          <div className={`w-3 h-3 rounded-full ${isConnected ? "bg-green-500" : "bg-red-500"}`} />
          <span>Status: {isConnected ? "Connected" : "Disconnected"}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            className="flex-1 px-4 py-2 border rounded"
            placeholder="Type a message..."
          />
          <button
            onClick={handleSendMessage}
            disabled={!isConnected}
            className="px-4 py-2 bg-blue-500 text-white rounded disabled:bg-gray-300"
          >
            Send
          </button>
        </div>
      </div>

      <div className="border rounded p-4">
        <h2 className="font-semibold mb-2">Received Messages:</h2>
        <div className="space-y-2">
          {receivedMessages.map((msg, index) => (
            <div
              key={index}
              className="p-2 bg-gray-100 rounded"
            >
              {msg}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
