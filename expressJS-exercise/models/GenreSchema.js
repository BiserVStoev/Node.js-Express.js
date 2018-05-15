const mongoose = require('mongoose');

let ObjectId = mongoose.Schema.Types.ObjectId;

let genre = new mongoose.Schema({
    genreName: {type: String, required: true},
    memeList:[{type: ObjectId, ref: 'Meme'}]
});

module.exports = mongoose.model('Genre', genre);