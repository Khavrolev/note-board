import React from "react";
import io from "socket.io-client";

export const socket = io(
  `${process.env.REACT_APP_SERVER_HOST}:${process.env.REACT_APP_SERVER_PORT}`
);
export const SocketContext = React.createContext();
