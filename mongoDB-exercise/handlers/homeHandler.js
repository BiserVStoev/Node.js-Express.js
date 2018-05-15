let Tag = require('./../models/TagSchema');
let Image = require('./../models/ImageSchema');
const renderStartPage = require('../utilities/utilities');

module.exports = (req, res) => {
  if (req.pathname === '/' && req.method === 'GET') {
    renderStartPage(res);
  } else {
    return true;
  }
}
