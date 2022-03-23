const mongoose = require("../database/mongoose");

const messageCountSchema = mongoose.Schema({
  message_id: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Chats",
  },
  count_worker: {
    type: Number,
    default: 0,
  },
  count_user: {
    type: Number,
    default: 0,
  },
});

const MessageCount = mongoose.model("MessageCount", messageCountSchema);

module.exports = MessageCount;
