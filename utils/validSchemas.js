const joi = require('joi');

module.exports.noticeSchema = joi.object({
    notice: joi.object({
        title: joi.string().required(),
        description: joi.string().required(),
        author: joi.string().required(),
    }).required()
})

module.exports.commentSchema = joi.object({
    comment: joi.object({
        body: joi.string().required()
    }).required()
})
