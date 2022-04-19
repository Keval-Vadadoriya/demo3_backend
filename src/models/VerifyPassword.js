const mongoose = require("../database/mongoose");

const verifyPasswordSchema = mongoose.Schema({
  otp: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
  },
});

const VerifyPassword = mongoose.model("VerifyPassword", verifyPasswordSchema);

module.exports = VerifyPassword;
