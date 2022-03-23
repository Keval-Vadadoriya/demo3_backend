const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Worker = require("../models/Worker");

const auth = async (req, res, next) => {
  try {
    let user;
    console.log("here", req.header("Authorization"));
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    console.log("here", decoded);
    if (decoded.role === "user") {
      console.log("user");
      user = await User.find({ _id: decoded._id });
    }
    if (decoded.role === "worker") {
      console.log("worker");
      user = await Worker.find({ _id: decoded._id });
    }
    if (!user) {
      throw new Error("Please Authenticate");
    }

    req.userId = decoded._id;
    req.role = decoded.role;
    // req.user = user[0];
    next();
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
};

module.exports = auth;
