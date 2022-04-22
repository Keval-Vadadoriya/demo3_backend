const Worker = require("../../models/Worker");
const User = require("../../models/User");
const VerifyPassword = require("../../models/VerifyPassword");
const bcrypt = require("bcrypt");

const verifyPassword = async (req, res) => {
  try {
    let user,
      role = "user";
    const verify = await VerifyPassword.findOne({
      otp: req.params.otp,
    });
    if (verify) {
      user = await User.findOne({ _id: verify.user });
      if (!user) {
        user = await Worker.findOne({ _id: verify.user });
        role = "worker";
      }
      if (!user) {
        throw new Error("Invalid Otp");
      } else {
        user.password = await bcrypt.hash(req.body.password, 8);
        await user.save();

        await VerifyPassword.findOneAndDelete({ otp: req.query.otp });
      }
      const token = await user.generateAuthToken(role);

      res.send({ user, token });
    } else {
      throw new Error("Invalid Otp");
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = verifyPassword;
