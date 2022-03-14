const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");

const addtochatlist = async (req, res) => {
  console.log("here");
  let list2, list;
  try {
    if (req.query.role === "user") {
      list = await UserChatList.findOne({ user: req.params.id });
      console.log(list);
      if (list) {
        if (!list.workers.includes(req.query.id)) {
          list.workers.push(req.query.id);
          await list.save();
        }
      } else {
        list = new UserChatList({
          user: req.params.id,
          workers: [req.query.id],
        });
        console.log("fdklfdg", list);
        await list.save();
      }
      console.log("1");

      //kjhkgjk
      list2 = await WorkerChatList.findOne({ worker: req.query.id });
      if (list2) {
        if (!list2.users.includes(req.params.id)) {
          list2.users.push(req.params.id);
          await list2.save();
        }
      } else {
        list2 = new WorkerChatList({
          worker: req.query.id,
          users: [req.params.id],
        });
        console.log("2", list2);
        await list2.save();
      }
    } else {
      throw new Error("Invalid");
    }
    console.log(list2);
    res.send(list2);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
};
module.exports = addtochatlist;
