const Project = require("../../models/Project");
const postproject = async (req, res) => {
  try {
    if (req.role === "user") {
      let project;
      req.body.owner = req.userId;
      project = new Project(req.body);

      await project.save();

      const projects = await Project.find().sort({ createdAt: -1 });

      res.status(201).send({ projects });
    } else {
      return res.status(401).send({ Error: "Unauthorized access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = postproject;
