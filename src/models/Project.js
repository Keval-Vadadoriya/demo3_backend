const mongoose = require("../database/mongoose");

const projectSchema = mongoose.Schema(
  {
    project_name: {
      type: String,
      unique: true,
      required: true,
    },

    description: {
      type: String,
      default: "",
    },

    profession: {
      type: String,
      required: true,
    },
    location: {
      type: String,
      required: true,
    },
    money: {
      type: Number,
      default: 0,
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
  },
  {
    timestamps: true,
  }
);

projectSchema.post("save", function (error, doc, next) {
  if (error.code === 11000) {
    next(new Error("Project Name Already Exists"));
  } else {
    next();
  }
});

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
