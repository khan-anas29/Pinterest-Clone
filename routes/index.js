var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local')

// Required Line
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

// register  Page
router.get('/register', function(req, res, next) {
  res.render('register');
});

// Profile Page
router.get("/profile",isLoggedIn,function (req,res,next) { 
  res.render("profile")
});

// Form Data: Register Function
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

// Login Function
router.post('/login', passport.authenticate("local",{
  failureRedirect:"/",
  successRedirect:"/profile",
}),function(req, res, next) {
});

// Logout
router.get("/logout", function(req,res,next){
  req.logout(function(err) {
    if (err) { return next(err); }
    res.redirect('/');
  });
})

// is LoggedIn
function isLoggedIn(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect("/")
}

module.exports = router;
