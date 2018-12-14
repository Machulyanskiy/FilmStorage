const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const movieSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    format: {
        type: String,
        required: true
    },
    actors: {
        type: String,
        required: true
    }
});

module.exports.registerModel = function() {
    try {
        mongoose.model('movies', movieSchema);
    } catch (e) {
        console.error(e);
    }
};