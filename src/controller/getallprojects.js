const Project = require("../models/Project");

const getallprojects = async (req, res) => {
  try {
    let projects;
    const cw = await Project.find();
    const count = cw.length;
    console.log(count);
    if (req.role === "worker") {
      projects = await Project.find()
        .limit(req.query.limit)
        .skip(req.query.skip);
    }
    //

    console.log(projects);
    if (projects.length === 0) {
      throw new Error("No Workers Found");
    }

    res.send({ projects, count });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getallprojects;
