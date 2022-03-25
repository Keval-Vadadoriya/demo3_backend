const Worker = require("../models/Worker");

const filterworkers = async (req, res) => {
  try {
    let workers, count;
    console.log(req.query);
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
      throw new Error("No Workers Found");
    }
    if (req.query.skip !== "0") {
      count = null;
    }
    console.log(count);
    setTimeout(() => {
      return res.send({ workers, count });
    }, 5000);
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = filterworkers;
