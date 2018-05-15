const express = require('express');
const router = express.Router();

const Genre = require('./../models/GenreSchema');
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('addGenre');
}).post('/', (req, res, next) => {
    Genre.create({genreName: req.body.genreName}).then((asd) => {
        res.render('addGenre', {status: true});
    })
});

module.exports = router;
