const Project = require("../models/Project");
const postproject = async (req, res) => {
  try {
    let project;
    if (req.role === "user") {
      req.body.owner = req.userId;
      project = new Project(req.body);
    }else{
      return res.status(401).send({Error:"Unauthorized access"})
    }

    await project.save();

    res.status(201).send(project);
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = postproject;
