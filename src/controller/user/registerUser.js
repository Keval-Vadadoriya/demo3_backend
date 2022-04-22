const User = require("../../models/User");
const Worker = require("../../models/Worker");
const Review = require("../../models/Review");
const Verify = require("../../models/Verify");
const otpGenerator = require("otp-generator");
const sendEmail = require("../../helper/sendEmail");

const registerUser = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });

    let user;
    if (req.query.role === "worker") {
      const exist = await User.findOne({ email: req.body.email });
      if (exist) {
        throw new Error("Email Already Exist");
      }
      user = new Worker(req.body);

      //adding worker to review
      const review = new Review({ worker: user._id });
      await review.save();
    }
    if (req.query.role === "user") {
      const exist = await Worker.findOne({ email: req.body.email });
      if (exist) {
        throw new Error("Email Already Exist");
      }
      user = new User(req.body);
    }

    user = await user.hashPswd();
    await user.save();

    //Verify model
    const verify = new Verify({ otp: otp, user: user._id });
    verify.save();

    sendEmail(otp, req.body.email);
    res.status(201).send({ _id: user._id });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = registerUser;
