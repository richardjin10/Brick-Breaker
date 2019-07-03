const mongoose = require('mongoose');



//schema for user
const User = new mongoose.Schema({
  username:{type: String, unique: true, required: true},
  email:{type: String, unique: true, required: true},
  password:{type: String, unique: true, required: true},
});


//schema for scores
const ScoresSchema = new mongoose.Schema({
  username:String,
  time:String, // when the score was set
  wpm:Number, //words per minute avg typing speed

});

//schema for comments
const CommentSchema = new mongoose.Schema({
  username:String,
  comment:String,
})



//set schmeas
mongoose.model('User', User);
mongoose.model('Score', ScoresSchema);
mongoose.model('Comment', CommentSchema);





// is the environment variable, NODE_ENV, set to PRODUCTION?
let dbconf;
if (process.env.NODE_ENV === 'PRODUCTION') {
 // if we're in PRODUCTION mode, then read the configration from a file
 // use blocking file io to do this...
 const fs = require('fs');
 const path = require('path');
 const fn = path.join(__dirname, 'config.json');
 const data = fs.readFileSync(fn);

 // our configuration file will be in json, so parse it and set the
 // conenction string appropriately!
 const conf = JSON.parse(data);
 dbconf = conf.dbconf;
 mongoose.connect(dbconf);
} else {
 // if we're not in PRODUCTION mode, then use
 dbconf = 'mongodb://localhost/aitfinalproject';
 mongoose.connect(dbconf);
}
