//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

const path = require("path");
const multer = require("multer");

//controllers
const registerUser = require("../controller/user/registerUser");
const verifyUser = require("../controller/user/verifyUser");
const verifyPassword = require("../controller/user/verifyPassword");
const forgotPassword = require("../controller/user/forgotPassword");
const loginUser = require("../controller/user/loginUser");
const editprofile = require("../controller/user/editprofile");
const getprofile = require("../controller/user/getprofile");

const router = express.Router();

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
router.patch("/editprofile/:id", [uploadFile, auth], editprofile);

//get profile
router.get("/getprofile", auth, getprofile);

//register user
router.post("/signup", registerUser);

//login user
router.post("/login", loginUser);

//verify user
router.post("/verify/:otp", verifyUser);

//verify password
router.post("/verifyPassword/:otp", verifyPassword);

//forgot password
router.post("/forgotPassword", forgotPassword);

module.exports = router;
