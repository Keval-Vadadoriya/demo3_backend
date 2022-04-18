const Worker = require("../models/Worker");

const getworker = async (req, res) => {
  try {
    const worker = await Worker.findOne({ _id: req.params.workerId });
    if (!worker) {
        return res.status(404).send('no Worker found')
    }
    res.send(worker);
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = getworker;
