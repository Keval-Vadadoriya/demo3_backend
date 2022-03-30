const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const Chats = require("../models/Chats");

const addtochatlist = async (socket, userid, role, workerid) => {
  let list2, list, chats;
  const userId = role === "user" ? userid : workerid;
  const workerId = role === "worker" ? userid : workerid;

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
  }

  //kjhkgjk
  list2 = await WorkerChatList.findOne({ worker: workerId });
  if (list2) {
    if (
      list2.users.findIndex((user) => user.user.toString() === userId) === -1
    ) {
      list2.users.unshift({ user: userId });
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

  socket.emit("chatlist", list[role === "user" ? "workers" : "users"], chats);
};
module.exports = addtochatlist;
