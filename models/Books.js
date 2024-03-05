const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BooksSchema = new mongoose.Schema({
  bookname: {
    type: String,
    required: true
  },
  author: {
    type: String,
    required: true,
    unique: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  status: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  images: {
    type: String,
    required: true
  }
});

BooksSchema.methods.comparePassword = function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};
const Books = mongoose.model('Books', BooksSchema);

module.exports = Books;
