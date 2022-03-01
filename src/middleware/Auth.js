const jwt = require("jsonwebtoken");
const User = require("../models/User");

const auth = async (req, res, next) => {
  try {
    const token = req.header("Authorization").replace("Bearer ", "");
    const decoded = jwt.verify(token, "demo3project");
    const user = await User.find({ _id: decoded._id, "tokens.token": token });

    if (!user) {
      throw new Error("Invalid user");
    }

    req.user = user[0];
    next();
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = auth;
