const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

class SnakePart {
    constructor(x, y) {
      this.x = x;
      this.y = y;
    }
}

let speed = 7;

let tileCount = 20;
let tileSize = canvas.width / tileCount - 2;

let headX = 10;
let headY = 10;
const snakeParts = [];
let tailLength = 2;

let xVelocity = 0;
let yVelocity = 0;

let appleX = 5;
let appleY = 5;


let score =0;

const backgroundSound = new Audio('background.wav');
backgroundSound.volume = 0.1;
const collisionSound = new Audio('collision.mp3');
const failSound = new Audio('fail.mp3');

//game loop
function drawGame(){
    backgroundSound.play();
    changeSnakePosition();
    let result = isGameOver();
    if(result){
        return;
    }
    clearScreen();
    checkAppleCollision();
    drawApple();
    drawSnake();
    drawScore();
    if (score > 5) {
        speed = 10;
      }
      if (score > 10) {
        speed = 12;
      }
    setTimeout(drawGame, 1000/speed);

}

//game over
function isGameOver(){
    let gameOver = false;

    if (yVelocity === 0 && xVelocity === 0) {
        return false;
    }
    //crashing into walls
    //left wall
    if(headX <0){
        gameOver = true;
        failSound.play();
        backgroundSound.pause();
    }
    //right wall
    else if(headX === tileCount){
        gameOver = true;
        failSound.play();
        backgroundSound.pause();
    }
    //upper wall
    else if(headY <0){
        gameOver = true;
        failSound.play();
        backgroundSound.pause();
    }
    //lower wall
    else if(headY === tileCount){
        gameOver = true;
        failSound.play();
        backgroundSound.pause();
    }

    //crashing into itself
    for (let i=0; i < snakeParts.length; i++){
        let part = snakeParts[i];
        if(part.x === headX && part.y === headY){
            gameOver = true;
            failSound.play();
            backgroundSound.pause();
            break;
        }
    }

    //message when the game is over
    if (gameOver) {
    //gradient color
        var gradient = ctx.createLinearGradient(0, 0, canvas.width, 0);
        gradient.addColorStop("0", "#3333FF");
        gradient.addColorStop("0.25", "#99FFFF");
        gradient.addColorStop("0.75", "#CC0066");
        gradient.addColorStop("1.0", "#99FFFF");
      // Fill with gradient
      ctx.fillStyle = gradient;
      ctx.font = "50px Verdana";

      ctx.fillText("Game Over", canvas.width / 6.5, canvas.height / 2);
    }
    return gameOver;
}
function drawScore(){
    ctx.fillStyle = 'rgb(52, 182, 182)';
    ctx.font = '10px Verdana'
    ctx.fillText('Score: ' + score, canvas.width-60, 20);
}


//rectangular screen
function clearScreen(){
    ctx.fillStyle = '#FCDCDF';
    ctx.fillRect(0,0, canvas.width, canvas.height); 
}
//the snake itself
function drawSnake(){
    ctx.fillStyle = '#FFABAB';
    for (let i=0; i< snakeParts.length; i++){
        let part = snakeParts[i];
        ctx.fillRect(part.x * tileCount, part.y * tileCount, tileSize, tileSize)
    }
    
    snakeParts.push(new SnakePart(headX, headY)); //put an item at the end of the list next to the head
    while (snakeParts.length > tailLength){
        snakeParts.shift(); //remove the furthers item from the snake parts if have more than our tail size
    }
    ctx.fillStyle = 'salmon';
    ctx.fillRect(headX * tileCount, headY * tileCount, tileSize, tileSize)
}


//snake position
function changeSnakePosition(){
    headX = headX + xVelocity;
    headY = headY + yVelocity;
}

//the target
function drawApple(){
    ctx.fillStyle = '#D63C2D';
    ctx.fillRect(appleX * tileCount, appleY * tileCount, tileSize, tileSize)
}

//collision of the snake and the target
function checkAppleCollision(){
    if(appleX == headX && appleY == headY){
        appleX = Math.floor(Math.random()*tileCount); //randomize next position of the target
        appleY = Math.floor(Math.random()*tileCount);
        tailLength++;
        score++;
        collisionSound.play();
    }
}

//keys
document.body.addEventListener('keydown', keyDown);

function keyDown(event) {
    //up
    if(event.keyCode == 38 || event.keyCode == 87){
        if (yVelocity == 1)
            return;
        yVelocity = -1;
        xVelocity = 0;
    }
    //down
    if(event.keyCode == 40 || event.keyCode == 83){
        if (yVelocity == -1)
            return;
        yVelocity = 1; 
        xVelocity = 0;
    }
    //left
    if(event.keyCode == 37 || event.keyCode == 65){
        if (xVelocity == 1)
            return;
        yVelocity = 0; 
        xVelocity = -1;
    }
    //right
    if(event.keyCode == 39 || event.keyCode == 87){
        if (xVelocity == -1)
            return;
        yVelocity = 0; 
        xVelocity = 1;
    }
}

drawGame();