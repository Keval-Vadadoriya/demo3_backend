const Project = require("../models/Project");

const filterprojects = async (req, res) => {
  try {
    let projects, count;
    if (req.role === "worker") {
      if (req.query.money || Number(req.query.money) === 0) {
        console.log("yes");
        const parameters = JSON.parse(JSON.stringify(req.query));
        delete parameters.money;
        projects = await Project.find({
          money: { $gte: req.query.money },
          ...parameters,
        });
      } else {
        console.log("no");
        projects = await Project.find(req.query);
      }
    }
    count = projects.length;

    if (req.role === "worker") {
      if (req.query.money || Number(req.query.money) === 0) {
        console.log("yes");
        const parameters = JSON.parse(JSON.stringify(req.query));
        delete parameters.money;
        projects = await Project.find({
          money: { $gte: req.query.money },
          ...parameters,
        })
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else {
        console.log("no");
        projects = await Project.find(req.query)
          .limit(req.query.limit)
          .skip(req.query.skip);
      }
    }
    if (req.query.length !== 0) {
      count = 0;
    }

    console.log(projects);
    if (projects.length === 0) {
      return res.send([]);
    }
    res.send({ projects, count });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = filterprojects;
