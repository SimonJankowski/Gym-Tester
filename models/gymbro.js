const mongoose = require("mongoose");
const Schema = mongoose.Schema;        //just to short up further instructions
const passportLocalMongoose = require("passport-local-mongoose");


const GymbroSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true
    }
});

GymbroSchema.plugin(passportLocalMongoose);   //add loads of functionality to Schema,  adding field for password, user, checking duplicationsetc.

module.exports = mongoose.model("Gymbro", GymbroSchema)