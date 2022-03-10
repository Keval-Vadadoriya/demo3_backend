const mongoose = require("../database/mongoose");

const userChatListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      unique: true,
      ref: "Worker",
    },
  ],
});

const UserChatList = mongoose.model("UserChatList", userChatListSchema);

module.exports = UserChatList;
