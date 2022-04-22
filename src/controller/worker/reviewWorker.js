const Worker = require("../../models/Worker");
const Review = require("../../models/Review");
const { default: mongoose } = require("mongoose");
const reviewWorker = async (req, res) => {
  try {
    if (req.role === "user") {
      const review = await Review.findOne({ worker: req.params.workerId });
      review.reviews.push(req.body);

      await review.save();
      const averageReview = await Review.aggregate([
        { $unwind: "$reviews" },
        { $match: { worker: mongoose.Types.ObjectId(req.params.workerId) } },
        {
          $group: {
            _id: "$worker",
            averageReview: { $avg: "$reviews.review" },
          },
        },
      ]);

      const worker = await Worker.findOne({ worker: req.params.workerId });
      worker.review = averageReview[0]?.averageReview;
      worker.save();
      res.status(200).send(review.reviews);
    } else {
      return res.status(401).send({ Error: "Unauthorized Access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = reviewWorker;
