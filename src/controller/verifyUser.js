const Worker = require("../models/Worker");
const User = require("../models/User");
const Verify = require("../models/Verify");

const verifyUser = async (req, res) => {
  try {
    let user,
      role = "user";
    const verify = await Verify.findOne({
      otp: req.params.otp,
    });
    if (verify) {
      user = await User.findOne({ _id: verify.user });
      if (!user) {
        user = await Worker.findOne({ _id: verify.user });
        role = "worker";
      }
      if (!user) {
        throw new Error("Invalid otp");
      } else {
        user.active = true;
        await user.save();
        await Verify.findOneAndDelete({ otp: req.query.otp });
      }
      const token = await user.generateAuthToken(role);
      res.send({ user, token, role });
    } else {
      throw new Error("Invalid Otp");
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = verifyUser;
