const obj = require("./users");
const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const getchatlist = async (socket, {userId, role}) => {
  //chatlist
  let list;

  if (role === "worker") {
    list = await WorkerChatList.findOne({ worker: userId }).populate({
      path: "users.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
  }
  if (role === "user") {
    list = await UserChatList.findOne({ user: userId }).populate({
      path: "workers.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
  }
  list = list ? list[role === "user" ? "workers" : "users"] : [];
  socket.emit("chatlist", list);
};
module.exports = getchatlist;
