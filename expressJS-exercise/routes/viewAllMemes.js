const express = require('express');
const router = express.Router();

const Meme = require('../models/MemeSchema');

/* GET all memes  listing. */
router.get('/', function (req, res, next) {
  Meme.find({}).then((allMemes) => {
    res.render('viewAll', {memes: allMemes});
  })
});

module.exports = router;
