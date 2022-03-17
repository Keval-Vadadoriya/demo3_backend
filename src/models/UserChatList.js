const mongoose = require("../database/mongoose");

const userChatListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
  ],
});

const UserChatList = mongoose.model("UserChatList", userChatListSchema);

module.exports = UserChatList;
