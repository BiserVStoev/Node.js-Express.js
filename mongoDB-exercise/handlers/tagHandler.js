const formidable = require('formidable');
const fs = require('fs');
let Tag = require('../models/TagSchema');
const renderStartPage = require('../utilities/utilities');

module.exports = (req, res) => {
  if (req.pathname === '/generateTag' && req.method === 'POST') {
    let form = new formidable.IncomingForm();
    form.parse(req, (err, fields, file) => {
      Tag.create(fields).then((tag) => {
        renderStartPage(res);
      }).catch((err) => {
        console.log(err);
      });
    });
  } else {
    return true;
  }
}
