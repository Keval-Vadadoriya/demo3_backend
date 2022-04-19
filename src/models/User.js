const mongoose = require("../database/mongoose");
const validator = require("validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    unique: true,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
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
  contact: {
    type: Number,
    minlength: 10,
    maxlength: 10,
  },
  age: {
    type: Number,
    default: 0,
  },
  avatar: {
    type: String,
    default: "uploads/default.jpg",
  },
  active: {
    type: Boolean,
    default: false,
  },
});

//Hide Sensitive data
userSchema.methods.toJSON = function () {
  const user = this;
  const userObj = user.toObject();
  delete userObj.password;

  return userObj;
};

//Checking Credentials
userSchema.statics.verifyUser = async (email, password) => {
  const user = await User.findOne({ email });

  if (user) {
    const ismatch = await bcrypt.compare(password, user.password);

    if (!ismatch) {
      throw new Error("Invalid Password");
    }
  }
  return user;
};

//  generate JsonWebToken
userSchema.methods.generateAuthToken = async function (role) {
  const user = this;
  const token = jwt.sign({ _id: user._id, role }, process.env.SECRET_KEY);

  return token;
};

//hashing passwords
userSchema.methods.hashPswd = async function () {
  const user = this;
  user.password = await bcrypt.hash(user.password, 8);
  return user;
};

userSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    if (error.keyPattern.name === 1) {
      next(new Error("Name Already Exists"));
    }
    if (error.keyPattern.email === 1) {
      next(new Error("Email Already Exists"));
    }
  } else {
    next();
  }
});

const User = mongoose.model("User", userSchema);

module.exports = User;
