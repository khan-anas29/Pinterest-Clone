var express = require('express');
var router = express.Router();
const userModel = require('./users');
const passport = require('passport');
const localStrategy = require('passport-local')
const upload = require('./multer');

// Required Line
passport.use(new localStrategy(userModel.authenticate()));

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index',{nav:false});
});

// register  Page
router.get('/register', function(req, res, next) {
  res.render('register',{nav:false});
});

// Profile Page
router.get("/profile",isLoggedIn,async function (req,res,next) { 
   // getting user
   const user= await userModel.findOne({username: req.session.passport.user})
  res.render("profile",{user,nav:true})
});

// Create New Post
router.get("/addpost",isLoggedIn,async function (req,res,next) { 
   // getting user
   const user= await userModel.findOne({username: req.session.passport.user})
  res.render("addpost",{user,nav:true})
});

// FileUpload for Profile Photo
router.post("/fileupload",isLoggedIn,upload.single("image"), async function (req,res,next) { 
  // getting user
  const user= await userModel.findOne({username: req.session.passport.user})
  // connecting uploaded file to db file
  user.profileImage= req.file.filename;
  await user.save();
  res.redirect("/profile")
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
