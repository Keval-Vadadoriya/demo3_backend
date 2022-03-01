//Express
const express = require("express");

//models
const User = require("../models/User");

//Authentication
const auth = require("../middleware/Auth");

//controllers
const registerUser = require("../controller/registerUser");
const loginUser = require("../controller/loginUser");

const router = express.Router();

router.get("/", async (req, res) => {
  let x = { name: "Welcome" };
  res.send(x);
});

//   register user
router.post("/signup", registerUser);

//   login user
router.post("/login", loginUser);

module.exports = router;
