const express = require("express");
const cors = require("cors");
const app = express();
const router = require("./router/Router");
const http = require("http");
const server = http.createServer(app);
const socketIo = require("socket.io");
const Chats = require("./models/Chats");
const mongoose = require("mongoose");
const path = require("path");

const WorkerChatList = require("./models/WorkerChatList");
const UserChatList = require("./models/UserChatList");

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

app.use("/uploads", express.static(path.join(__dirname, "../uploads")));
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
  console.log("connected", socket.id);
  let userId;
  socket.on("setId", (id) => {
    userId = id;
    obj[id] = socket.id;
  });

  //getchats
  socket.on("getchats", async (userId, role, receiverId, callback) => {
    let chats;
    console.log("sfsd");
    chats = await Chats.findOne({
      user: role === "user" ? userId : receiverId,
      worker: role === "user" ? receiverId : userId,
    })
      .populate({ path: "user", select: { name: 1, _id: 0 } })
      .populate({ path: "worker", select: { name: 1, _id: 0 } });

    //testing
    // const xy = await Chats.aggregate([
    //   { $unwind: "$chats" },
    //   { $match: { user: req.params.id, worker: req.query.id } },
    //   {
    //     $group: {
    //       // _id: "$worker",
    //       averageReview: { $count: "$chats" },
    //     },
    //   },
    // ]);
    console.log("xy");

    const data = await Chats.findOne({
      user: role === "user" ? userId : receiverId,
      worker: role === "user" ? receiverId : userId,
    });

    if (data) {
      data.chats.forEach((chat) => {
        if (chat.status === "sent") {
          console.log(chat._id);
          socket.to(obj[receiverId]).emit("messageDelivered", chat._id);
        }
      });
    }

    await Chats.findOneAndUpdate(
      {
        user: role === "user" ? userId : receiverId,
        worker: role === "user" ? receiverId : userId,
      },
      { $set: { "chats.$[x].status": "delivered" } },
      {
        arrayFilters: [
          {
            "x.status": "sent",
            "x.role": role === "user" ? "Worker" : "User",
          },
        ],
      }
    );

    callback({
      chats: chats === null ? [] : chats,
    });
  });
  //addToChatList
  socket.on("addToChatList", async (userId, role, workerId) => {
    let list2, list;
    if (role === "user") {
      list = await UserChatList.findOne({ user: userId });
      if (list) {
        if (!list.workers.includes(workerId)) {
          list.workers.unshift(workerId);
          await list.save();
        }
      } else {
        list = new UserChatList({
          user: userId,
          workers: [workerId],
        });
        await list.save();
      }

      //kjhkgjk
      list2 = await WorkerChatList.findOne({ worker: workerId });
      if (list2) {
        if (!list2.users.includes(userId)) {
          list2.users.push(userId);
          await list2.save();
        }
      } else {
        list2 = new WorkerChatList({
          worker: workerId,
          users: [userId],
        });
        await list2.save();
      }
    } else {
      throw new Error("Invalid");
    }
    list = await UserChatList.findOne({ user: userId }).populate({
      path: "workers",
      select: { name: 1, _id: 1 },
    });
    socket.emit("chatlist", list.workers);
  });

  socket.on("getchatlist", async (sender, role) => {
    //chatlist
    let list;

    console.log(sender, userId, obj);
    if (role === "worker") {
      list = await WorkerChatList.findOne({ worker: sender }).populate({
        path: "users",
        select: { name: 1, _id: 1 },
      });
    }
    if (role === "user") {
      list = await UserChatList.findOne({ user: sender }).populate({
        path: "workers",
        select: { name: 1, _id: 1 },
      });
    }
    if (list) {
    }
    const x = list ? list[role === "user" ? "workers" : "users"] : [];
    socket.emit("chatlist", x);
    console.log("hey");
  });
  socket.on("message", async (message, sender, receiver, role, callback) => {
    let chatlist;
    //message
    var _id = new mongoose.Types.ObjectId();
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

    //sort chat list
    if (role === "user") {
      chatlist = await UserChatList.findOne({ user: sender });
    } else {
      chatlist = await WorkerChatList.findOne({ worker: sender });
    }
    const index =
      chatlist[role === "user" ? "workers" : "users"].indexOf(receiver);
    chatlist[role === "user" ? "workers" : "users"].splice(index, 1);
    chatlist[role === "user" ? "workers" : "users"].unshift(receiver);
    await chatlist.save();
    if (role === "user") {
      chatlist = await UserChatList.findOne({ user: sender }).populate({
        path: "workers",
        select: { name: 1, _id: 1 },
      });
    } else {
      chatlist = await WorkerChatList.findOne({ worker: sender }).populate({
        path: "users",
        select: { name: 1, _id: 1 },
      });
    }

    //callback
    callback({
      status: "sent",
      message,
      chatlist: chatlist[role === "user" ? "workers" : "users"],
    });
    socket.to(obj[receiver]).emit("messag", message);
  });
  socket.on("delivered", async (_id, sender, receiver, role) => {
    await Chats.findOneAndUpdate(
      {
        user: role === "user" ? sender : receiver,
        worker: role === "worker" ? sender : receiver,
      },
      { $set: { "chats.$[x].status": "delivered" } },
      { arrayFilters: [{ "x._id": _id }] }
    );
    socket.to(obj[receiver]).emit("messageDelivered", _id);
  });

  socket.on("disconnect", () => {
    // console.log("disconnected", obj[userId]);
    delete obj[userId];
    // console.log(obj);
  });
});

//listen
server.listen(port, () => {
  console.log(`Server is up on port:${port}`);
});
