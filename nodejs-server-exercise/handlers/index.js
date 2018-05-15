const homeHandler = require('./homeHandler.js');
const faviconHandler = require('./faviconHandler.js');
const staticHandler = require('./staticFileHandler.js');
const movieHandler = require('./movieHandler.js');

module.exports = [ faviconHandler, homeHandler, movieHandler, staticHandler ];