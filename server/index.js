// server/index.js
require('dotenv').config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();

// Basic required env vars
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || ""; // set this on Render to your deployed frontend URL

// --- CORS setup: allow both deployed frontend and common local dev origins ---
const allowedOrigins = [
  CLIENT_ORIGIN,            // deployed frontend origin (set this on Render)
  "http://localhost:8000",  // local dev (Vite/React) common port in your project
  "http://127.0.0.1:5173",  // Vite sometimes uses this
  "http://localhost:3000",  // other local dev variants (optional)
].filter(Boolean); // remove empty entries

const corsOptions = {
  origin: function (origin, callback) {
    // allow no-origin (curl, server-to-server, or same-origin requests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    } else {
      console.warn("Blocked CORS request from origin:", origin);
      return callback(new Error("CORS policy: Origin not allowed"), false);
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Origin", "X-Requested-With", "Content-Type", "Accept", "Authorization"],
};

// register middleware
app.use(express.json());

// Use CORS middleware with the dynamic options
app.use(cors(corsOptions));

// (Extra) explicitly handle preflight requests fast
app.options("*", cors(corsOptions));

// Optional - small middleware to add the Access-Control-Allow-Origin header for allowed origins
app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (!origin || allowedOrigins.includes(origin)) {
    // if origin allowed or no origin (server to server), echo it (or set to CLIENT_ORIGIN)
    res.header("Access-Control-Allow-Origin", origin || CLIENT_ORIGIN || "");
    res.header("Access-Control-Allow-Credentials", "true");
  }
  next();
});

// Register routes (same structure you already have)
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// Basic health route
app.get("/", (req, res) => {
  res.json({ status: "ok", message: "Chat App API running" });
});

// Generic error handler
app.use((err, req, res, next) => {
  console.error("Unhandled error:", err && err.message ? err.message : err);
  if (err && err.message && err.message.includes("CORS")) {
    return res.status(403).json({ error: "CORS error: origin not allowed" });
  }
  res.status(500).json({ error: "Internal server error" });
});

// Connect to MongoDB and start server
(async () => {
  try {
    if (!MONGO_URI) {
      console.error("MONGO_URI is not set. Set MONGO_URI in your environment.");
      process.exit(1);
    }

    // mongoose.connect now returns a promise; no deprecated options passed
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB connection established");

    app.listen(PORT, () => {
      console.log(`Listening on port... : ${PORT}`);
      console.log(`Allowed CORS origins: ${allowedOrigins.join(", ")}`);
    });

  } catch (err) {
    console.error("Failed to start server:", err && err.message ? err.message : err);
    process.exit(1);
  }
})();
