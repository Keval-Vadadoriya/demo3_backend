const Project = require("../models/Project");
const removeproject = async (req, res) => {
  try {
    let project;

    if (req.role === "user") {
      project = await Project.findOneAndDelete({
        _id: req.params.projectid,
        owner: req.userId,
      });
    }else{
      return res.status(401).send({Error:"Unauthorized access"})

    }

    res.status(200).send(project);
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = removeproject;
