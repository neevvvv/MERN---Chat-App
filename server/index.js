require('dotenv').config();


const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRoute = require("./Routes/userRoute");
const chatRoute = require("./Routes/chatRoute");
const messageRoute = require("./Routes/messageRoute");
const app = express();
const CLIENT_ORIGIN = "http://localhost:8000";

// explicit CORS fallback (adds headers & handles preflight)
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", CLIENT_ORIGIN);
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.header("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
  res.header("Access-Control-Allow-Credentials", "true");
  if (req.method === "OPTIONS") {
    // preflight request – respond immediately
    return res.sendStatus(204);
  }
  next();
});


app.use(express.json());

app.use(cors({
  origin: CLIENT_ORIGIN,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  credentials: true
}));

// make sure preflight requests are handled
app.options("*", cors({
  origin: CLIENT_ORIGIN,
  credentials: true
}));

app.use("/api/users",userRoute);
app.use("/api/chats",chatRoute);
app.use("/api/messages",messageRoute);

const port = process.env.PORT || 8080;
const uri = process.env.MONGO_URI;

app.get("/", (req, res) => {
    res.send("Welcome to Chat App APIs...");
})

app.listen(port, (req, res) => {
    console.log(`Listening on port... : ${port}`);
})

mongoose.connect(uri,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
}).then(() => console.log("MongoDB connection established")).catch((error) => console.log("MongoDB connection failed: ",error.message))