const mongoose = require("../database/mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const workerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
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
    require: true,
  },
  address: {
    type: String,
    required: true,
  },
  tokens: [
    {
      token: {
        type: String,
        required: true,
      },
    },
  ],
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
  user.tokens = user.tokens.concat({ token });

  await user.save();

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
