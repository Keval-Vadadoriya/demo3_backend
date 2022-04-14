const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const Chats = require("../models/Chats");

const addtochatlist = async (socket, userid, role, workerid) => {
  let list, chats;
  console.log(userid, role, workerid);
  const userId = role === "user" ? userid : workerid;
  const workerId = role === "worker" ? userid : workerid;

  //add to user chat list
  list = await UserChatList.findOne({ user: userId });
  if (list) {
    if (
      list.workers.findIndex(
        (worker) => worker.user.toString() === workerId
      ) === -1
    ) {
      list.workers.unshift({ user: workerId });
      await list.save();
      chats = new Chats({ user: userId, worker: workerId });
      chats.chats = [];
      await chats.save();
      chats = await Chats.findOne({ user: userId, worker: workerId })
        .populate("user")
        .populate("worker");
      console.log("chat1", chats);
    }
  } else {
    list = new UserChatList({
      user: userId,
      workers: [{ user: workerId }],
    });
    await list.save();

    chats = new Chats({ user: userId, worker: workerId });
    chats.chats = [];
    await chats.save();
    chats = await Chats.findOne({ user: userId, worker: workerId })
      .populate("user")
      .populate("worker");
    console.log("chat2", chats);
  }

  //add to worker chat list
  list = await WorkerChatList.findOne({ worker: workerId });
  if (list) {
    if (
      list.users.findIndex((user) => user.user.toString() === userId) === -1
    ) {
      list.users.unshift({ user: userId });
      await list.save();
    }
  } else {
    list = new WorkerChatList({
      worker: workerId,
      users: [{ user: userId }],
    });

    await list.save();
    console.log("workerlist", list);
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

  socket.emit("chatlist", list[role === "user" ? "workers" : "users"], chats);
};
module.exports = addtochatlist;
