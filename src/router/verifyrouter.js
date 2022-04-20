//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

const path = require("path");
const multer = require("multer");

//controllers
const registerUser = require("../controller/registerUser");
const verifyUser = require("../controller/verifyUser");
const verifyPassword = require("../controller/verifyPassword");
const forgotPassword = require("../controller/forgotPassword");
const loginUser = require("../controller/loginUser");
const editprofile = require("../controller/editprofile");
const getprofile = require("../controller/getprofile");

const verifyrouter = express.Router();

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
    cb(new Error("Invalid file formate"), false);
  }
};

const upload = multer({
  storage: storage,
  fileFilter: filefilter,
  limits: {
    fileSize: 104858, // 1 Mb
  },
}).single("avatar");

const uploadFile = async (req, res, next) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(400).send({ Error: err.message });
    }
    next();
  });
};

//edit profile
verifyrouter.patch("/editprofile/:id", [uploadFile, auth], editprofile);

//get profile
verifyrouter.get("/getprofile", auth, getprofile);

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
