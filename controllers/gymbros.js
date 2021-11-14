
const Gymbro = require("../models/gymbro");

module.exports.renderRegisterForm = (req, res) => {
    res.render("gymbros/register")
}

module.exports.registerGymbroRequest = async (req, res) => {
    try {
        const { email, username, password } = req.body.Gymbro;
        const user = new Gymbro({ email, username });
        const registredUser = await Gymbro.register(user, password);
        req.login(registredUser, err => {  //passport method, not possible to await
            if (err) return next(err);
            req.flash("success", `Thank you ${registredUser.username}, for joining Gym Tester`);
            res.redirect("/gyms")
        });
    } catch (e) {
        req.flash("error", e.message)
        res.redirect("/register")
    }
}

module.exports.renderLoginForm = (req, res) => {
    res.render("gymbros/login");
}

module.exports.loginRequest = (req, res) => {
    req.flash("success", "Welcome back");
    const redirectUrl = req.session.returnTo || "/gyms";
    delete req.session.returnTo;
    res.redirect(redirectUrl)
}

module.exports.logoutRequest = (req, res) => {
    req.logout();       //passport method
    req.flash("success", "Logout successfull");
    res.redirect("/gyms");
}