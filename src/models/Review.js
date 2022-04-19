const mongoose = require("../database/mongoose");

const reviewSchema = mongoose.Schema({
  worker: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Worker",
  },
  reviews: [
    {
      description: {
        type: String,
      },
      review: {
        type: Number,
        max: 5,
      },
      owner: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    },
  ],
});

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
