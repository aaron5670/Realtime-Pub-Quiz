const mongoose = require('mongoose');

//Create schema
const teamScheme = new mongoose.Schema({
    _id: {
        type: String,
        required: true,
    },
    approved: {
        type: Boolean,
        required: true,
    },
    round_score: {
        type: Number,
        required: true,
    },
    team_score: {
        type: Number,
        required: true,
    }
});

//Create model
mongoose.model("Team", teamScheme);

module.exports = teamScheme;
