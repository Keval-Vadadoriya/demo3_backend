const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/Router");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const Chats = require("./models/Chats");
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
    });
    socket.to(obj[receiver]).emit("messag", message);
  });
  socket.on("delivered", () => {
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
