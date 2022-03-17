const Worker = require("../models/Worker");

const getallworkers = async (req, res) => {
  try {
    const workers = await Worker.find();
    if (workers.length === 0) {
      throw new Error("No Workers Found");
    }

    res.send(workers);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = getallworkers;
