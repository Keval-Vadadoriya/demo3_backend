const obj = require("./users");
const Chats = require("../models/Chats");
const getchats = async (socket, userId, role, receiverId, callback) => {
  let chats;
  console.log("sfsd");
  chats = await Chats.findOne({
    user: role === "user" ? userId : receiverId,
    worker: role === "user" ? receiverId : userId,
  })
    .populate({ path: "user", select: { name: 1, _id: 0 } })
    .populate({ path: "worker", select: { name: 1, _id: 0 } });

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
  console.log("xy");

  const data = await Chats.findOne({
    user: role === "user" ? userId : receiverId,
    worker: role === "user" ? receiverId : userId,
  });

  if (data) {
    data.chats.forEach((chat) => {
      if (chat.status === "sent") {
        console.log(chat._id);
        socket.to(obj[receiverId]).emit("messageDelivered", chat._id);
      }
    });
  }
  callback({
    chats: chats === null ? [] : chats,
  });

  await Chats.findOneAndUpdate(
    {
      user: role === "user" ? userId : receiverId,
      worker: role === "user" ? receiverId : userId,
    },
    { $set: { "chats.$[x].status": "delivered" } },
    {
      arrayFilters: [
        {
          "x.status": "sent",
          "x.role": role === "user" ? "Worker" : "User",
        },
      ],
    }
  );
};
module.exports = getchats;
