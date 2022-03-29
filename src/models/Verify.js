const mongoose = require("../database/mongoose");

const verifySchema = mongoose.Schema({
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

const Verify = mongoose.model("Verify", verifySchema);

module.exports = Verify;
