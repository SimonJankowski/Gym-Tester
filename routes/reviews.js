const express = require("express");
const router = express.Router({ mergeParams: true });

const reviewsController = require("../controllers/reviews")
const asyncWraper = require("../helpers/asyncWraper");
const { isLoggedIn, validateReview, isReviewCreator } = require("../middleware.js")

router.post("/", isLoggedIn, validateReview, asyncWraper(reviewsController.createReviewRequest))

router.delete("/:reviewId", isLoggedIn, isReviewCreator, asyncWraper(reviewsController.deleteReviewRequest))

module.exports = router;