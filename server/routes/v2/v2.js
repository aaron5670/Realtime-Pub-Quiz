const express = require('express');
const v2 = express.Router();
const loginRoute = require('./auth/login')
const registerRoute = require('./auth/register')
const logoutRoute = require('./auth/logout')
const gamesRoute = require('./games/games')

v2.get('/', (req, res) => {
    res.json({
        connection: true,
        version: '2.0'
    })
});

v2.use('/auth/login', loginRoute);
v2.use('/auth/register', registerRoute);
v2.use('/auth/logout', logoutRoute);
v2.use('/games', gamesRoute);

module.exports = v2;
