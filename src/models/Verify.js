const mongoose = require("../database/mongoose");

const verifySchema = mongoose.Schema({
  otp: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const Verify = mongoose.model("Verify", verifySchema);

module.exports = Verify;
