//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

//controllers
const registerUser = require("../controller/registerUser");
const verifyUser = require("../controller/verifyUser");
const verifyPassword = require("../controller/verifyPassword");
const forgotPassword = require("../controller/forgotPassword");

const verifyrouter = express.Router();

//   register user
verifyrouter.post("/signup", registerUser);

verifyrouter.post("/verify/:otp", verifyUser);

verifyrouter.post("/verifyPassword/:otp", verifyPassword);

verifyrouter.post("/forgotPassword", forgotPassword);

module.exports = verifyrouter;
