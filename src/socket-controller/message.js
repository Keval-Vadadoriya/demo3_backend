const Chats = require("../models/Chats");
const WorkerChatList = require("../models/WorkerChatList");
const obj = require("./users");
const UserChatList = require("../models/UserChatList");
const mongoose = require("mongoose");

const message = async (
  socket,
  { message, sender, receiver, role },
  callback
) => {
  let chatlist, chatlist2;
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

  //sort chat list 1

  chatlist = await UserChatList.findOne({
    user: role === "user" ? sender : receiver,
  });
  let index = chatlist["workers"].findIndex(
    (worker) => worker.user.toString() === (role === "user" ? receiver : sender)
  );
  const worker = chatlist["workers"].splice(index, 1);
  if (role === "worker") {
    worker[0].count = worker[0].count + 1;
  }
  chatlist["workers"].unshift(worker[0]);
  await chatlist.save();

  //sort list 2
  chatlist2 = await WorkerChatList.findOne({
    worker: role === "user" ? receiver : sender,
  });
  index = chatlist2["users"].findIndex(
    (user) => user.user.toString() === (role === "user" ? sender : receiver)
  );
  const user = chatlist2["users"].splice(index, 1);
  if (role === "user") {
    user[0].count = user[0].count + 1;
  }

  chatlist2["users"].unshift(user[0]);
  await chatlist2.save();

  if (role === "user") {
    chatlist = await UserChatList.findOne({ user: sender }).populate({
      path: "workers.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
    chatlist2 = await WorkerChatList.findOne({ worker: receiver }).populate({
      path: "users.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
  } else {
    chatlist = await WorkerChatList.findOne({ worker: sender }).populate({
      path: "users.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
    chatlist2 = await UserChatList.findOne({ user: receiver }).populate({
      path: "workers.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
  }

  //count++

  //callback
  callback({
    status: "sent",
    message,
    chatlist: chatlist[role === "user" ? "workers" : "users"],
  });
  if (obj[receiver]) {
    socket
      .to(obj[receiver])
      .emit("messag", { message, role, sender, receiver });
    socket
      .to(obj[receiver])
      .emit("chatlist", chatlist2[role === "user" ? "users" : "workers"]);
  }
};
module.exports = message;
