require('dotenv').config();
const mongoose = require('mongoose');

const {DB_URI} = process.env

async function db() {
  return await mongoose.connect(DB_URI)
  // return await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test')
}

module.exports = db