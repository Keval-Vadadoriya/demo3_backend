const Worker = require("../models/Worker");
const User = require("../models/User");
const VerifyPassword = require("../models/VerifyPassword");
const bcrypt = require("bcrypt");

const verifyPassword = async (req, res) => {
  try {
    let user;
    console.log("Domain is matched. Information is from Authentic email");
    const verify = await VerifyPassword.findOne({
      otp: req.params.otp,
    });
    if (verify) {
      console.log(verify, req.body);
      console.log("email is verified");
      user = await User.findOne({ _id: verify.user });
      if (!user) {
        user = await Worker.findOne({ _id: verify.user });
      }
      if (!user) {
        throw new Error("Invalid");
      } else {
        user.password = await bcrypt.hash(req.body.password, 8);
        console.log("1");
        await user.save();
        console.log("2");

        await VerifyPassword.findOneAndDelete({ otp: req.query.otp });
        console.log("3");
      }
      const token = await user.generateAuthToken();
      console.log("4");

      res.send({ user, token });
    } else {
      throw new Error("Invalid2");
    }
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = verifyPassword;
