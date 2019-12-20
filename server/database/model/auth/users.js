const mongoose = require('mongoose');

//Create schema
const usersSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: false,
    },
    admin: {
        type: Boolean,
        required: true,
        default: false
    }
});

//Create model
mongoose.model("Users", usersSchema);

module.exports = usersSchema;
