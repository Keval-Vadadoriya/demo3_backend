const mongoose = require("../database/mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const buffer = fs.readFileSync("../default.jpg");
const workerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    unique: true,
    type: String,
    required: true,
    // toLowercase:true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Not Email");
      }
    },
  },
  password: {
    type: String,
    rquired: true,
    minlength: 8,
  },
  age: {
    type: Number,
    rquired: true,
    default: 0,
  },
  profession: {
    type: String,
    required: true,
  },
  location: {
    type: String,
    required: true,
  },
  review: {
    type: Number,
    default: 0,
    max: 5,
  },
  availability: {
    type: Boolean,
    default: true,
  },
  avatar: {
    type: Buffer,
    default: buffer,
  },
});

//Hide Sensitive data
workerSchema.methods.toJSON = function () {
  user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

//Checking Credentials
workerSchema.statics.verifyWorker = async (email, password) => {
  const user = await Worker.findOne({ email });
  if (!user) {
    throw new Error("Invalid Email");
  }

  const ismatch = await bcrypt.compare(password, user.password);

  if (!ismatch) {
    throw new Error("Invalid Password");
  }
  return user;
};

//  generate JsonWebToken
workerSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "demo3project");
  // user.tokens = user.tokens.concat({ token });

  // await user.save();

  return token;
};

//hashing passwords
workerSchema.methods.hashPswd = async function () {
  const user = this;
  user.password = await bcrypt.hash(user.password, 8);
  return user;
};

const Worker = mongoose.model("Worker", workerSchema);

module.exports = Worker;
