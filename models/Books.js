const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const BooksSchema = new mongoose.Schema({
  carname: {
    type: String,
    required: true
  },
  seater: {
    type: String,
    required: true,
    // unique: true
  },
  mileage: {
    type: String,
    required: true
  },
  company: {
    type: String,
    required: true
  },
  color: {
    type: String,
    required: true
  },
  model: {
    type: Number,
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

// BooksSchema.methods.comparePassword = function(candidatePassword) {
//   return bcrypt.compare(candidatePassword, this.password);
// };
const Books = mongoose.model('Books', BooksSchema);

module.exports = Books;
