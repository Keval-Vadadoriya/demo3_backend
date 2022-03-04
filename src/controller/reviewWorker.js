// const User = require("../models/User");
// const Worker = require("../models/Worker");
// const Profession = require("../models/Profession");
const Review = require("../models/Review");
const reviewWorker = async (req, res) => {
  try {
    const review = await Review.findOne({ worker: req.params.id });
    if (!review) {
      throw new Error("dfhsdfh");
    }
    review.reviews.push(req.body);
    review.save();
    res.send(review.reviews);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = reviewWorker;
