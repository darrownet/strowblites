const express = require('express');
const router = express.Router();
const Joi = require('joi');
const authorize = require('_middleware/authorize')
const validateRequest = require('_middleware/validate-request');
const strowbService = require('./strowb.service');

// routes
router.post('/create', authorize(), createSchema, create);

module.exports = router;

function createSchema(req, res, next) {
    const schema = Joi.object({
        frame1: Joi.object({
            image: Joi.string().optional().allow(''),
            delay: Joi.string().optional().allow(''),
            caption: Joi.string().optional().allow(''),
            style: Joi.string().optional().allow('')
        }),
        frame2: Joi.object({
            image: Joi.string().optional().allow(''),
            delay: Joi.string().optional().allow(''),
            caption: Joi.string().optional().allow(''),
            style: Joi.string().optional().allow('')
        }),
        strowb: Joi.string().optional().allow(''),
        style: Joi.string().optional().allow(''),
        title: Joi.string().optional().allow(''),
        tags: Joi.array().optional().allow(''),
        userId: Joi.string().required(),
    });
    validateRequest(req, next, schema);
}

function create(req, res, next) {
    strowbService.create(req.body)
        .then(strowb => res.json(strowb))
        .catch(next);
}
