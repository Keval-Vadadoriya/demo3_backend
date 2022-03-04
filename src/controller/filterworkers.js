const Profession = require("../models/Profession");

const filterworkers = async (req, res) => {
  try {
    const workers = await Profession.find({
      profession: req.query.profession,
    }).populate({
      path: "workers",
      match: {
        address: req.query.address,
      },
    });
    if (workers.length === 0) {
      throw new Error("No Workers Found");
    }
    res.send(workers[0].workers);
  } catch (e) {
    res.status(400).send(e.message);
  }
};

module.exports = filterworkers;
