require("dotenv").config();
const { Server } = require("socket.io");

let onlineUsers = [];

const CLIENT_ORIGIN = process.env.CLIENT_URI || "http://localhost:5173";
const PORT = process.env.PORT || 6000;

// Proper cors option object
const io = new Server({
  cors: {
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"]
  }
});

io.on("connection", (socket) => {
  console.log("New socket connection:", socket.id);

  // listen to a connection
  socket.on("addNewUser", (userId) => {
    // fix: return value needed in arrow predicate
    const exists = onlineUsers.some((user) => user.userId === userId);
    if (!exists) {
      onlineUsers.push({ userId, socketId: socket.id });
    }
    console.log("onlineUsers", onlineUsers);
    io.emit("getOnlineUsers", onlineUsers);
  });

  // listen to message
  socket.on("sendMessage", (message) => {
    const user = onlineUsers.find((user) => user.userId === message.recipientId);
    if (user) {
      io.to(user.socketId).emit("getMessage", message);
      io.to(user.socketId).emit("getNotification", {
        senderId: message.senderId,
        isRead: false,
        date: new Date()
      });
    }
  });

  // listen to a disconnection
  socket.on("disconnect", () => {
    onlineUsers = onlineUsers.filter((user) => user.socketId !== socket.id);
    io.emit("getOnlineUsers", onlineUsers);
  });
});

io.listen(PORT);
console.log(`Socket server listening on port ${PORT} (CORS origin: ${CLIENT_ORIGIN})`);
