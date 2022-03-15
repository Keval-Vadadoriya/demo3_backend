// const User = require("../models/User");
const Worker = require("../models/Worker");
// const Profession = require("../models/Profession");
const Review = require("../models/Review");
const { default: mongoose } = require("mongoose");
const reviewWorker = async (req, res) => {
  try {
    const review = await Review.findOne({ worker: req.params.id });
    review.reviews.push(req.body);
    console.log(req.body);

    console.log();

    await review.save();
    const xyz = await Review.aggregate([
      { $unwind: "$reviews" },
      { $match: { worker: mongoose.Types.ObjectId(req.params.id) } },
      {
        $group: {
          _id: "$worker",
          averageReview: { $avg: "$reviews.review" },
        },
      },
    ]);

    const worker = await Worker.findOne({ worker: req.params.id });
    worker.review = xyz[0].averageReview;
    worker.save();
    console.log(review);
    res.send();
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = reviewWorker;
