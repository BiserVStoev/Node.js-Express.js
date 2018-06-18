const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required';

let editSchema = new mongoose.Schema({
  content: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  editor: { type: ObjectId, ref: 'User' },
  article: { type: ObjectId, ref: 'Article' },
  dateCreated: {type: Date, required: true, default: Date.now}
});

let Edit = mongoose.model('Edit', editSchema);

module.exports = Edit;