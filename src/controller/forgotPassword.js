const User = require("../models/User");
const Worker = require("../models/Worker");
const otpGenerator = require("otp-generator");
const sendEmail = require("../extra/sendEmail");
const VerifyPassword = require("../models/VerifyPassword");

const forgotPassword = async (req, res) => {
  try {
    //orginal
    let user;
    console.log(req.body);
    user = await Worker.findOne({ email: req.body.email });
    if (!user) {
      user = await User.findOne({ email: req.body.email });
    }

    if (!user) {
      throw new Error("Invalid Email");
    }

    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    sendEmail(otp);
    //Verify model
    const verify = new VerifyPassword({ otp: otp, user: user._id });
    verify.save();
    res.status(201).send({});
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = forgotPassword;
