const Worker = require("../models/Worker");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");

const editprofile = async (req, res) => {
  let user;
  try {
    console.log(req.body);

    if (req.body.availability) {
      if (req.body.availability === "none") {
        delete req.body.availability;
      } else {
        req.body.availability = Boolean(req.body.availability);
      }
    }
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
    if (req.file) {
      req.body.avatar = `uploads/${req.file.filename}`;
    }

    //find
    if (req.role === "user") {
      user = await User.findOne({ _id: req.userId });
      if (!user) {
        throw new Error("no user found");
      }
    }
    if (req.role === "worker") {
      user = await Worker.findOne({ _id: req.userId });
      if (!user) {
        throw new Error("no worker found");
      }
    }
    if (req.body.avatar && user.avatar !== "uploads/default.jpg") {
      fs.unlinkSync(user.avatar);
    }

    //update
    if (req.query.role === "user") {
      await User.updateOne({ _id: req.userId }, req.body);
    }
    if (req.query.role === "worker") {
      await Worker.updateOne({ _id: req.userId }, req.body);
    }

    //find again
    if (req.query.role === "user") {
      user = await User.findOne({ _id: req.userId });
    }
    if (req.query.role === "worker") {
      user = await Worker.findOne({ _id: req.userId });
    }
    res.send(user);
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = editprofile;
