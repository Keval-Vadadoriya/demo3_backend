const obj = require("./users");
const Chats = require("../models/Chats");

const delivered = async (socket, _id, sender, receiver, role) => {
  await Chats.findOneAndUpdate(
    {
      user: role === "user" ? sender : receiver,
      worker: role === "worker" ? sender : receiver,
    },
    { $set: { "chats.$[x].status": "delivered" } },
    { arrayFilters: [{ "x._id": _id }] }
  );
  if (obj[receiver]) {
    socket.to(obj[receiver]).emit("messageDelivered", _id);
  }
};
module.exports = delivered;
