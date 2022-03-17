const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");
const Chats = require("../models/Chats");

const addtochatlist = async (req, res) => {
  let list2, list;
  try {
    if (req.query.role === "user") {
      list = await UserChatList.findOne({ user: req.params.id });
      if (list) {
        if (!list.workers.includes(req.query.id)) {
          list.workers.unshift(req.query.id);
          await list.save();
        } else {
          const index = list.workers.indexOf(req.query.id);
          list.workers.splice(index, 1);
          list.workers.unshift(req.query.id);
          await list.save();
        }
      } else {
        list = new UserChatList({
          user: req.params.id,
          workers: [req.query.id],
        });
        await list.save();
      }

      //kjhkgjk
      list2 = await WorkerChatList.findOne({ worker: req.query.id });
      if (list2) {
        if (!list2.users.includes(req.params.id)) {
          list2.users.push(req.params.id);
          await list2.save();
        } else {
          const index = list2.users.indexOf(req.params.id);
          console.log(index);
          list2.users.splice(index, 1);
          list2.users.unshift(req.params.id);
          await list2.save();
        }
      } else {
        list2 = new WorkerChatList({
          worker: req.query.id,
          users: [req.params.id],
        });
        await list2.save();
      }
      if (req.query.role === "user") {
        const chats = new Chats({
          user: req.params.id,
          worker: req.query.id,
        });
        console.log(chats);

        await chats.save();
      }
    } else {
      throw new Error("Invalid");
    }
    res.send(list2);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
};
module.exports = addtochatlist;
