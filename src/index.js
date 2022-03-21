const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/Router");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const path = require("path");

const connection = require("./socket-controller/connection");

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
const port = process.env.port;
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(router);
//socket.io testings

// io.use(function (socket, next) {
//   var handshakeData = socket.request;
//   console.log("middleware:", handshakeData._query["foo"]);
//   next();
// });

io.on("connection", connection);

//listen
server.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
