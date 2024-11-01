"use client";
import React, { createContext, useContext, useEffect, useState } from "react";

type WebSocketContextType = {
  socket: WebSocket | null;
  lastMessage: any;
  isConnected: boolean;
};

const WebSocketContext = createContext<WebSocketContextType>({
  socket: null,
  lastMessage: null,
  isConnected: false,
});

export function WebSocketProvider({ children }: { children: React.ReactNode }) {
  const [socket, setSocket] = useState<WebSocket | null>(null);
  const [lastMessage, setLastMessage] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const ws = new WebSocket("ws://localhost:8787/socket");

    ws.onopen = () => {
      console.log("Connected to WebSocket");
      setIsConnected(true);
    };

    // ws.onmessage = (event) => {
    //   const message = JSON.parse(event.data);
    //   console.log("Message received:", message);
    //   setLastMessage(message);
    // };

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

  return <WebSocketContext.Provider value={{ socket, lastMessage, isConnected }}>{children}</WebSocketContext.Provider>;
}

export const useWebSocket = () => useContext(WebSocketContext);
