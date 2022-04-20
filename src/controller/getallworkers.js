const Worker = require("../models/Worker");

const getallworkers = async (req, res) => {
  try {
    if (req.role === "user") {
      let workers, search;

      if (req.query.search === "null") {
        workers = await Worker.find();
      } else {
        search = new RegExp(req.query.search, "i");

        workers = await Worker.find({ name: { $regex: search } });
      }
      let count = workers.length;
      if (req.query.search === "null") {
        workers = await Worker.find()
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else {
        workers = await Worker.find({ name: { $regex: search } })
          .limit(req.query.limit)
          .skip(req.query.skip);
      }

      if (workers.length === 0) {
        workers = [];
      }
      if (req.query.skip !== "0") {
        count = 0;
      }

      res.send({ workers, count });
    } else {
      return res.status(401).send({ Error: "Unauthorized Access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getallworkers;
