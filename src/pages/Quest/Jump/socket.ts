import { io, Socket } from "socket.io-client";

class SocketSingleton {
  private static instance: Socket;

  public static getInstance(token: string): Socket {
    if (!SocketSingleton.instance) {
      SocketSingleton.instance = io(`${import.meta.env.VITE_REQUEST_URL}`, {
        path: "/socket.io",
        auth: {
          token: `Bearer ${token}`,
        },
      });
    }
    return SocketSingleton.instance;
  }
}

export default SocketSingleton;
