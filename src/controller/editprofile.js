const Worker = require("../models/Worker");
const User = require("../models/User");

const editprofile = async (req, res) => {
  let user;
  try {
    if (req.query.role === "user") {
      const user = await User.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      if (!user) {
        throw new Error("no user found");
      }
    }
    if (req.query.role === "worker") {
      const user = await Worker.findOneAndUpdate(
        { _id: req.params.id },
        req.body
      );
      if (!user) {
        throw new Error("no worker found");
      }
    }
    res.send(user);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = editprofile;
