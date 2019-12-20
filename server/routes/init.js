const express = require('express');
const api = express.Router();
const v2Route = require('./v2/v2');
const v1Route = require('./api-routes');

api.get('/', (req, res) => {
    res.json({
        connection: true
    })
});

api.use('/', v1Route);
api.use('/v2', v2Route);

module.exports = api;
