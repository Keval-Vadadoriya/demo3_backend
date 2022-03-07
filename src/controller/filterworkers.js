const Profession = require("../models/Profession");
const Worker = require("../models/Worker");

const filterworkers = async (req, res) => {
  try {
    let workers;
    if (req.query.review) {
      const parameters = req.query;
      delete parameters.review;
      console.log(parameters, req.query);
      workers = await Worker.find({
        review: { $gte: req.query.review },
        ...parameters,
      });
    } else {
      workers = await Worker.find({
        ...req.query,
      });
    }

    if (workers.length === 0) {
      throw new Error("No Workers Found");
    }
    res.send(workers);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = filterworkers;
