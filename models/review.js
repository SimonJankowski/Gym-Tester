const mongoose = require("mongoose");
const Schema = mongoose.Schema;  //just to short up further instructions

const reviewSchema = new Schema({
    body: String,
    rating: Number,
    creator: {
        type: Schema.Types.ObjectId,
        ref: "Gymbro"
    },
    time: {
        type: Number,
        default: Date.now()
    }
});

module.exports = mongoose.model("Review", reviewSchema);