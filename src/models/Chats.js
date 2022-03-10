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
        type: mongoose.Schema.type.ObjectId,
      },
      status: {
        type: String,
      },
    },
  ],
});

const Chats = mongoose.model("Chats", chatsSchema);

module.exports = Chats;
