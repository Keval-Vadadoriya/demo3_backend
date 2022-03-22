const User = require("../models/User");
const Worker = require("../models/Worker");
const Review = require("../models/Review");

const registerUser = async (req, res) => {
  try {
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
