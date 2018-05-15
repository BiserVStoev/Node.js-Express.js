const formidable = require('formidable');
const renderStartPage = require('../utilities/utilities');
let Image = require('../models/ImageSchema');
let Tag = require('../models/TagSchema');

let addImage = (req, res) => {
  let form = new formidable.IncomingForm();
  form.parse(req, (err, fields, files) => {
    if (err) {
      console.log(err);
      return;
    }
    fields.tags = fields.tagsID.split(',');
    fields.tags.pop();
    delete fields.tagsID;
    Image.create(fields).then((img) => {
      let targetedTags = img.tags;
      Tag.update(
        { _id: { $in: targetedTags } }, 
        { $push: { images: img._id } },
         { multi: true }
      ).then((resol) => {
        console.log(resol);
        renderStartPage(res);
      }).catch((e) => {
        console.log(e);
        return;
      });
    });
  });
}

module.exports = (req, res) => {
  if (req.pathname === '/addImage' && req.method === 'POST') {
    addImage(req, res);
  } else if (req.pathname === '/delete' && req.method === 'GET') {
    deleteImg(req, res);
  } else {
    return true;
  }
}
