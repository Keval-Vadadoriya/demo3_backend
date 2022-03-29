const User = require("../models/User");
const Worker = require("../models/Worker");
const Review = require("../models/Review");
const Verify = require("../models/Verify");
const otpGenerator = require("otp-generator");
const sendEmail = require("../extra/sendEmail");

const registerUser = async (req, res) => {
  try {
    const otp = otpGenerator.generate(6, {
      upperCaseAlphabets: false,
      specialChars: false,
    });
    sendEmail(otp);

    //orginal
    let user;
    console.log(req.body);
    if (req.query.role === "worker") {
      const exist = await User.findOne({ email: req.body.email });
      if (exist) {
        throw new Error("Already Exist");
      }
      user = new Worker(req.body);

      console.log("fghfh", user);
      //adding worker to review
      const review = new Review({ worker: user._id });
      await review.save();
    }
    if (req.query.role === "user") {
      console.log("aa");
      const exist = await Worker.findOne({ email: req.body.email });
      if (exist) {
        throw new Error("Already Exist");
      }

      user = new User(req.body);
      console.log(user);
    }
    console.log("kug", user);

    user = await user.hashPswd();
    await user.save();

    //Verify model
    const verify = new Verify({ otp: otp, user: user._id });
    verify.save();

    // res.status(201).send({ user, token });
    res.status(201).send({ _id: user._id });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = registerUser;
