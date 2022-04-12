const Worker = require("../models/Worker");

const getallworkers = async (req, res) => {
  try {
    let workers, search;

    if (req.params.search === "null") {
      workers = await Worker.find();
    } else {
      search = new RegExp(req.params.search, "i");

      workers = await Worker.find({ name: { $regex: search } });
    }
    let count = workers.length;
    if (req.params.search === "null") {
      workers = await Worker.find().limit(req.query.limit).skip(req.query.skip);
    } else {
      workers = await Worker.find({ name: { $regex: search } })
        .limit(req.query.limit)
        .skip(req.query.skip);
    }

    console.log(workers);
    if (workers.length === 0) {
      workers = [];
      // throw new Error("No Workers Found");
    }
    console.log(req.query.skip);
    if (req.query.skip !== "0") {
      count = 0;
    }

    res.send({ workers, count });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getallworkers;
