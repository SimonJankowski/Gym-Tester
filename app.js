if (process.env.NODE_ENV !== "production") {
    require("dotenv").config();
}

const express = require("express");
const app = express();
const path = require("path");                                   //to set set up views directory
const mongoose = require("mongoose");                           //to connect database
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const session = require("express-session");
const flash = require("connect-flash");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const mongoSanitize = require("express-mongo-sanitize");        // package anti-mongo injections
const helmet = require("helmet");

const MongoStore = require("connect-mongo");

const Gym = require("./models/gym");                            //to set up boilerplate
const Review = require("./models/review");
const Gymbro = require("./models/gymbro");
const asyncWraper = require("./helpers/asyncWraper");
const ExpError = require("./helpers/ExpError");
const { gymJoiSchema, reviewJoiSchema } = require("./joiSchemas.js");

const gymRoutes = require("./routes/gyms")
const reviewRoutes = require("./routes/reviews")
const gymbrosRoutes = require("./routes/gymbros")
const { cloudinary, storage } = require("./cloudinary");
//const dbUrl=process.env.DB_URL;

const dbUrl = process.env.DB_URL || "mongodb://localhost:27017/gym-tester";

mongoose.connect(dbUrl);
const db = mongoose.connection;
db.on("error", console.error.bind(console, "database connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

app.set("view engine", "ejs");                                  // setting EJS to be view engine for entire app
app.set("views", path.join(__dirname, "views"));                //setting foler with appviews for user

app.engine("ejs", ejsMate)                                      //switching engine from default to ejs mate
app.use(express.urlencoded({ extended: true }));                // It parses incoming requests with urlencoded payloads and is based on body-parser
app.use(methodOverride("_method"));                             //passed string is to be used with "?" to override post methods
app.use(express.static(path.join(__dirname, "public")));
app.use(mongoSanitize());

const secret = process.env.SECRET ||'doNotGiveUp';

const store = MongoStore.create({
    mongoUrl: dbUrl,
    touchAfter: 24 * 60 * 60,
    crypto: {
        secret
    }
});
store.on("error", function (e) {
    console.log("session store error", e)
})

const sessionConfig = {
    store,
    name: "session",
    secret: "doNotGiveUp",
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        //secure:true,                                             //enable when deployed
        expires: Date.now() + 1000 * 60 * 60 * 24,
        maxAge: 1000 * 60 * 60 * 24,
    }
}

app.use(session(sessionConfig))
app.use(flash());
app.use(helmet({ contentSecurityPolicy: false }));
app.use(passport.initialize());
app.use(passport.session());   //needed to include for persistent login sessions. !!HAS TO BE USED AFTER SESSION!!
passport.use(new LocalStrategy(Gymbro.authenticate()));
passport.serializeUser(Gymbro.serializeUser());
passport.deserializeUser(Gymbro.deserializeUser());


app.use((req, res, next) => {
    res.locals.signedInUser = req.user;
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");  //it has to be placed after using flash and before the route handlers
    next();
})

app.get("/fakegymbro", async (req, res) => {
    const gymbro = new Gymbro({ email: "colttt@gmail.com", username: "colt" });
    const newbro = await Gymbro.register(gymbro, "chicken");
    res.send(newbro);
})


app.use("/gyms", gymRoutes)
app.use("/gyms/:id/reviews", reviewRoutes)
app.use("/", gymbrosRoutes)


app.get("/", (req, res) => {
    res.render("home")
})

app.all("*", (req, res, next) => {            //here im basicly trying to say: if yout url is not on my webpage than...
    next(new ExpError("Page not found", 404))
})

app.use((err, req, res, next) => {
    const { statusCode = 500 } = err; // setting them to default, but its gonna display what "next" has passed anyway
    if (!err.message) err.message = "Something went wrong";
    res.status(statusCode).render("error", { err });
    // res.send("oh boy")
})

// app.get("/makeGym", async (req, res) => {
//     const gb = new Gym({ name: "MuscleWorks", location: "Hammersmith" });
//     await gb.save();
//     res.send(gb)
// })

const port = process.env.PORT ||3000;
app.listen(port, () => {
    console.log(`GymTester avaible on port ${port}`);
})