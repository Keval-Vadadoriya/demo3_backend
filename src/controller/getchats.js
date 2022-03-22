const Chats = require("../models/Chats");

const getchats = async (req, res) => {
  let chats;
  try {
    if (req.query.role === "user") {
      chats = await Chats.findOne({
        user: req.params.id,
        worker: req.query.id,
      })
        .populate({ path: "user", select: { name: 1, _id: 0 } })
        .populate({ path: "worker", select: { name: 1, _id: 0 } });
    }
    if (req.query.role === "worker") {
      chats = await Chats.findOne({
        worker: req.params.id,
        user: req.query.id,
      })
        .populate({ path: "user", select: { name: 1, _id: 0 } })
        .populate({ path: "worker", select: { name: 1, _id: 0 } });
    }

    //testing
    // const xy = await Chats.aggregate([
    //   { $unwind: "$chats" },
    //   { $match: { user: req.params.id, worker: req.query.id } },
    //   {
    //     $group: {
    //       // _id: "$worker",
    //       averageReview: { $count: "$chats" },
    //     },
    //   },
    // ]);
    // console.log(xy);

    await Chats.findOneAndUpdate(
      {
        user: req.query.role === "user" ? req.params.id : req.query.id,
        worker: req.query.role === "worker" ? req.params.id : req.query.id,
      },
      { $set: { "chats.$[x].status": "delivered" } },
      {
        arrayFilters: [
          {
            "x.status": "sent",
            "x.role": req.query.role === "user" ? "Worker" : "User",
          },
        ],
      }
    );
    if (chats === null) {
      return res.send([]);
    }
    res.send(chats);
  } catch (e) {
    // console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getchats;
