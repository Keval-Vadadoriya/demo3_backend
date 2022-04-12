//Express
const express = require("express");

//controllers
const registerUser = require("../controller/registerUser");
const verifyUser = require("../controller/verifyUser");
const verifyPassword = require("../controller/verifyPassword");
const forgotPassword = require("../controller/forgotPassword");
const loginUser = require("../controller/loginUser");

const verifyrouter = express.Router();

//register user
verifyrouter.post("/signup", registerUser);

//login user
verifyrouter.post("/login", loginUser);

//verify user
verifyrouter.post("/verify/:otp", verifyUser);

//verify password
verifyrouter.post("/verifyPassword/:otp", verifyPassword);

//forgot password
verifyrouter.post("/forgotPassword", forgotPassword);

module.exports = verifyrouter;
