const Project = require("../models/Project");

const getallprojects = async (req, res) => {
  try {
    if (req.role === "worker") {
      let projects, search;
      if (req.query.search === "null") {
        projects = await Project.find();
      } else {
        search = new RegExp(req.query.search, "i");
        projects = await Project.find({ project_name: { $regex: search } });
      }
      const count = projects.length;

      if (req.query.search === "null") {
        projects = await Project.find()
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else {
        projects = await Project.find({ project_name: { $regex: search } })
          .limit(req.query.limit)
          .skip(req.query.skip);
      }

      if (projects.length === 0) {
        projects = [];
      }

      res.send({ projects, count });
    } else {
      return res.status(401).send({ Error: "Unauthorized Access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getallprojects;
