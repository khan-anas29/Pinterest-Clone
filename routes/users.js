const mongoose = require('mongoose');
const plm = require('passport-local-mongoose');

mongoose.connect("mongodb://127.0.0.1:27017/pinterestDb")

// User Schema - things which will required for user
const userSchema = mongoose.Schema({
  name: String,
  username: String,
  email: String,
  password: String,
  contact: Number,
  profileImage: String,
  boards: {
    type: Array,
    default:[]
  }
})

// giving passport serialize and deserialize user
userSchema.plugin(plm)

module.exports = mongoose.model("user",userSchema)