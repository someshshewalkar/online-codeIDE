var express = require("express");
var router = express.Router();
var bcrypt = require("bcryptjs");
var jwt = require("jsonwebtoken");
var userModel = require("../models/userModel");
var projectModel = require("../models/projectModel");

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});
const secret = "secret";

router.post("/signup", async (req, res) => {
  let { username, name, email, password } = req.body;
  let emailCon = await userModel.findOne({ email: email });
  if (emailCon) {
    res.json({ success: false, message: "Email already exists" });
  } else {
    bcrypt.genSalt(10, function (err, salt) {
      bcrypt.hash(password, salt, function (err, hash) {
        // Store hash in your password DB.
        let user = userModel.create({
          username: username,
          name: name,
          email: email,
          password: hash,
        });
        res.json({ success: true, message: "User created Successfully" });
      });
    });
  }
});

router.post("/login", async (req, res) => {
  let { email, password } = req.body;
  let user = await userModel.findOne({ email: email });
  if (user) {
    bcrypt.compare(password, user.password, function (err, result) {
      // result == true
      if (err) {
        return res.json({
          success: fase,
          message: "an error occured",
          error: err,
        });
      }
      if (result) {
        let token = jwt.sign({ email: user.email, userId: user._id }, secret);
        return res.json({
          success: true,
          message: "User Logged in successfully",
          token: token,
          userId: user._id,
        });
      } else {
        return res.json({
          success: false,
          message: "Invalid email or password",
        });
      }
    });
  } else {
    return res.json({ success: false, message: "User not found" });
  }
});

router.post("/getuserDetails", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    return res.json({
      success: true,
      message: "user detail fetched succesfully",
      user: user,
    });
  } else {
    return res.json({ success: false, message: "user not found" });
  }
});

router.post("/createProj", async (req, res) => {
  let { userId, title } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.create({
      title: title,
      createdBy: userId,
    });
    console.log(project);
    return res.json({
      success: true,
      message: "project created succesfully",
      projectId: project._id,
    });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getProjects", async (req, res) => {
  let { userId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let projects = await projectModel.find({ createdBy: userId });
    return res.json({
      success: true,
      message: "project fetched succesfully",
      projects: projects,
    });
  } else {
    return res.json({ success: false, message: "project is not found" });
  }
});

router.post("/deleteProject", async (req, res) => {
  let { userId, progId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOneAndDelete({ _id: progId });
    return res.json({ success: true, message: "Project deleted successfully" });
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

router.post("/getproject", async (req, res) => {
  let { userId, projId } = req.body;
  let user = await userModel.findOne({ _id: userId });
  if (user) {
    let project = await projectModel.findOne({ _id: projId });
    return res.json({
      success: true,
      message: "Project fetched succesfully",
      project: project,
    });
  } else {
    return res.json({ success: false, message: "project is not found" });
  }
});

router.post("/updateProject", async (req, res) => {
  let { userId, htmlCode, cssCode, jsCode, projId } = req.body;
  let user = await userModel.findOne({ _id: userId });

  if (user) {
    let project = await projectModel.findOneAndUpdate(
      { _id: projId },
      { htmlCode: htmlCode, cssCode: cssCode, jsCode: jsCode },
      { new: true } // This option returns the updated document
    );

    if (project) {
      return res.json({
        success: true,
        message: "Project updated successfully",
      });
    } else {
      return res.json({ success: false, message: "Project not found!" });
    }
  } else {
    return res.json({ success: false, message: "User not found!" });
  }
});

module.exports = router;
