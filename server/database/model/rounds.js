const mongoose = require('mongoose');
const Question = require('./question');

//Create schema
const roundScheme = new mongoose.Schema({
    ronde_status: {
        type: String,
        // required: true,
    },
    categories: {
        type: Array,
        required: true,
    },
    vragen: {
        type: [{type: Question, ref: "Question"}],
    },
});

//Create model
mongoose.model("Round", roundScheme);

module.exports = roundScheme;
