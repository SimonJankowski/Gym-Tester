const BaseJoi = require("joi");
const sanitizeHtml = require("sanitize-html");

const extension = (joi) => ({
    type: "string",
    base: joi.string(),
    messages: {
        "string.escapeHTML": `{{#label}} must not include HTML!`
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {  //using package sanitaze HTML
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error("string.escapeHTML", { value })
                return clean;
            }
        }
    }
});
const Joi = BaseJoi.extend(extension);
module.exports.gymJoiSchema = Joi.object({
    gym: Joi.object({
        name: Joi.string().required().escapeHTML(),
        type: Joi.string()
            .valid('Commercial Gym', 'Old school Gym', "Posh fitness center", "Multisport club", "Outdoor Gym", "Crossfit Box")
            .required(),
        price: Joi.number().required().min(0).max(999),
        description: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
    }).required(),
    deleteImages: Joi.array()
})

module.exports.reviewJoiSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})

module.exports.GymbroJoiSchema = Joi.object({
    Gymbro: Joi.object({
        email: Joi.string().required(),
        password: Joi.string().min(8).max(16).required(),
        username: Joi.string().alphanum()
    }).required()
})