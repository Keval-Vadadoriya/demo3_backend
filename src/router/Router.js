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
const getchats = require("../controller/getchats");
const addtochatlist = require("../controller/addtochatlist");
const editprofile = require("../controller/editprofile");
const router = express.Router();
const path = require("path");
const multer = require("multer");

router.get("/", async (req, res) => {
  let x = { name: "Welcome" };
  res.send(x);
});

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});

const filefilter = (req, file, cb) => {
  if (
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/png"
  ) {
    cb(null, true);
  } else {
    cb(new Error("Ivalid file formate"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: 1000000,
});

//   register user
router.post("/signup", upload.single("avatar"), registerUser);

//   login user
router.post("/login", loginUser);

//Reviews
router.post("/review/:id", reviewWorker);

//add to chat-list
router.post("/addtochatlist/:id", addtochatlist);

//edit profile
router.post("/editprofile/:id", editprofile);

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

//get chats
router.get("/getchats/:id", getchats);

module.exports = router;
