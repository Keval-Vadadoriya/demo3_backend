const mongoose = require("../database/mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const fs = require("fs");
const buffer = fs.readFileSync("../default.jpg");
const userSchema = mongoose.Schema({
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
  avatar: {
    type: Buffer,
    default: buffer,
  },
});

//Hide Sensitive data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;
  delete userObj.tokens;

  return userObj;
};

//Checking Credentials
userSchema.statics.verifyUser = async (email, password) => {
  const user = await User.findOne({ email });
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
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, "demo3project");
  // user.tokens = user.tokens.concat({ token });
  // await user.save();
  return token;
};

//hashing passwords
userSchema.methods.hashPswd = async function () {
  const user = this;
  user.password = await bcrypt.hash(user.password, 8);
  return user;
};

const User = mongoose.model("User", userSchema);

module.exports = User;
