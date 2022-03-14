const mongoose = require("../database/mongoose");

const workerChatListSchema = mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    // required: true,
    ref: "Worker",
  },
  users: [
    {
      type: mongoose.Schema.Types.ObjectId,
      // unique: true,
      ref: "User",
    },
  ],
});

const WorkerChatList = mongoose.model("WorkerChatList", workerChatListSchema);

module.exports = WorkerChatList;
