const Worker = require("../models/Worker");

const getworker = async (req, res) => {
  try {
    const worker = await Worker.findOne({ _id: req.params.id });
    if (!worker) {
      throw new Error("No Worker Found");
    }
    res.send(worker);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = getworker;
