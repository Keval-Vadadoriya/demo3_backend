const User = require("../models/User");
const Worker = require("../models/Worker");
const Profession = require("../models/Profession");
const Review = require("../models/Review");

const registerUser = async (req, res) => {
  try {
    let user;

    if (req.body.profession) {
      user = new Worker(req.body);
      const review = new Review({ worker: user._id });
      await review.save();
      let profession = await Profession.findOne({
        profession: req.body.profession,
      });

      if (profession) {
        profession.workers.push(user._id);
      } else {
        profession = new Profession({
          profession: req.body.profession,
          workers: [user._id],
        });
      }

      await profession.save();
    } else {
      user = new User(req.body);
    }

    user = await user.hashPswd();

    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    res.status(400).send(e);
  }
};

module.exports = registerUser;
