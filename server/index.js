// server/index.js
require("dotenv").config();

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// FRONTEND URL you will set in Render (example: https://mern-chat-app-1-7w51.onrender.com)
const DEPLOYED_FRONTEND = process.env.FRONTEND_URL;

// allow localhost dev URLs plus deployed frontend (if provided)
const ALLOWED_ORIGINS = [
  "http://localhost:8000",
  "http://localhost:5173",
  DEPLOYED_FRONTEND // may be undefined — that's OK
].filter(Boolean); // remove falsy values

console.log("Allowed CORS origins:", ALLOWED_ORIGINS);

// configure CORS with dynamic origin check
const corsOptions = {
  origin: (origin, callback) => {
    // allow requests with no origin (eg mobile apps, curl, Postman)
    if (!origin) return callback(null, true);

    if (ALLOWED_ORIGINS.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error(`CORS policy: origin ${origin} not allowed`));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true,
};

// apply CORS middleware
app.use(cors(corsOptions));
// handle preflight across the board
app.options("*", cors(corsOptions));

app.use(express.json());

// routes
app.use("/api/users", userRoute);
app.use("/api/chats", chatRoute);
app.use("/api/messages", messageRoute);

// simple root
app.get("/", (req, res) => res.send("Welcome to Chat App APIs..."));

// start server and DB
app.listen(PORT, () => {
  console.log(`Listening on port... : ${PORT}`);
  // connect to mongo after server starts (optional)
  mongoose
    .connect(MONGO_URI)
    .then(() => console.log("MongoDB connection established"))
    .catch((err) =>
      console.log("MongoDB connection failed: ", err && err.message ? err.message : err)
    );
});
