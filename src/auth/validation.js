const Joi = require('@hapi/joi');

const signupValidation = (data)=>{
    const schema = Joi.object({
        name: Joi.string().min(3).required(),
        website: Joi.string().min(5),
        email: Joi.string().min(5).lowercase().email(),
        password: Joi.string().min(6).max(1000).required()
    })
    return schema.validate(data);

}

const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().min(5).lowercase().required().email(),
        password: Joi.string().min(6).max(1000).required()
    })
    return schema.validate(data);

}
module.exports.signupValidation  = signupValidation;
module.exports.loginValidation  = loginValidation;