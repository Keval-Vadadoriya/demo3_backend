//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

//controllers
const registerUser = require("../controller/registerUser");
const verifyUser = require("../controller/verifyUser");

const verifyrouter = express.Router();

//   register user
verifyrouter.post("/signup", registerUser);

verifyrouter.get("/verify", verifyUser);

module.exports = verifyrouter;
