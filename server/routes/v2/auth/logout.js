const express = require('express');
const logout = express.Router();
const session = require('express-session');

const passport = require('passport');

//Install middlewear
logout.use(session({
    saveUninitialized: true,
    secret: 'DFJadslkfjgkf$%dfgjlsdg',
    resave: true
}));
logout.use(passport.initialize());
logout.use(passport.session());

logout.get('/', (req, res) => {
    res.json({
        connection: true,
    })
});

logout.get('/logout', function (req, res) {
    req.logout();
    res.redirect('/api/v2/auth/login');
});

module.exports = logout;
