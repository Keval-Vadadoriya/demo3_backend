const mongoose = require("../database/mongoose");
// const validator = require("validator");
// const bcrypt = require("bcrypt");
// const jwt = require("jsonwebtoken");

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

const Project = mongoose.model("Project", projectSchema);

module.exports = Project;
