const User = require("../models/User");
const Worker = require("../models/Worker");
const Review = require("../models/Review");
const Verify = require("../models/Verify");
const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  try {
    const rand = Math.floor(Math.random() * 100 + 54);
    const link = "http://" + req.get("host") + "/verify?id=" + rand;
    async function main() {
      let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 465,
        secure: true,
        auth: {
          user: "demoproject2608@gmail.com",
          pass: "7433985751",
        },
      });

      let info = await transporter.sendMail({
        from: "demoproject2608@gmail.com",
        to: "keval.180410107122@gmail.com",
        subject: "Please confirm your Email account",
        text: "Hello world?",
        html:
          "Hello,<br> Please Click on the link to verify your email.<br><a href=" +
          link +
          ">Click here to verify</a>",
      });

      console.log("Message sent: %s", info.messageId);
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }

    main().catch(console.error);

    //orginal
    let user;
    console.log(req.body);
    if (req.query.role === "worker") {
      user = new Worker(req.body);

      //adding worker to review
      const review = new Review({ worker: user._id });
      await review.save();
    } else {
      user = new User(req.body);
    }

    user = await user.hashPswd();
    await user.save();
    const token = await user.generateAuthToken(req.query.role);

    //Verify model
    const verify = new Verify({ hash: rand, user: user._id });
    verify.save();

    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = registerUser;
