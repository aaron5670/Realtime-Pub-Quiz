const express = require('express');
const login = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('../../../database/model/auth/users');
const Users = mongoose.model('Users');

const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const flash = require('connect-flash');

const authMiddleware = require('../middleware/authentication');
const bcrypt = require('bcryptjs');

//Install middlewear
login.use(bodyParser.json());
login.use(session({
    saveUninitialized: true,
    secret: 'DFJadslkfjgkf$%dfgjlsdg',
    resave: true
}));
login.use(passport.initialize());
login.use(passport.session());
login.use(flash());

//Passport middleware for Authentication
passport.use(new LocalStrategy(
    function (username, password, done) {
        Users.findOne({username: username}, function (err, user) {
            if (err)
                return done(err);

            if (!user)
                return done(null, false, {message: 'username-incorrect'});

            if (!bcrypt.compareSync(password, user.password))
                return done(null, false, {message: 'password-incorrect'});

            console.log(user)

            return done(null, user);
        });
    }
));

passport.serializeUser(function (user, done) {
    done(null, user);
});

passport.deserializeUser(function (user, done) {
    done(null, user);
});

login.get('/', (req, res) => {
    res.json({
        connection: true,
    })
});

login.post('/', passport.authenticate('local', {
        successFlash: 'Welcome!',
        failureFlash: true,
        successRedirect: '/api/v2/auth/login/success',
        failureRedirect: '/api/v2/auth/login/failed',
    })
);

login.get('/success', authMiddleware(), (req, res) => {
    res.json({
        success: true,
        username: req.session.passport.user.username,
        admin: req.session.passport.user.admin,
        message: 'Login success',
    });
});

login.get('/failed', (req, res) => {
    res.status(401);
    res.json({
        message: 'Login failed',
        errorMsg: req.flash('error')
    });
});

module.exports = login;
