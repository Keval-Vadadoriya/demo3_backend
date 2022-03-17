const mongoose = require("../database/mongoose");

const chatsSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Worker",
  },
  chats: [
    {
      message: {
        type: String,
      },
      time: {
        type: Number,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        refPath: "chats.role",
      },
      role: {
        type: String,
        enum: ["User", "Worker"],
      },
      status: {
        type: String,
        default: "sent",
      },
    },
  ],
});

const Chats = mongoose.model("Chats", chatsSchema);

module.exports = Chats;
