const mongoose = require('mongoose');
//schema
const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        require: true,
    },
}, {timestamps: true })

//model
const User = mongoose.model("user", userSchema);

module.exports = User;