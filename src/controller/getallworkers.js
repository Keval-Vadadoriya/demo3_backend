// const Review = require("../models/Review");
const Worker = require("../models/Worker");
const Chats = require("../models/Chats");

const getallworkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    if (workers.length === 0) {
      throw new Error("No Workers Found");
    }

    //testing
    // const y = await Chats.findOne({}).populate({
    //   path: "chats.owner",
    //   select: { name: 1 },
    // });
    //
    res.send(workers);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = getallworkers;
