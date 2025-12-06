require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();

// ---------------------------
// ✅ ALLOWED ORIGINS (IMPORTANT)
// Add all your frontend URLs here
// ---------------------------
const allowedOrigins = [
  "http://localhost:8000",                           // local dev
  "http://localhost:5173",                           // vite dev
  "https://mern-chat-app-1-7w51.onrender.com",       // your deployed client
];

// ---------------------------
// ✅ CUSTOM CORS HANDLER
// Works for preflight + normal requests
// ---------------------------
app.use((req, res, next) => {
  const origin = req.header("Origin");

  if (origin && allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
    res.header("Access-Control-Allow-Credentials", "true");
  }

  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");

  if (req.method === "OPTIONS") {
    return res.sendStatus(204); // preflight handled here
  }

  next();
});

// ---------------------------
// Middleware
// ---------------------------
app.use(express.json());

// ---------------------------
// Routes
// ---------------------------
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// ---------------------------
// Default route
// ---------------------------
app.get("/", (req, res) => {
  res.send("Welcome to Chat App APIs...");
});

// ---------------------------
// Server + MongoDB
// ---------------------------
const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;

app.listen(port, () => {
  console.log(`Listening on port... : ${port}`);
});

mongoose
  .connect(uri)
  .then(() => console.log("MongoDB connection established"))
  .catch((error) => console.log("MongoDB connection failed: ", error.message));
