const mongoose = require("../database/mongoose");
// const validator = require("validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

const projectSchema = mongoose.Schema(
  {
    project_name: {
      type: String,
      unique: true,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    profession: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

//Hide Sensitive data
// workerSchema.methods.toJSON = function () {
//   user = this;
//   const userObj = user.toObject();
//   delete userObj.password;
//   delete userObj.tokens;

//   return userObj;
// };

// //Checking Credentials
// workerSchema.statics.verifyWorker = async (email, password) => {
//   const user = await Worker.findOne({ email });
//   if (!user) {
//     throw new Error("Invalid Email");
//   }

//   const ismatch = await bcrypt.compare(password, user.password);

//   if (!ismatch) {
//     throw new Error("Invalid Password");
//   }
//   return user;
// };

// //  generate JsonWebToken
// workerSchema.methods.generateAuthToken = async function (role) {
//   const user = this;
//   const token = jwt.sign({ _id: user._id, role }, process.env.SECRET_KEY);

//   return token;
// };

// //hashing passwords
// workerSchema.methods.hashPswd = async function () {
//   const user = this;
//   user.password = await bcrypt.hash(user.password, 8);
//   return user;
// };

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
