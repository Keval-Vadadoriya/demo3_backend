const User = require("../models/User");
const Worker = require("../models/Worker");
const otpGenerator = require("otp-generator");
const sendEmail = require("../extra/sendEmail");
const Verify = require("../models/Verify");

const loginUser = async (req, res) => {
  try {
    console.log("1dfhdf");

    let user = null,
      role = "user";

    user = await User.verifyUser(req.body.email, req.body.password);
    if (!user) {
      user = await Worker.verifyWorker(req.body.email, req.body.password);
      role = "worker";
    }
    if (!user) {
      throw new Error("Invalid Email");
    }
    console.log("2dfhdf");

    if (user.active === false) {
      const otp = otpGenerator.generate(6, {
        upperCaseAlphabets: false,
        specialChars: false,
      });
      sendEmail(otp);
      const verify = new Verify({ otp, user: user._id });
      await verify.save();
      throw new Error("Plese Verify Your Email");
    }
    console.log("3dfhdf");

    const token = await user.generateAuthToken(role);
    console.log("dfhdf");
    res.send({ user, token, role });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = loginUser;
