const obj = require("./users");
const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const getchatlist = async (socket, sender, role) => {
  //chatlist
  let list;

  // console.log(sender, userId, obj);
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
};
module.exports = getchatlist;
