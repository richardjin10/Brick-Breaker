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
const Score = mongoose.model('Score');
const User = mongoose.model('User');
const Comment = mongoose.model("Comment");



app.use(session({
    secret: 'add session secret here!',
    resave: false,
    saveUninitialized: true,
}));







app.use((req, res, next) => {
  // now you can use {{user}} in your template!
    if(req.session.user!==undefined){
      //console.log(req.session.user, "hihihi");
      res.locals.user = req.session.user;
      next();
    }else{

      next();
    }
});



function largerWPM(one, two){
  if(one.wpm>two.wpm){
    return one;
  }else{
    return two;
  }
}





app.get('/', function(req, res) {
  Score.find({}, function(err, score, count){
    const highestScore = score.reduce(largerWPM);
    let h = [];
    h.push(highestScore);
    console.log(h);
    res.render('index', {
      score:score,
      h:h,
      },
    );
  });



});


app.post('/filter', function(req, res) {
  const filter1 = req.body.username;
  Score.find({username: filter1}, function(err, score, count){
    res.render('index', {
      score:score,
      },
    );
  });



});



app.post('/', (req, res) => {
  new Score({
    username: req.body.username,
    time: req.body.time,
    wpm: req.body.wpm,
  }).save(function(err, score, count){
    res.redirect('/');
  });


});

app.get('/login', function(req, res) {
  res.render("login");

});


app.post('/login', (req, res) => {
  const username = req.body.username;
  const password = req.body.password;

  function success(newUser){
    function cb(err){
      res.locals.user = req.session.user;
      res.redirect('/');
    }
    auth.startAuthenticatedSession(req, newUser, cb);
  }

  function error(err){
    res.render('login',{
      message:err.message,
    });
  }

  auth.login(username, password, error, success);


});



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

  function error(err){
    res.render('register', {
      message:err.message
    });
  }
  auth.register(req.body.username, req.body.email, req.body.password, error, success);

});



app.get('/gametest', function(req, res){
  res.render("gametest");
})

app.get('/scores', function(req, res){
  if(req.session.user===undefined){
    res.redirect('/');
  }else{
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


app.get('/comments', function(req, res){
  if(req.session.user===undefined){
    res.redirect('/');
  }else{
    Comment.find({}, function(err, comment, count){
      res.render('comments', {
        comment:comment,
        },
      );
    });

  }
})

app.post('/comments', (req, res) => {
  new Comment({
    username: req.session.user.username,
    comment: req.body.comment,
  }).save(function(err, comment, count){
    res.redirect('/comments');
  });


});



app.listen(process.env.PORT || 3000);
