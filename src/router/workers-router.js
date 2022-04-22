//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

//controllers
const reviewWorker = require("../controller/worker/reviewWorker");
const getreviews = require("../controller/worker/getreviews");
const getallworkers = require("../controller/worker/getallworkers");
const filterworkers = require("../controller/worker/filterworkers");
const getworker = require("../controller/worker/getworker");

const router = express.Router();

router.get("/", async (req, res) => {
  let data = { name: "Welcome" };
  res.send(data);
});

//Reviews
router.post("/review/:workerId", auth, reviewWorker);

//get all reviews
router.get("/getreview/:workerId", auth, getreviews);

//get all workers
router.get("/getallworkers", auth, getallworkers);

//get worker
router.get("/getworker/:workerId", auth, getworker);

//get all workers
router.get("/filterworkers", auth, filterworkers);

module.exports = router;
