const mongoose = require('mongoose');

const REQUIRED_VALIDATION_MESSAGE = '{PATH} is required';

let productSchema = new mongoose.Schema({
  category: { type: String, enum: ['chicken', 'beef', 'lamb'], required: REQUIRED_VALIDATION_MESSAGE },
  size: { type: Number, min: [17, 'The minimum size is 17'], max: [24,'The minimum size is 17'], required: true },
  imageUrl: { type: String, required: REQUIRED_VALIDATION_MESSAGE },
  toppings: { type: [String], default: []}
});

let Product = mongoose.model('Product', productSchema);

module.exports = Product;
