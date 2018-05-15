const mongoose = require('mongoose');

let ObjectId = mongoose.Schema.Types.ObjectId;

let meme = new mongoose.Schema({
    memeName: { type: String, required: true },
    dateOfCreation: { type: Date, default: Date.now() },
    memeDescription: { type: String, required: true },
    genre: {type: ObjectId, ref: 'Genre'}
});

module.exports = mongoose.model('Meme', meme);