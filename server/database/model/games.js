const mongoose = require('mongoose');
const Team = require('./teams');
const Round = require('./rounds');

//Create schema
const gamesSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
        // unique: true,
    },
    game_status: {
        type: String,
        // required: true,
    },
    teams: {
        type: [{type: Team, ref: "Team"}],
    },
    rondes: {
        type: [{type: Round, ref: "Round"}],
    },
});

//Create model
mongoose.model("Games", gamesSchema);

module.exports = gamesSchema;
