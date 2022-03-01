const mongoose = require("../database/mongoose");

const professionSchema = mongoose.Schema({
  profession: {
    type: String,
    require: true,
    unique: true,
  },
  workers: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Worker",
    },
  ],
});

//Hide Sensitive data
// workerSchema.methods.toJSON = function () {
//   user = this;
//   const userObj = user.toObject();
//   delete userObj.password;
//   delete userObj.tokens;

//   return userObj;
// };

const Profession = mongoose.model("Profession", professionSchema);

module.exports = Profession;
