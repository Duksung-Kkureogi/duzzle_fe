import React, { createContext, useContext, ReactNode } from "react";
import { Socket } from "socket.io-client";
import SocketSingleton from "./socket";

interface WebSocketContextType {
  socket: Socket;
  token: string;
}

const WebSocketContext = createContext<WebSocketContextType | undefined>(
  undefined
);

interface WebSocketProviderProps {
  children: ReactNode;
  token: string;
}

export const WebSocketProvider: React.FC<WebSocketProviderProps> = ({
  children,
  token,
}) => {
  const socket = SocketSingleton.getInstance(token);

  return (
    <WebSocketContext.Provider value={{ socket, token }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = (): WebSocketContextType => {
  const context = useContext(WebSocketContext);
  if (context === undefined) {
    throw new Error("useWebSocket must be used within a WebSocketProvider");
  }
  return context;
};
