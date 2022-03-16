const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/Router");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const Chats = require("./models/Chats");

const mongoose = require("mongoose");
const io = socketIo(server, {
  cors: {
    origin: [
      `http://localhost:3000`,
      `http://localhost:3002`,
      `http://localhost:3003`,
    ],
    methods: ["GET", "POST"],
  },
});
const port = process.env.port || 3001;

app.use(cors());
app.use(express.json());
app.use(router);
//socket.io testings

// io.use(function (socket, next) {
//   var handshakeData = socket.request;
//   console.log("middleware:", handshakeData._query["foo"]);
//   next();
// });

const obj = {};
io.on("connection", (socket) => {
  let userId;
  console.log("New client connected", socket.id);

  socket.on("message", async (message, sender, receiver, role, callback) => {
    var _id = new mongoose.Types.ObjectId();
    console.log(_id);
    message._id = _id;
    message.status = "sent";
    let chat = await Chats.findOne({
      user: role === "user" ? sender : receiver,
      worker: role === "worker" ? sender : receiver,
    });
    if (!chat) {
      chat = new Chats({
        user: role === "user" ? sender : receiver,
        worker: role === "worker" ? sender : receiver,
      });
    }
    chat.chats.push(message);
    await chat.save();
    callback({
      status: "sent",
      message,
    });
    socket.to(obj[receiver]).emit("messag", message);
  });
  socket.on("delivered", async (_id, sender, receiver, role) => {
    let chat = await Chats.findOneAndUpdate(
      {
        user: role === "user" ? sender : receiver,
        worker: role === "worker" ? sender : receiver,
        "chats._id": _id,
      },
      { $set: { "chats.$[x].status": "delivered" } },
      { arrayFilters: [{ "x._id": _id }] }
    );
    console.log("hii");
    socket.to(obj[receiver]).emit("messageDelivered", _id);
    console.log("message delivered");
  });

  socket.on("setId", (id) => {
    userId = id;
    obj[id] = socket.id;
  });

  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete obj[userId];
  });
});

//listen
server.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
