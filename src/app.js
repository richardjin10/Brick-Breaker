//imports
const express = require('express');
const app = express();
const path = require("path");
require( './db' );
const session = require('express-session');
const auth = require('./auth.js');

const mongoose = require('mongoose');





app.use(express.urlencoded({extended: false }));
const publicPath = path.resolve(__dirname, "public");
app.use(express.static(publicPath));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

//import schemas
const Score = mongoose.model('Score');
const User = mongoose.model('User');
const Comment = mongoose.model("Comment");



app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));






//create session
app.use((req, res, next) => {
    if(req.session.user!==undefined){
      res.locals.user = req.session.user;
      next();
    }else{
      next();
    }
});





//route for homepage
app.get('/', function(req, res) {
  Score.find({}, function(err, score, count){
    //display highscores
    const highestScore = score.reduce(largerWPM);
    let h = [];
    h.push(highestScore);
    //console.log(h);
    res.render('index', {
      score:score,
      h:h,
      },
    );
  });



});

//route for filter
app.post('/filter', function(req, res) {
  const filter1 = req.body.username;
  //find and render data from database
  Score.find({username: filter1}, function(err, score, count){
    res.render('index', {
      score:score,
      },
    );
  });



});




//post for submitting scores
app.post('/', (req, res) => {
  //create a new score
  new Score({
    username: req.body.username,
    time: req.body.time,
    wpm: req.body.score,
  }).save(function(err, score, count){
    res.redirect('/');
  });


});
//login
app.get('/login', function(req, res) {
  res.render("login");

});


app.post('/login', (req, res) => {
  //store data from post
  const username = req.body.username;
  const password = req.body.password;
  //log user in
  function success(newUser){
    function cb(err){
      res.locals.user = req.session.user;
      res.redirect('/');
    }
    auth.startAuthenticatedSession(req, newUser, cb);
  }
  // if error
  function error(err){
    res.render('login',{
      message:err.message,
    });
  }

  auth.login(username, password, error, success);


});


//render registration page
app.get('/register', function(req, res) {
  res.render("register");
});


app.post('/register', (req, res) => {
  function success(newUser) {
  // start an authenticated session and redirect to another page
    function cb(err){
      res.locals.user = req.session.user;
      res.redirect('/');
    }
    auth.startAuthenticatedSession(req, newUser, cb);


  }
  //registration error
  function error(err){
    res.render('register', {
      message:err.message
    });
  }
  auth.register(req.body.username, req.body.email, req.body.password, error, success);

});


//render test game
app.get('/gametest', function(req, res){
  res.render("gametest");
})


//render scores
app.get('/scores', function(req, res){
  //if user session is undefined
  if(req.session.user===undefined){
    res.redirect('/');
  }else{
    //get scores from database
    Score.find({}, function(err, score, count){
      const newscore = score.filter(score => score.username===req.session.user.username);
      console.log(newscore);
      console.log(req.session.user.username);
      res.render('scores', {
        newscore:newscore,
        },
      );
    });
  }
})

//render comments
app.get('/comments', function(req, res){
  //if user session is undefined
  if(req.session.user===undefined){
    res.redirect('/');
  }else{
    //find and display mcomments
    Comment.find({}, function(err, comment, count){
      res.render('comments', {
        comment:comment,
        },
      );
    });

  }
})

app.post('/comments', (req, res) => {
  //create and post new comment
  new Comment({
    username: req.session.user.username,
    comment: req.body.comment,
  }).save(function(err, comment, count){
    res.redirect('/comments');
  });


});



app.listen(process.env.PORT || 3000);
