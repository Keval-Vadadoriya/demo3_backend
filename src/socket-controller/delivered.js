const obj = require("./users");
const Chats = require("../models/Chats");
const UserChatList = require("../models/UserChatList");
const WorkerChatList = require("../models/WorkerChatList");

const delivered = async (socket, _id, sender, receiver, role) => {
  let chatList;
  console.log(role, "duhfd");
  await Chats.findOneAndUpdate(
    {
      user: role === "user" ? sender : receiver,
      worker: role === "worker" ? sender : receiver,
    },
    { $set: { "chats.$[x].status": "delivered" } },
    { arrayFilters: [{ "x._id": _id }] }
  );
  if (role === "user") {
    chatList = await WorkerChatList.findOneAndUpdate(
      { worker: sender },
      {
        $inc: { "users.$[x].count": -1 },
      },
      { arrayFilters: [{ "x.user": receiver }] }
    );
    console.log("b", chatList);
  } else {
    chatList = await UserChatList.findOneAndUpdate(
      { worker: sender },
      {
        $inc: { "workers.$[x].count": -1 },
      },
      { arrayFilters: [{ "x.user": receiver }] }
    );
    console.log("a", chatList);
  }

  if (obj[receiver]) {
    socket.to(obj[receiver]).emit("messageDelivered", _id);
  }
};
module.exports = delivered;
