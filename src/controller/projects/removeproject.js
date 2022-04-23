const Project = require("../../models/Project");
const removeproject = async (req, res) => {
  try {
    if (req.role === "user") {
      let project;

      project = await Project.findOneAndDelete({
        _id: req.params.projectid,
        owner: req.userId,
      });

      const projects = await Project.find().sort({ createdAt: -1 });

      res.status(200).send({ projects });
    } else {
      return res.status(401).send({ Error: "Unauthorized access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = removeproject;
