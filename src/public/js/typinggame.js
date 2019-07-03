
//Tutorial
//https://developer.mozilla.org/en-US/docs/Games/Tutorials/2D_breakout_game_Phaser


var game = new Phaser.Game(580, 420, Phaser.CANVAS, null, {
      preload: preload, create: create, update: update
    });


let ball;
let paddle;
const type = document.getElementById('typed');
console.log(type);
let bricks;
let newBrick;
let brickInfo;
var scoreText;
var score = 0;
var playing = false;
var startButton;

function preload() {
  //game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = 'eee';
  game.load.image('ball', 'images/ball.png');
  game.load.image('paddle', 'images/paddle.png');
  game.load.image('brick', 'images/brick.png');
  game.load.spritesheet('button', 'images/button.png', 120, 40);


}
function create() {
  startButton = game.add.button(game.world.width*0.5, game.world.height*0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
  game.physics.startSystem(Phaser.Physics.ARCADE);
  ball = game.add.sprite(100, 100, 'ball');
  paddle = game.add.sprite(game.world.width*0.5, game.world.height-5, 'paddle');
  game.physics.enable(paddle, Phaser.Physics.ARCADE);
  paddle.body.immovable = true;
  paddle.anchor.set(0.5,2);
  paddle.height = 20;
  paddle.width = 100;
  ball.width = 20;
  ball.height =20;
  game.physics.enable(ball, Phaser.Physics.ARCADE);
  //ball.body.velocity.set(500, 500); //og 100,100
  //ball.body.gravity.y = 100;
  ball.body.collideWorldBounds = true;
  ball.body.bounce.set(1);

  game.physics.arcade.checkCollision.down = false;
  ball.checkWorldBounds = true;
  ball.events.onOutOfBounds.add(function(){
    ball.body.velocity.set(0, 0);
    lossText = game.add.text(245,210, 'Game Over', { font: '18px Arial', fill: '#0095DD' });

    var btn = document.createElement("BUTTON");
    var t = document.createTextNode("Post Score");
    btn.appendChild(t);
    const center = document.getElementById('center');
    center.appendChild(btn);
    btn.addEventListener('click', function() {
      //post data to server using ajax
      location.reload();


    });








  }, this);

  generateBricks();
  scoreText = game.add.text(5, 5, 'Points: 0', { font: '18px Arial', fill: '#0095DD' });
  leftWord = randomWord();
  rightWord = randomWord();
  while(leftWord === rightWord){
    rightWord = randomWord();
  }

  leftText = game.add.text(5, 400, leftWord, { font: '18px Arial', fill: '#0095DD' });
  rightText = game.add.text(450, 400, rightWord, { font: '18px Arial', fill: '#0095DD' });




}
function update() {
   game.physics.arcade.collide(ball, paddle);
   game.physics.arcade.collide(ball, bricks, ballHitBrick);
   if(playing) {
    //get rid of comment to play with mouse instead
    paddle.x = game.input.x || game.world.width*0.5;

    if(type.value === leftText.text){
      paddle.x = paddle.x - 90;
      leftWord = randomWord();
      while(leftWord === rightWord){
        leftWord = randomWord();
      }
      leftText.setText(leftWord);
      type.value= "";
    }
    else if (type.value === rightText.text){
      paddle.x = paddle.x + 90;
      rightWord = randomWord();
      while(leftWord === rightWord){
        rightWord = randomWord();
      }
      rightText.setText(rightWord);
      type.value="";
    }
  }


   //if(type.value === "a"){
  //   paddle.x = paddle.x + 10;
   //}else if(type.value === "b"){
    // paddle.x = paddle.x - 10;
   //}


}


function generateBricks(){
  brickInfo = {
    width: 50,
    height: 20,
    count: {
        row: 7,
        col: 1
    },
    offset: {
        top: 50,
        left: 60
    },
    padding: 25
}
  bricks = game.add.group();
  for(c=0; c<brickInfo.count.col; c++) {
      for(r=0; r<brickInfo.count.row; r++) {
          var brickX = (r*(brickInfo.width+brickInfo.padding))+brickInfo.offset.left;
          var brickY = (c*(brickInfo.height+brickInfo.padding))+brickInfo.offset.top;
          newBrick = game.add.sprite(brickX, brickY, 'brick');
          newBrick.width = 40;
          newBrick.height =40;
          game.physics.enable(newBrick, Phaser.Physics.ARCADE);
          newBrick.body.immovable = true;
          newBrick.anchor.set(0.5);
          bricks.add(newBrick);
      }
  }
}

function ballHitBrick(ball, brick) {
  var killTween = game.add.tween(brick.scale);
    killTween.to({x:0,y:0}, 200, Phaser.Easing.Linear.None);
    killTween.onComplete.addOnce(function(){
        brick.kill();
        brickX = Math.floor(Math.random() * 580);
        brickY = (Math.floor(Math.random() * 220));
        newBrick = game.add.sprite(brickX, brickY, 'brick');
        newBrick.width = 40;
        newBrick.height = 40;
        game.physics.enable(newBrick, Phaser.Physics.ARCADE);
        newBrick.body.immovable = true;
        bricks.add(newBrick);
    }, this);
    killTween.start();
    score += 10;
    scoreText.setText('Points: '+score);

}

function startGame() {
    startButton.destroy();
    ball.body.velocity.set(500, -500);
    playing = true;
    type.focus();
}



function randomWord(){
  const words = ['beef', 'bob', 'cheese', 'steak', 'chicken', 'can ', 'soup', 'stranger', 'bully','spray', 'limit', 'elite', 'exuberant', 'destruction', 'present'];
  const strippedWords = words.map(x => x.trim());

  randomIndex = Math.floor(Math.random() * (words.length-1));
  return strippedWords[randomIndex];
}





console.log(randomWord());
