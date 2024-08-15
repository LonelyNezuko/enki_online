const express = require('express');
const router = express.Router();

const { methods } = require('./_methodAdd')

require('./methods/account')
require('./methods/server')

router.get('/', (req, res, next) =>
{
    if(JSON.stringify(req.query) === '{}')return res.send({
        status: "error",
        result: "no_arguments"
    })

    const
        method = req.query.method,
        secretKey = req.query.secret
    let params = req.query.params

    if(method === undefined)return res.send({
        status: "error",
        result: "invalid_method"
    })

    if(params === undefined
        || typeof params !== 'object'
        || JSON.stringify(params) === '{}') params = {}

    if(!methods[method]
        || typeof methods[method] !== 'function')return res.send({
        status: "error",
        result: "method_not_found"
    })

    methods[method](res, params, secretKey)
})

module.exports = router;
