const mongoose = require("../database/mongoose");

const workerChatListSchema = mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Worker",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: [],
    },
  ],
});

const WorkerChatList = mongoose.model("WorkerChatList", workerChatListSchema);

module.exports = WorkerChatList;
