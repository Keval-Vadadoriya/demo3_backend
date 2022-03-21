const User = require("../models/User");
const Worker = require("../models/Worker");
const Profession = require("../models/Profession");
const Review = require("../models/Review");

const registerUser = async (req, res) => {
  try {
    let user;
    console.log(req.body);
    // req.body.avatar = `uploads/${req.file.filename}`;
    if (req.query.role === "worker") {
      user = new Worker(req.body);

      //adding worker to review
      const review = new Review({ worker: user._id });
      await review.save();

      //adding worker to profession
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
    await user.save();
    const token = await user.generateAuthToken();
    res.status(201).send({ user, token });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = registerUser;
