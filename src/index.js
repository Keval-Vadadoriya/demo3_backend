const express = require("express");
const cors = require("cors");
const app = express();
const workersRouter = require("./router/workers-router");
const router = require("./router/router");
const projectsRouter = require("./router/projects-router");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const path = require("path");

const connection = require("./controller/socket/connection");

const io = socketIo(server, {
  cors: {
    origin: JSON.parse(process.env.SOCKET_PERMISSIONS),
    methods: ["GET", "POST"],
  },
});
const port = process.env.PORT;
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
app.use(express.json());
app.use(router);
app.use(projectsRouter);
app.use(workersRouter);

//socket.io testings

// io.use(function (socket, next) {
//   var data = socket.request;
//   console.log("middleware:", data._query["abc"]);
//   next();
// });

io.on("connection", connection);

//listen
server.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
