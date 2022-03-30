const mongoose = require("../database/mongoose");

const workerChatListSchema = mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
  },
  users: [
    {
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
      count: {
        type: Number,
        default: 0,
      },
    },
  ],
});

const WorkerChatList = mongoose.model("WorkerChatList", workerChatListSchema);

module.exports = WorkerChatList;
