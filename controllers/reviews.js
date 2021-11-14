const Review = require("../models/review");
const Gym = require("../models/gym");


module.exports.createReviewRequest = async (req, res) => {
    const gym = await Gym.findById(req.params.id);
    const review = new Review(req.body.review);
    review.creator = req.user._id;
    gym.reviews.push(review);
    await review.save();
    await gym.save();
    req.flash("success", `Thank you! Review added.`);
    res.redirect(`/gyms/${gym._id}`);
}

module.exports.deleteReviewRequest = async (req, res) => {
    const { id, reviewId } = req.params;
    await Gym.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });   // $pull operator pulls out of Gym any review that has an id that match from the line above
    await Review.findByIdAndDelete(reviewId);  //so here we have access to entire review that we can delete, not just an id
    req.flash("success", `You successfully deleted you review`);
    res.redirect(`/gyms/${id}`)
}