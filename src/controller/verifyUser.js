const Worker = require("../models/Worker");
const User = require("../models/User");
const Verify = require("../models/Verify");

const verifyUser = async (req, res) => {
  try {
    let user;
    console.log("Domain is matched. Information is from Authentic email");
    const verify = await Verify.findOne({ hash: req.query.id });
    if (verify) {
      console.log("email is verified");
      user = await User.findOne({ _id: verify.user });
      if (!user) {
        user = await Worker.findOne({ _id: verify.user });
      }
      if (!user) {
        throw new Error("Invalid");
      } else {
        user.active = true;
        await user.save();
        await Verify.findOneAndDelete({ hash: req.query.id });
      }
      res.send("<h1>Successful</h1>");
    } else {
      throw new Error("Invalid2");
    }
  } catch (e) {
    console.log(e.message);
    res.status(400).send({ Error: e.message });
  }
};

module.exports = verifyUser;
