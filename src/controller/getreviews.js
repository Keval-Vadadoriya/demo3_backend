const Review = require("../models/Review");

const getreviews = async (req, res) => {
  try {
    const review = await Review.findOne({
      worker: req.params.workerId,
    }).populate({
      path: "reviews.owner",
    });
    if (!review) {
      throw new Error("No Reviews");
    }
    const reviews = review.reviews.reverse();
    res.send(reviews);
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getreviews;
