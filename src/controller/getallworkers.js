const Worker = require("../models/Worker");

const getallworkers = async (req, res) => {
  try {
    const cw = await Worker.find();
    const count = cw.length;
    console.log(count);

    const workers = await Worker.find()
      .limit(req.query.limit)
      .skip(req.query.skip);

    console.log(workers);
    if (workers.length === 0) {
      throw new Error("No Workers Found");
    }

    res.send({ workers, count });
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getallworkers;
