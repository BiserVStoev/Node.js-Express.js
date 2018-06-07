const fs = require('fs');
const Tag = require('./../models/TagSchema');
const Image = require('../models/ImageSchema');

function onlyUnique(value, index, self) {
  return self.indexOf(value) === index;
}

const getTagIds = (tagNames) => {
  return new Promise((resolve, reject) => {
    Tag.find().where('tagName').in(tagNames).select('_id').then((data) => {
      let tagIds = [];
      for (let tag of data) {
        tagIds.push(tag._id)
      }
      resolve(tagIds)
    }).catch(err => {
      reject(err);
    });
  });
}

const getImages = (tagNames, minDate, maxDate, limit) => {
  return new Promise((resolve, reject) => {
    getTagIds(tagNames).then(tagIds => {
      let imagesGetterPromise = Image
        .find()
        .where('tags')
        .in(tagIds)
        .where('datC')
        .gt(minDate)
        .where('datC')
        .lt(maxDate)
        .limit(Number(limit))
        .sort('-datC')
        .select('_id imageUrl imageTitle description');
      resolve(imagesGetterPromise);
    });
  });
};

module.exports = (req, res) => {
  if (req.pathname === '/search') {
    const query = req.pathquery;
    const tags = query.tagName.split(',');
    let maxDate = new Date(8640000000000000);
    let minDate = new Date(-8640000000000000);
    if (req.pathquery.afterDate) {
      minDate = new Date(req.pathquery.afterDate);
    }
    if (req.pathquery.beforeDate) {
      maxDate = new Date(req.pathquery.beforeDate);
    }
    let limit = 10;
    if (req.pathquery.Limit && req.pathquery.Limit > 0) {
      limit = req.pathquery.Limit
    }
    getImages(tags, minDate, maxDate, limit)
      .then((imagesData) => {
        let images = [];
        let resultStr = '';
        for (let image of imagesData) {
          resultStr += `<fieldset id => 
                          <legend>${image.imageTitle}:</legend> 
                          <img src="${image.imageUrl}"></img>
                          <p>${image.description}<p/>
                          <button onclick='location.href="/delete?id=${image._id}"'class='deleteBtn'>Delete</button> 
                        </fieldset>`
        }
        if (resultStr === '') {
          resultStr = 'No Images found.';
        }
        fs.readFile('./views/results.html', (err, html) => {
          if (err) {
            console.log(err);
            return;
          }
          res.writeHead(200, {
            'Content-Type': 'text/html'
          });
          res.end(html.toString().replace(`<div class='replaceMe'></div>`, resultStr));
        })
        return true;
      });
  } else {
    return true;
  }
}
