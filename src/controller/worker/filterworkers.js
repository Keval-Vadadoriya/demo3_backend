const Worker = require("../../models/Worker");

const filterworkers = async (req, res) => {
  try {
    if (req.role === "user") {
      let workers, count;
      if (req.query.review) {
        const parameters = JSON.parse(JSON.stringify(req.query));
        delete parameters.review;
        workers = await Worker.find({
          review: { $gte: req.query.review },
          ...parameters,
        });
      } else {
        workers = await Worker.find({
          ...req.query,
        });
      }
      count = workers.length;

      if (req.query.review) {
        const parameters = JSON.parse(JSON.stringify(req.query));
        delete parameters.review;
        workers = await Worker.find({
          review: { $gte: req.query.review },
          ...parameters,
        })
          .limit(req.query.limit)
          .skip(req.query.skip);
      } else {
        workers = await Worker.find({
          ...req.query,
        })
          .limit(req.query.limit)
          .skip(req.query.skip);
      }

      if (workers.length === 0) {
        workers = [];
        count = 1;
      }
      if (req.query.skip !== "0") {
        count = 0;
      }
      res.send({ workers, count });
    } else {
      return res.status(401).send({ Error: "Unauthorized access" });
    }
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = filterworkers;
