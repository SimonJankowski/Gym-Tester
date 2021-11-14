const express = require("express");
const router = express.Router();

const Gym = require("../models/gym");
const gymsController = require("../controllers/gyms");
const asyncWraper = require("../helpers/asyncWraper");
const { isLoggedIn, isCreator, validateGym, lastPage } = require("../middleware.js")
const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router.route("/")
    .get(asyncWraper(gymsController.index))
    .post(isLoggedIn, upload.array("image"), validateGym, asyncWraper(gymsController.newGymRequest));


router.get("/new", isLoggedIn, gymsController.renderNewGymForm);

router.get('/search', asyncWraper(gymsController.gymSearch))

router.route("/:id")
    .get(lastPage, asyncWraper(gymsController.renderShowPage))
    .put(isLoggedIn, isCreator, upload.array("image"), validateGym, asyncWraper(gymsController.editGymRequest))
    .delete(isLoggedIn, asyncWraper(gymsController.deleteGymRequest));

router.get("/:id/edit", isLoggedIn, isCreator, asyncWraper(gymsController.renderEditForm));

module.exports = router;

//Gym.find({location: {$regex: cityName}});