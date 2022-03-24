const Project = require("../models/Project");
const postproject = async (req, res) => {
  try {
    let project;
    console.log(req.body);
    if (req.role === "user") {
      req.body.owner = req.userId;
      project = new Project(req.body);
    }

    await project.save();

    res.status(200).send(project);
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = postproject;
