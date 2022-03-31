const obj = require("./users");
const Chats = require("../models/Chats");
const UserChatList = require("../models/UserChatList");
const WorkerChatList = require("../models/WorkerChatList");

const delivered = async (socket, _id, sender, receiver, role, callback) => {
  let chatList;
  await Chats.findOneAndUpdate(
    {
      user: role === "user" ? sender : receiver,
      worker: role === "worker" ? sender : receiver,
    },
    { $set: { "chats.$[x].status": "delivered" } },
    { arrayFilters: [{ "x._id": _id }] }
  );
  if (obj[receiver]) {
    socket.to(obj[sender]).emit("messageDelivered", _id);
  }
  if (role === "user") {
    chatList = await WorkerChatList.findOneAndUpdate(
      { worker: receiver },
      {
        $inc: { "users.$[x].count": 0 },
      },
      { arrayFilters: [{ "x.user": sender }] }
    );
  } else {
    chatList = await UserChatList.findOneAndUpdate(
      { user: receiver },
      {
        $inc: { "workers.$[x].count": 0 },
      },
      { arrayFilters: [{ "x.user": sender }] }
    );
  }

  if (role === "user") {
    chatList = await WorkerChatList.findOne({ worker: receiver }).populate({
      path: "users.user",
      select: { _id: 1, name: 1, avatar: 1 },
    });
  } else {
    chatList = await UserChatList.findOne({ user: receiver }).populate({
      path: "workers.user",
      select: { _id: 1, name: 1, avatar: 1 },
    });
  }
  callback({ chatList: chatList[role === "user" ? "users" : "workers"] });
};
module.exports = delivered;
