const User = require("../models/User");
const Worker = require("../models/Worker");

const loginUser = async (req, res) => {
  try {
    let user = null;
    if (req.query.role === "worker") {
      user = await Worker.verifyWorker(req.body.email, req.body.password);
    } else {
      user = await User.verifyUser(req.body.email, req.body.password);
    }
    const token = await user.generateAuthToken();
    res.send({ user, token });
  } catch (e) {
    res.status(400).send({ Error: e.message });
  }
};

module.exports = loginUser;
