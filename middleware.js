const ExpError = require("./helpers/ExpError");
const Gym = require("./models/gym");
const { gymJoiSchema, reviewJoiSchema, GymbroJoiSchema } = require("./joiSchemas.js");
const Review = require("./models/review");

module.exports.lastPage = (req, res, next) => {
    req.session.returnTo = req.originalUrl;
    next();
}

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {                    ///method coming from passport           
        req.session.returnTo = req.originalUrl;
        req.flash("error", "You have to be signed in.");
        return res.redirect("/login")
    }
    next();
}

module.exports.isCreator = async (req, res, next) => {
    const { id } = req.params;
    const gym = await Gym.findById(id);
    if (!gym) {
        req.flash("error", "This gym doesnt have a creator");
        return res.redirect(`/gyms/${id}`)
    }
    if (!gym.creator.equals(req.user._id)) {
        req.flash("error", "You are not the author");
        return res.redirect(`/gyms/${id}`)
    }
    next();
}
module.exports.isReviewCreator = async (req, res, next) => {
    const { id, reviewId } = req.params;
    const review = await Review.findById(reviewId);
    if (!review.creator.equals(req.user._id)) {
        req.flash("error", "You are not the author");
        return res.redirect(`/gyms/${id}`)
    }
    next();
}

module.exports.validateGym = (req, res, next) => {
console.log(req.body)
    const { error } = gymJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpError(msg, 400)
    } else {
        next()
    }
}
module.exports.validateReview = (req, res, next) => {

    const { error } = reviewJoiSchema.validate(req.body);
    if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpError(msg, 400)
    } else {
        next()
    }
}

module.exports.validateGymbro = (req,res,next)=>{
console.log(req.body)
const { error } = GymbroJoiSchema.validate(req.body);
 if (error) {
        const msg = error.details.map(el => el.message).join(",")
        throw new ExpError(msg, 400)
    } else {
        next()
    }
}