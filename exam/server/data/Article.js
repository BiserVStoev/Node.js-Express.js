const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required';

let articleSchema = new mongoose.Schema({
  title: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  isLocked: { type: Boolean, default: false},
  edits: [{ type: ObjectId, ref: 'Edit' }],
  dateCreated: {type: Date, required: true, default: Date.now}
});

let Article = mongoose.model('Article', articleSchema);

module.exports = Article;