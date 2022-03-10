const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/Router");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
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
//socket.io trestings

// io.use(function (socket, next) {
//   var handshakeData = socket.request;
//   console.log("middleware:", handshakeData._query["foo"]);
//   next();
// });
const obj = {};
io.on("connection", (socket) => {
  let userId;
  console.log("New client connected", socket.id);
  const response = new Date();
  socket.emit("FromAPI", response);
  socket.on("message", (message, id) => {
    console.log(message);
    socket.to(obj[id]).emit("messag", message);
  });

  socket.on("setId", (id, id2) => {
    console.log(id);
    userId = id;
    obj[id] = socket.id;
    console.log(obj);
    socket.to(obj[id2]).emit("messagesss", "hey there");

    // socket.broadcast.emit("messag", message);
  });
  socket.on("disconnect", () => {
    console.log("Client disconnected");
    delete obj[userId];
    console.log(userId);
    console.log(obj);
  });
});

//listen
server.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
