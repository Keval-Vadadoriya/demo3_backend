const jwt = require("jsonwebtoken");
const User = require("../models/User");
const Worker = require("../models/Worker");

const auth = async (req, res, next) => {
  try {
    let user;
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, process.env.SECRET_KEY);
    if (decoded.role === "user") {
      user = await User.find({ _id: decoded._id });
    }
    if (decoded.role === "worker") {
      user = await Worker.find({ _id: decoded._id });
    }
    if (!user) {
      throw new Error("Please Authenticate");
    }

    req.userId = decoded._id;
    req.role = decoded.role;
    next();
  } catch (e) {
    res.status(401).send(e.message);
  }
};

module.exports = auth;
