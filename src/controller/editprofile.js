const Worker = require("../models/Worker");
const User = require("../models/User");
const bcrypt = require("bcrypt");
const fs = require("fs");

const editprofile = async (req, res) => {
  let user;
  try {

    if (req.body.availability === "true") {
      req.body.availability = true;
    }
    if (req.body.availability === "false") {
      req.body.availability = false;
    }

    

    //find
    if (req.role === "user") {
      user = await User.findOne({ _id: req.userId });
    }
    if (req.role === "worker") {
      user = await Worker.findOne({ _id: req.userId });
      
    }
    if (!user) {
      return res.status(404).send({Error:'data not fount'})
    }

    //hashing password
    if (req.body.password && req.body.newpassword) {
      if (req.body.newpassword.length < 7) {
        throw new Error("Too Short");
      }
      const ismatch = await bcrypt.compare(req.body.password, user.password);
      if (!ismatch) {
        throw new Error("Invalid Password");
      }
      req.body.password = req.body.newpassword;
      delete req.body.newpassword;
      req.body.password = await bcrypt.hash(req.body.password, 8);
    }

    
    if (req.file) {
      req.body.avatar = `uploads/${req.file.filename}`;
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
    res.status(400).send({ Error: e.message });
  }
};

module.exports = editprofile;
