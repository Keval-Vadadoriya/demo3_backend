const obj = require("./users");
const Chats = require("../models/Chats");
const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const getchats = async (socket, { userId, role, receiverId }, callback) => {
  let chats, chatList;
  chats = await Chats.findOne({
    user: role === "user" ? userId : receiverId,
    worker: role === "user" ? receiverId : userId,
  })
    .populate({ path: "user", select: { name: 1, _id: 0, avatar: 1 } })
    .populate({ path: "worker", select: { name: 1, _id: 0, avatar: 1 } });

  //message delivered
  if (chats) {
    if (chats.chats.length !== 0) {
      chats.chats.forEach((chat) => {
        if (chat.status === "sent") {
          if (obj[receiverId]) {
            socket.to(obj[receiverId]).emit("messageDelivered", chat._id);
          }
        }
      });
    }
  }

  //count==0
  if (role === "worker") {
    chatList = await WorkerChatList.findOneAndUpdate(
      { worker: userId },
      {
        $set: { "users.$[x].count": 0 },
      },
      { arrayFilters: [{ "x.user": receiverId }] }
    );
  }
  if (role === "user") {
    chatList = await UserChatList.findOneAndUpdate(
      { user: userId },
      {
        $set: { "workers.$[x].count": 0 },
      },
      { arrayFilters: [{ "x.user": receiverId }] }
    );
  }

  //chatlist
  if (role === "worker") {
    chatList = await WorkerChatList.findOne({ worker: userId }).populate({
      path: "users.user",
      select: { _id: 1, name: 1, avatar: 1 },
    });
  } else {
    chatList = await UserChatList.findOne({ user: userId }).populate({
      path: "workers.user",
      select: { _id: 1, name: 1, avatar: 1 },
    });
  }

  callback({
    chats: chats === null ? [] : chats,
    chatList: chatList[role === "user" ? "workers" : "users"],
  });

  //updating status
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
};
module.exports = getchats;
