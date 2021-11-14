const mongoose = require("mongoose");
const Schema = mongoose.Schema;  //just to short up further instructions
const Review = require("./review")

const ImageSchema = new Schema({
    url: String,
    filename: String
})
ImageSchema.virtual("thumbnail").get(function () {
    return this.url.replace("/upload", "/upload/w_100");
})

const options = { toJSON: { virtuals: true } };

const GymSchema = new Schema({
    name: String,
    type: String,
    geometry: {
        type: {
            type: String,
            enum: ["Point"],
            required: true
        },
        coordinates: {
            type: [Number],
            required: true
        }
    },
    images: [ImageSchema],
    price: Number,
    description: String,
    location: String,
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Gymbro"
    },
    reviews: [{
        type: Schema.Types.ObjectId,
        ref: "Review"
    }]
}, options);

GymSchema.virtual("properties.popUpMarkup").get(function () {
    return `<a href="/gyms/${this._id}"><center>${this.name}</center></a><p>${this.location}</p>`;
})

GymSchema.post("findOneAndDelete", async function (doc) {  //from mongoose docs !!HAS TO MATCH  THE METHOD IM DELETEING WHOLE GYM!!!
    if (doc) {
        await Review.deleteMany({               //Im gonna delete all reviews
            _id: {                          //that their ids are
                $in: doc.reviews            //somewhere inside doc.reviews (document that was just deleted)
            }
        })
    }
})

module.exports = mongoose.model("Gym", GymSchema);