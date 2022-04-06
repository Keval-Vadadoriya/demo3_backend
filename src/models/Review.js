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
        unique: true,
        ref: "User",
      },
    },
  ],
});
// reviewSchema.path('reviews.owner').validate(function(value, respond) {
//   mongoose.models["Review"].findOne({ reviews.owner: value }, function(err, exists) {
//     respond(!!exists);
//   });
// }, 'Profile ID already exists');

const Review = mongoose.model("Review", reviewSchema);

module.exports = Review;
