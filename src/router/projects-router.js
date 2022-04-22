//Express
const express = require("express");

//Authentication
const auth = require("../middleware/Auth");

//controllers

const postproject = require("../controller/projects/postproject");
const getallprojects = require("../controller/projects/getallprojects");
const getmyprojects = require("../controller/projects/getmyprojects");
const filterprojects = require("../controller/projects/filterprojects");
const removeproject = require("../controller/projects/removeproject");
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
