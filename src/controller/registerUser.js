const User = require("../models/User");
const Worker = require("../models/Worker");
const Review = require("../models/Review");
// const nodemailer = require("nodemailer");

const registerUser = async (req, res) => {
  try {
    // async function main() {
    //   let transporter = nodemailer.createTransport({
    //     host: "smtp.gmail.com",
    //     port: 465,
    //     secure: true,
    //     auth: {
    //       user: "demoproject2608@gmail.com",
    //       pass: "7433985751",
    //     },
    //   });

    //   let info = await transporter.sendMail({
    //     from: "demoproject2608@gmail.com",
    //     to: "keval.180410107122@gmail.com",
    //     subject: "Hello ✔",
    //     text: "Hello world?",
    //     html: "<b>Hello world?</b>",
    //   });

    //   console.log("Message sent: %s", info.messageId);
    //   console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    // }

    // main().catch(console.error);

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

    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = registerUser;
