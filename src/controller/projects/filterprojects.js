const Project = require("../../models/Project");

const filterprojects = async (req, res) => {
  try {
    if (req.role === "worker") {
      let projects, count;

      projects = await Project.find(req.query);

      count = projects.length;

      if (req.query.sort === "latest") {
        projects = await Project.find(req.query)
          .sort({ createdAt: -1 })
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else if (req.query.sort === "oldest") {
        projects = await Project.find(req.query)
          .sort({ createdAt: 1 })
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else if (req.query.sort === "highestPrice") {
        projects = await Project.find(req.query)
          .sort({ money: -1 })
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else if (req.query.sort === "lowestPrice") {
        projects = await Project.find(req.query)
          .sort({ money: 1 })
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else {
        projects = await Project.find(req.query)
          .limit(req.query.limit)
          .skip(req.query.skip);
      }
      if (Number(req.query.skip) !== 0) {
        count = 0;
      }

      if (projects.length === 0) {
        return res.send({ projects: [], count: 1 });
      }
      res.send({ projects, count });
    } else {
      return res.status(401).send({ Error: "Unauthorized access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = filterprojects;
