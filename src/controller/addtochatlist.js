const WorkerChatList = require("../models/WorkerChatList");
const UserChatList = require("../models/UserChatList");

const addtochatlist = async (req, res) => {
  let list2, list;
  try {
    if (req.query.role === "user") {
      list = await UserChatList.findOne({ user: req.params.id });
      if (list) {
        if (!list.workers.includes(req.query.id)) {
          list.workers.push(req.query.id);
          await list.save();
        }
      } else {
        list = new UserChatList({
          user: `${req.params.id}`,
          workers: [req.query.id],
        });
        // list.workers.push(req.query.id);

        await list.save();
      }

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
        await list2.save();
      }
    } else {
      throw new Error("Invalid");
    }
    // if (req.query.role === "worker") {
    //   list = await WorkerChatList.findOne({ worker: req.params.id });
    //   if (list) {
    //     list.users.push(req.query.id);
    //     await list.save();
    //   } else {
    //     list = new WorkerChatList({
    //       worker: req.params.id,
    //       users: [req.query.id],
    //     });
    //     await list.save();
    //   }
    //   //dfgdkjd
    //   list2 = await UserChatList.findOne({ user: req.query.id });
    //   if (list2) {
    //     if (!list2.workers.includes(req.params.id)) {
    //       list.workers.push(req.query.id);
    //       await list.save();
    //     }
    //   } else {
    //     list = new UserChatList({
    //       user: `${req.params.id}`,
    //       workers: [req.query.id],
    //     });
    //     // list.workers.push(req.query.id);

    //     await list.save();
    //   }
    // }
    // if (list.length === 0) {
    //   throw new Error("No Chats Found");
    // }
    res.send(list);
  } catch (e) {
    res.status(400).send(e.message);
  }
};
module.exports = addtochatlist;
