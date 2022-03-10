const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");

const getchatlist = async (req, res) => {
  let list;
  try {
    if (req.query.role === "worker") {
      list = await WorkerChatList.findOne({ worker: req.params.id }).populate({
        path: "users",
        select: { name: 1, _id: 1 },
      });
    }
    if (req.query.role === "user") {
      list = await UserChatList.findOne({ user: req.params.id }).populate({
        path: "workers",
        select: { name: 1, _id: 1 },
      });
    }
    console.log(list);
    // if (list.length === 0) {
    //   throw new Error("No Chats Found");
    // }
    res.send(list);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = getchatlist;
