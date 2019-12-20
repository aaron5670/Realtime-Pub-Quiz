const express = require('express');
const games = express.Router();
const session = require('express-session');
const bodyParser = require('body-parser');

const mongoose = require('mongoose');
require('../../../database/model/games');
const Games = mongoose.model("Games");

const isAdmin = require('../middleware/adminAuthentication');

//Install middlewear
games.use(bodyParser.json());
games.use(session({
    saveUninitialized: true,
    secret: 'DFJadslkfjgkf$%dfgjlsdg',
    resave: true
}));

games.get('/', isAdmin(), async (req, res) => {
    const games = await Games.find({});

    const gameData = games.reduce((accumulator, current) => {
        return accumulator.concat({
            _id: current._id,
            game_status: current.game_status,
            teams: current.teams.length,
            rounds: current.rondes.length,
        });
    }, []);

    return res.json({
        data: gameData
    })
});

games.delete('/:id', isAdmin(), async (req, res) => {
    const id = req.params.id;
    await Games.findOneAndDelete(id);
    res.status(200)
    return res.json({success:true})
});

module.exports = games;
