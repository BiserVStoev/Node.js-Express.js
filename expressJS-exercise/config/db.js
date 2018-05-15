const mongoose = require('mongoose');
const path = 'mongodb://localhost:27017/testApp';

mongoose.Promise = global.Promise;

module.exports = (() => {
    mongoose.connect(path);
    console.log('DB Connected')
})();