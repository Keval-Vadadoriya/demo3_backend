const Worker = require("../models/Worker");
const Review = require("../models/Review");
const { default: mongoose } = require("mongoose");
const reviewWorker = async (req, res) => {
  try {
    const review = await Review.findOne({ worker: req.params.id });
    review.reviews.push(req.body);

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
    res.status(200).send(review.reviews);
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = reviewWorker;
