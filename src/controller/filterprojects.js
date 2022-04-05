const { query } = require("express");
const Project = require("../models/Project");

const filterprojects = async (req, res) => {
  try {
    let projects, count;
    if (req.role === "worker") {
      if (req.query.money || Number(req.query.money) === 0) {
        const parameters = JSON.parse(JSON.stringify(req.query));
        delete parameters.money;
        projects = await Project.find({
          money: { $gte: req.query.money },
          ...parameters,
        });
      } else {
        projects = await Project.find(req.query);
      }
    }
    count = projects.length;
    console.log(req.query);
    if (req.role === "worker") {
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
    }
    console.log("lng", projects.length);
    if (Number(req.query.skip) !== 0) {
      count = 0;
    }

    if (projects.length === 0) {
      return res.send({ projects: [], count: 0 });
    }
    console.log(count);
    res.send({ projects, count });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = filterprojects;
