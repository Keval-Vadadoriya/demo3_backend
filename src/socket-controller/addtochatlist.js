const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const Chats = require("../models/Chats");

const addtochatlist = async (socket, userid, role, workerid) => {
  let list2, list, chats;
  const userId = role === "user" ? userid : workerid;
  const workerId = role === "worker" ? userid : workerid;

  console.log("addtochatlist");
  list = await UserChatList.findOne({ user: userId });
  if (list) {
    if (list.workers.findIndex((worker) => worker.user === workerId) !== -1) {
      console.log("hi");
      list.workers.unshift({ user: workerId });
      await list.save();
      chats = new Chats({ user: userId, worker: workerId });
      chats.chats = [];
      await chats.save();
      chats = await Chats.findOne({ user: userId, worker: workerId })
        .populate("user")
        .populate("worker");
      console.log(chats);
    }
  } else {
    console.log("hi");
    list = new UserChatList({
      user: userId,
      workers: [{ user: workerId }],
    });
    await list.save();

    chats = new Chats({ user: userId, worker: workerId });
    chats.chats = [];
    console;
    await chats.save();
    chats = await Chats.findOne({ user: userId, worker: workerId })
      .populate("user")
      .populate("worker");
  }

  //kjhkgjk
  list2 = await WorkerChatList.findOne({ worker: workerId });
  if (list2) {
    if (list.workers.findIndex((user) => user.user === userId) !== -1) {
      list2.users.push({ user: userId });
      await list2.save();
    }
  } else {
    list2 = new WorkerChatList({
      worker: workerId,
      users: [{ user: userId }],
    });
    await list2.save();
  }
  if (role === "user") {
    list = await UserChatList.findOne({ user: userId }).populate({
      path: "workers.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
  } else {
    list = await WorkerChatList.findOne({ worker: workerId }).populate({
      path: "users.user",
      select: { name: 1, _id: 1, avatar: 1 },
    });
  }

  console.log(chats);

  socket.emit("chatlist", list[role === "user" ? "workers" : "users"], chats);
};
module.exports = addtochatlist;
