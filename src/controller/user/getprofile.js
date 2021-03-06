const Worker = require("../../models/Worker");
const User = require("../../models/User");

const getprofile = async (req, res) => {
  let user;
  try {
    //find
    if (req.role === "user") {
      user = await User.findOne({ _id: req.userId });
      if (!user) {
        return res.status(404).send("no user found");
      }
    }
    if (req.role === "worker") {
      user = await Worker.findOne({ _id: req.userId });
      if (!user) {
        return res.status(404).send("no worker found");
      }
    }

    res.send({ user, role: req.role });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getprofile;
