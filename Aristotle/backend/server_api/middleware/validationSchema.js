const Joi = require('@hapi/joi');

// Joi Schema for course related validation
module.exports.user_schema_post = Joi.object().keys({
    id: Joi.string().required(),
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().min(9).max(15).required(),
    department: Joi.string().required(),
    dob: Joi.number(),
    role: Joi.string().required(),
    type: Joi.string().required(),
    password: Joi.string().required(),
})

// Joi Schema for course related validation
module.exports.user_schema_put = Joi.object().keys({
    firstname: Joi.string().alphanum().min(3).max(30).required(),
    lastname: Joi.string().alphanum().min(3).max(30).required(),
    email: Joi.string().required().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    phone: Joi.string().min(9).max(15).required(),
    department: Joi.string().required(),
    dob: Joi.number(),
    role: Joi.string().required(),
    type: Joi.string().required(),
    password: Joi.string().required(),
})

// Joi Schema for course related validation
module.exports.schema_course= Joi.object().keys({
    title: Joi.string().min(3).max(120).required(),
    description: Joi.string().required(),
    createdAuthor: Joi.string(),
    department: Joi.string(),
    disable: Joi.boolean()
})

module.exports.schema_chapter = Joi.object().keys({
    title: Joi.string().min(3).max(120).required(),
    description: Joi.string().required(),
    createdAuthor: Joi.string(),
    contents: Joi.required(),
    type: Joi.string().valid('chapterContents','quiz').required(),
    note: Joi.string(),
    disable: Joi.boolean()
})

module.exports.schema_chapter_put = Joi.object().keys({
    title: Joi.string().min(3).max(120).required(),
    description: Joi.string().required(),
    createdAuthor: Joi.string(),
    contents: Joi.required(),
    note: Joi.string(),
    disable: Joi.boolean()
})

module.exports.schema_quiz = Joi.object().keys({
    title: Joi.string().min(3).max(120).required(),
    description: Joi.string().required(),
    createdAuthor: Joi.string()
}) 

module.exports.schema_question = Joi.object().keys({
    description: Joi.string().min(6).max(999).required(),
    contents: Joi.array().items(Joi.string()).required(),
    answer: Joi.string().required()
})

module.exports.authenticate = Joi.object().keys({
    id: Joi.string().required()
});

module.exports.create_role = Joi.object().keys({
    title: Joi.string().min(3).max(120).required()
});

// Joi Schema for user related validation


