const Joi = require('@hapi/joi');
// Joi valiation handlers to validate a Joi Schema/object().keys
const validationHandler = (schema, property) => {
    return (req, res, next) => {
        const {error} = Joi.validate(req.body, schema);
        if(!error) {
            next();
        } else {
            const {details} = error;
            // gather the error message
            const message = details.map(i => i.message).join(',');
            // log the error message
            console.log("[ValidationError]", message);
            // return the error to users
            res.status(422).json({error: message});
        }
    }
};

module.exports = validationHandler;
