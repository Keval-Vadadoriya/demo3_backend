//Express
const express = require("express");

//controllers
const registerUser = require("../controller/registerUser");
const loginUser = require("../controller/loginUser");
const reviewWorker = require("../controller/reviewWorker");
const getreviews = require("../controller/getreviews");
const getallworkers = require("../controller/getallworkers");
const filterworkers = require("../controller/filterworkers");
const getworker = require("../controller/getworker");
const getchatlist = require("../controller/getchatlist");
const addtochatlist = require("../controller/addtochatlist");

const router = express.Router();

router.get("/", async (req, res) => {
  let x = { name: "Welcome" };
  res.send(x);
});

//   register user
router.post("/signup", registerUser);

//   login user
router.post("/login", loginUser);

//Reviews
router.post("/review/:id", reviewWorker);

//add to chat-list
router.post("/addtochatlist/:id", addtochatlist);

//get all reviews
router.get("/getreview/:id", getreviews);

//get all workers
router.get("/getallworkers", getallworkers);

//get worker
router.get("/getworker/:id", getworker);

//get all workers
router.get("/filterworkers", filterworkers);

//get chat-list
router.get("/getchatlist/:id", getchatlist);

module.exports = router;
