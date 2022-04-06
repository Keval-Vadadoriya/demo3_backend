const Worker = require("../models/Worker");
const User = require("../models/User");
const Verify = require("../models/Verify");

const verifyUser = async (req, res) => {
  try {
    let user,
      role = "user";
    console.log("Domain is matched. Information is from Authentic email");
    const verify = await Verify.findOne({
      otp: req.params.otp,
    });
    if (verify) {
      console.log("email is verified");
      user = await User.findOne({ _id: verify.user });
      if (!user) {
        user = await Worker.findOne({ _id: verify.user });
        role = "worker";
      }
      if (!user) {
        throw new Error("Invalid");
      } else {
        user.active = true;
        await user.save();
        await Verify.findOneAndDelete({ otp: req.query.id });
      }
      const token = await user.generateAuthToken(role);
      res.send({ user, token, role });
    } else {
      throw new Error("Invalid2");
    }
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = verifyUser;
