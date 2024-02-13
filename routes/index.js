var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// register  Page
router.get('/register', function(req, res, next) {
  res.render('register');
});
// Form Data
router.post('/register', function(req, res, next) {
  const data= new userModel({
    // leftside: user.js
    // right side: register.ejs
    username: req.body.username,
    email: req.body.email,
    contact: req.body.contact
  });

  // registering by authenticate
  userModel.register(data,req.body.password)
  .then(function(){
    passport.authenticate("local")(req,res,function(){
      res.redirect("/profile")
    })
  })

});

module.exports = router;
