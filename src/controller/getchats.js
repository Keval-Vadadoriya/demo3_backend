const Chats = require("../models/Chats");

const getchats = async (req, res) => {
  let chats;
  try {
    if (req.query.role === "user") {
      chats = await Chats.findOne({
        user: req.params.id,
        worker: req.query.id,
      });
    }
    if (req.query.role === "worker") {
      chats = await Chats.findOne({
        worker: req.params.id,
        user: req.query.id,
      });
    }
    console.log(chats);
    // if (list.length === 0) {
    //   throw new Error("No Chats Found");
    // }
    res.send(chats.chats);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = getchats;
