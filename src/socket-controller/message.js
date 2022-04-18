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
  let userChatList, workerChatList;
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

  //sorting  user chatlist

  userChatList = await UserChatList.findOne({
    user: role === "user" ? sender : receiver,
  });
  let index = userChatList["workers"].findIndex(
    (worker) => worker.user.toString() === (role === "user" ? receiver : sender)
  );
  const worker = userChatList["workers"].splice(index, 1);
  if (role === "worker") {
    worker[0].count = worker[0].count + 1;
  }
  userChatList["workers"].unshift(worker[0]);
  await userChatList.save();

  //sorting worker chatlist
  workerChatList = await WorkerChatList.findOne({
    worker: role === "user" ? receiver : sender,
  });
  index = workerChatList["users"].findIndex(
    (user) => user.user.toString() === (role === "user" ? sender : receiver)
  );
  const user = workerChatList["users"].splice(index, 1);
  if (role === "user") {
    user[0].count = user[0].count + 1;
  }

  workerChatList["users"].unshift(user[0]);
  await workerChatList.save();

  //
  userChatList = await UserChatList.findOne({
    user: role === "user" ? sender : receiver,
  }).populate({
    path: "workers.user",
    select: { name: 1, _id: 1, avatar: 1 },
  });
  workerChatList = await WorkerChatList.findOne({
    worker: role === "user" ? receiver : sender,
  }).populate({
    path: "users.user",
    select: { name: 1, _id: 1, avatar: 1 },
  });

  //callback
  callback({
    status: "sent",
    message,
    chatlist: role === "user" ? userChatList.workers : workerChatList.users,
  });
  if (obj[receiver]) {
    socket
      .to(obj[receiver])
      .emit("message", { message, role, sender, receiver });
    socket
      .to(obj[receiver])
      .emit(
        "chatlist",
        role === "user" ? workerChatList.users : userChatList.workers
      );
  }
};
module.exports = message;
