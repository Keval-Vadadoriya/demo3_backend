const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");

const addtochatlist = async (socket, userId, role, workerId) => {
  let list2, list;
  if (role === "user") {
    list = await UserChatList.findOne({ user: userId });
    if (list) {
      if (!list.workers.includes(workerId)) {
        list.workers.unshift(workerId);
        await list.save();
      }
    } else {
      list = new UserChatList({
        user: userId,
        workers: [workerId],
      });
      await list.save();
    }

    //kjhkgjk
    list2 = await WorkerChatList.findOne({ worker: workerId });
    if (list2) {
      if (!list2.users.includes(userId)) {
        list2.users.push(userId);
        await list2.save();
      }
    } else {
      list2 = new WorkerChatList({
        worker: workerId,
        users: [userId],
      });
      await list2.save();
    }
  } else {
    throw new Error("Invalid");
  }
  list = await UserChatList.findOne({ user: userId }).populate({
    path: "workers",
    select: { name: 1, _id: 1 },
  });
  socket.emit("chatlist", list.workers);
};
module.exports = addtochatlist;
