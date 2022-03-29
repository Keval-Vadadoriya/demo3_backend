const mongoose = require("../database/mongoose");

const verifyPasswordSchema = mongoose.Schema({
  otp: {
    type: String,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    // refPath: "role",
  },
  //   role: {
  //     type: String,
  //     enum: ["User", "Worker"],
  //   },
});

const VerifyPassword = mongoose.model("VerifyPassword", verifyPasswordSchema);

module.exports = VerifyPassword;
