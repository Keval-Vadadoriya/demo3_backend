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
};
module.exports = message;
