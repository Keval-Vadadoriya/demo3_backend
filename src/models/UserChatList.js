const mongoose = require("../database/mongoose");

const userChatListSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  workers: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Worker",
        default: [],
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const UserChatList = mongoose.model("UserChatList", userChatListSchema);

module.exports = UserChatList;
