const express = require("express");
const router = express.Router();
const asyncWraper = require("../helpers/asyncWraper");
const passport = require("passport");
const gymbrosController = require("../controllers/gymbros")
const { lastPage, validateGymbro } = require("../middleware.js")

router.route("/register")
    .get(gymbrosController.renderRegisterForm)
    .post(validateGymbro, asyncWraper(gymbrosController.registerGymbroRequest))

router.route("/login")
    .get(gymbrosController.renderLoginForm)
    .post(passport.authenticate("local", { failureFlash: true, failureRedirect: "/login" }), gymbrosController.loginRequest);

router.get("/logout", gymbrosController.logoutRequest);

module.exports = router;