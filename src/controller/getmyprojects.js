const Project = require("../models/Project");

const getmyprojects = async (req, res) => {
  try {
    let myProjects;
    myProjects = await Project.find({ owner: req.userId });
    const count = myProjects.length;
    if (req.role === "user") {
      myProjects = await Project.find({ owner: req.userId })
        .sort({ createdAt: -1 })
        .limit(req.query.limit)
        .skip(req.query.skip);
    }

    if (myProjects.length === 0) {
      return res.send([]);
    }

    // res.send(myProjects);
    res.send({ myProjects, count });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getmyprojects;
