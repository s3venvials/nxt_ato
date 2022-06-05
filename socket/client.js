import { io } from "socket.io-client";

class SocketConnect {
  constructor(IP, isConnected = false) {
    this.socket = io(IP, {
    //   autoConnect: false,
      withCredentials: true,
    });
    this.isConnected = isConnected;
  }

  Connect() {
    this.socket.connect();
    this.isConnected = true;
  }

  Debug() {
    this.socket.onAny((event, ...args) => {
      return { event, args };
    });
  }

  ConnectError() {
    this.socket.on("connect_error", (err) => {
      if (err)
        return "Oops, this is embarrassing, we are not able to process your request at this time. Please try again later.";
    });
  }

  Disconnect() {
    this.socket.disconnect();
    this.isConnected = false;
  }

  IsConnected() {
      return this.isConnected;
  }
}

export default new SocketConnect(`${process.env.NEXT_PUBLIC_API_URL}`);
