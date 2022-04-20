//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

//controllers
const reviewWorker = require("../controller/reviewWorker");
const getreviews = require("../controller/getreviews");
const getallworkers = require("../controller/getallworkers");
const filterworkers = require("../controller/filterworkers");
const getworker = require("../controller/getworker");

const router = express.Router();

router.get("/", async (req, res) => {
  let data = { name: "Welcome" };
  res.send(data);
});

//Reviews
router.post("/review/:workerId", auth, reviewWorker);

// //edit profile
// router.patch("/editprofile/:id", [uploadFile, auth], editprofile);

// //get profile
// router.get("/getprofile", auth, getprofile);

//get all reviews
router.get("/getreview/:workerId", auth, getreviews);

//get all workers
router.get("/getallworkers", auth, getallworkers);

//get worker
router.get("/getworker/:workerId", auth, getworker);

//get all workers
router.get("/filterworkers", auth, filterworkers);

module.exports = router;
