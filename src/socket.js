import { io } from "socket.io-client";

// Create the socket once and export it
const socket = io("http://localhost:4000", {
  autoConnect: true, // Optional: automatically connects on import
  transports: ['websocket'], // Avoid long polling if preferred
});

export default socket;