"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type WebSocketContextType = {
  socket: WebSocket | null;
  lastMessage: any;
  isConnected: boolean;
  sendMessage: (message: string) => void;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lastMessage: null,
  isConnected: false,
  sendMessage: () => {},
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Determine the WebSocket URL based on environment
    const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsHost = process.env.NEXT_PUBLIC_WS_URL || window.location.host;
    const wsUrl = `${wsProtocol}//${wsHost}/socket`;

    const ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data);
      console.log("Message received:", message);
      setLastMessage(message);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onclose = () => {
      console.log("Disconnected from WebSocket");
      setIsConnected(false);
    };

    setSocket(ws);

    return () => {
      ws.close();
    };
  }, []);

  const sendMessage = (message: string) => {
    if (socket && isConnected) {
      socket.send(message);
    }
  };

  return (
    <WebSocketContext.Provider value={{ socket, isConnected, sendMessage, lastMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
}

export const useWebSocket = () => useContext(WebSocketContext);
