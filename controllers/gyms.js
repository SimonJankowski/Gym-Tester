const Gym = require("../models/gym");
const cloudinary = require('cloudinary').v2;
const helper = require("../helpers/timeago")
const mbxGeocoding = require('@mapbox/mapbox-sdk/services/geocoding');
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeocoding({ accessToken: mapBoxToken });
const avRating = require("../helpers/avRating")

module.exports.index = async (req, res) => {
    const gyms = await Gym.find({});
    res.render("gyms/index", { gyms })
}

module.exports.renderNewGymForm = (req, res) => {
    res.render("gyms/new")
}

module.exports.renderShowPage = async (req, res) => {
    const gym = await Gym.findById(req.params.id).populate({
        path: "reviews",
        populate: {
            path: "creator"
        }
    }).populate("creator");
    if (!gym) {
        req.flash("error", "This gym doesn't exist")
        res.redirect("/gyms")
    }
    const scores = avRating(gym.reviews);
    res.render("gyms/show", { gym, helper, scores })
}

module.exports.newGymRequest = async (req, res, next) => {
    const geoData = await geocoder.forwardGeocode({
        query: req.body.gym.location,
        limit: 1
    }).send()
    const gym = new Gym(req.body.gym);
    gym.geometry = geoData.body.features[0].geometry;
    gym.images = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.creator = req.user._id;
    gym.save();
    console.log(gym)
    req.flash("success", "You successfully added new gym!");  //this is just addind this message to te request, not displaying
    res.redirect(`/gyms/${gym._id}`)
}

module.exports.renderEditForm = async (req, res, next) => {
    const gym = await Gym.findById(req.params.id);
    if (!gym) {
        req.flash("error", "This gym doesn't exist")
        res.redirect("/gyms")
    }
    res.render("gyms/edit", { gym })
}

module.exports.editGymRequest = async (req, res, next) => {
    const { id } = req.params;
    const gym = await Gym.findByIdAndUpdate(id, { ...req.body.gym });
    const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
    gym.images.push(...imgs);
    await gym.save();
    if (req.body.deleteImages) {
        for (let filename of req.body.deleteImages) {
            await cloudinary.uploader.destroy(filename);
        }
        await gym.updateOne({ $pull: { images: { filename: { $in: req.body.deleteImages } } } }) ///I know!! what a query
        console.log(gym);
    }

    req.flash("success", `You successfully updated ${gym.name}!`);
    res.redirect(`/gyms/${gym._id}`)
}

module.exports.deleteGymRequest = async (req, res) => {
    const { id } = req.params;
    const { name } = await Gym.findById(req.params.id);   // I took it just to include in the flash msg
    await Gym.findByIdAndDelete(id);
    req.flash("success", `You successfully deleted ${name}!`);
    res.redirect("/gyms")
}
module.exports.gymSearch = async (req, res) => {
    const { cityName } = req.query;
    const gyms = await Gym.find({
        "$or": [
            { name: { '$regex': cityName, '$options': 'i' } },
            { location: { '$regex': cityName, '$options': 'i' } }
        ]
    });
    res.render('gyms', { gyms, cityName});
}
