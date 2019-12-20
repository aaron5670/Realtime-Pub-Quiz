const express = require('express');
const register = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('../../../database/model/auth/users');
const Users = mongoose.model('Users');

const passport = require('passport');
const bcrypt = require('bcryptjs');


//Install middlewear
register.use(bodyParser.json());
register.use(session({
    saveUninitialized: true,
    secret: 'DFJadslkfjgkf$%dfgjlsdg',
    resave: true
}));
register.use(passport.initialize());
register.use(passport.session());

register.get('/', (req, res) => {
    res.json({
        connection: true,
    })
});

register.post('/', async (req, res) => {

    //If usernameCheck
    let usernameCheck = req.query.usernameCheck;
    if (usernameCheck) {
        let username = req.body.username;

        if (username !== '') {
            await Users.findOne({username: username}, function (err, user) {
                if (err) {
                    return res.json({
                        success: false,
                        error: true
                    });
                }
                if (!user) {
                    return res.json({
                        success: true,
                    });
                } else {
                    return res.json({
                        success: false,
                    });
                }
            })
        }
    }

    let name = req.body.name;
    let username = req.body.username;
    let password = req.body.password;

    if (name && username && password) {

        await Users.findOne({username: username}, async function (err, user) {
            if (err) {
                return res.json({
                    success: false,
                    error: true
                });
            }
            if (!user) {
                const salt = bcrypt.genSaltSync(10);
                const user = new Users({
                    name: name,
                    username: username,
                    password: bcrypt.hashSync(password, salt)
                });

                user.save(function (err, fluffy) {
                    if (err) return console.error(err);
                });
                return res.json({
                    success: true,
                });
            } else {
                return res.json({
                    success: false,
                });
            }
        });
    }
});

module.exports = register;
