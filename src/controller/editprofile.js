const Worker = require("../models/Worker");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");

// const path = "./file.txt";

// try {
//   fs.unlinkSync(path);
//   //file removed
// } catch (err) {
//   console.error(err);
// }
const editprofile = async (req, res) => {
  let user;
  try {
    if (req.body.password) {
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }
    console.log(req.body.avatar, req.file);
    if (req.file) {
      req.body.avatar = `uploads/${req.file.filename}`;
    }

    //find
    if (req.query.role === "user") {
      user = await User.findOne({ _id: req.params.id });
      if (!user) {
        throw new Error("no user found");
      }
    }
    if (req.query.role === "worker") {
      user = await Worker.findOne({ _id: req.params.id });
      if (!user) {
        throw new Error("no worker found");
      }
    }
    if (req.body.avatar && user.avatar !== "uploads/default.jpg") {
      fs.unlinkSync(user.avatar);
    }

    //update
    if (req.query.role === "user") {
      await User.updateOne({ _id: req.params.id }, req.body);
    }
    if (req.query.role === "worker") {
      await Worker.updateOne({ _id: req.params.id }, req.body);
    }

    //find again
    if (req.query.role === "user") {
      user = await User.findOne({ _id: req.params.id });
    }
    if (req.query.role === "worker") {
      user = await Worker.findOne({ _id: req.params.id });
    }
    res.send(user);
  } catch (e) {
    console.log(e.message);
    res.status(400).send(e.message);
  }
};

module.exports = editprofile;
