import { io } from "socket.io-client";

// Create the socket once and export it
const socket = io("https://chess-6pk6.onrender.com", {
  autoConnect: true, // Optional: automatically connects on import
  transports: ['websocket'], // Avoid long polling if preferred
});

export default socket;