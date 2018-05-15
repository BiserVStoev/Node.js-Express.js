const express = require('express');
const router = express.Router();

const Genre = require('../models/GenreSchema');
const Meme = require('../models/MemeSchema');

router.get('/', function (req, res, next) {
  Genre.find({}).then((foundGenres) => {
    let tags = [];
    for (let genre of foundGenres) {
      tags.push(genre.genreName);
    }
    res.render('addMeme', { tags });
  });
}).post('/', (req, res, next) => {
  let file = req.files.meme;
  let memeObj = req.body;
  
  file.mv(`./public/memes/${memeObj.memeName}.jpg`, (err) => {
    if(err){
      console.log(err);
      return;
    }
  })

  Meme.create({memeName: memeObj.memeName, memeDescription: memeObj.memeDescription}).then((newMeme) => {
    let targetGenre = memeObj.genreSelect;
    Genre.findOne({genreName: targetGenre}).then((foundGenre) => {
      newMeme.genre = foundGenre._id;
      newMeme.save().then(() => {
        Genre.find({}).then((foundGenres) => {
          let tags = [];
          for (let genre of foundGenres) {
            tags.push(genre.genreName);
          }
          res.render('addMeme', { tags, status: true });
        });
      });
    });
  })
});

module.exports = router;
