//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

//controllers

const postproject = require("../controller/postproject");
const getallprojects = require("../controller/getallprojects");
const getmyprojects = require("../controller/getmyprojects");
const filterprojects = require("../controller/filterprojects");
const removeproject = require("../controller/removeproject");
const projectsRouter = express.Router();

//post project
projectsRouter.post("/project", auth, postproject);

//get all project
projectsRouter.get("/getallprojects", auth, getallprojects);

//my projects
projectsRouter.get("/getmyprojects", auth, getmyprojects);

//filter project
projectsRouter.get("/filterprojects", auth, filterprojects);

//remove project
projectsRouter.delete("/removeproject/:projectid", auth, removeproject);

module.exports = projectsRouter;
