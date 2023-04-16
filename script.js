const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const ballRadius = 10;
const ballSpeed = 5;
const ballColor = "#0095DD";

// Add bubble grid variables
const numRows = 5;
const numCols = 10;
const bubbleDiameter = 40;
const bubblePadding = 5;
const bubbleOffsetTop = 30;
const bubbleOffsetLeft = 50;
const bubbleColors = ["#0095DD", "#FFA500", "#FF0000", "#00FF00", "#800080"];

let shootBall = false;
let ballX = canvas.width / 2;
let ballY = canvas.height - 30;
let ballDX = 0;
let ballDY = 0;

// Create a 2D array of bubble objects
let bubbles = [];
for (let row = 0; row < numRows; row++) {
  bubbles[row] = [];
  for (let col = 0; col < numCols; col++) {
    const bubbleColor = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];
    bubbles[row][col] = { x: 0, y: 0, color: bubbleColor, popped: false };
  }
}

const playerWidth = 100;
const playerHeight = 20;
let playerX = (canvas.width - playerWidth) / 2;

const leftKey = 37;
const rightKey = 39;
const spaceKey = 32;
let leftPressed = false;
let rightPressed = false;

document.addEventListener("keydown", keyDownHandler);
document.addEventListener("keyup", keyUpHandler);

function keyDownHandler(e) {
  if (e.keyCode === leftKey) leftPressed = true;
  else if (e.keyCode === rightKey) rightPressed = true;
  else if (e.keyCode === spaceKey && !shootBall) {
    shootBall = true;
    ballDX = 0;
    ballDY = -ballSpeed;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === leftKey) leftPressed = false;
  else if (e.keyCode === rightKey) rightPressed = false;
}

function drawPlayer() {
  ctx.beginPath();
  ctx.rect(playerX, canvas.height - playerHeight, playerWidth, playerHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

function drawBall() {
  ctx.beginPath();
  ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = ballColor;
  ctx.fill();
  ctx.closePath();
}

function updatePlayer() {
  if (leftPressed && playerX > 0) {
    playerX -= 7;
  } else if (rightPressed && playerX < canvas.width - playerWidth) {
    playerX += 7;
  }
}

// Add drawBubbles function
function drawBubbles() {
  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      if (!bubbles[row][col].popped) {
        let bubbleX = col * (bubbleDiameter + bubblePadding) + bubbleOffsetLeft;
        let bubbleY = row * (bubbleDiameter + bubblePadding) + bubbleOffsetTop;
        bubbles[row][col].x = bubbleX;
        bubbles[row][col].y = bubbleY;

        ctx.beginPath();
        ctx.arc(bubbleX, bubbleY, ballRadius, 0, Math.PI * 2);
        ctx.fillStyle = bubbles[row][col].color;
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function updateBall() {
  if (shootBall) {   
 // Collision detection
    for (let row = 0; row < numRows; row++) {
      for (let col = 0; col < numCols; col++) {
        let b = bubbles[row][col];
        if (!b.popped) {
          if (
            ballX > b.x - ballRadius &&
            ballX < b.x + ballRadius &&
            ballY > b.y - ballRadius &&
            ballY < b.y + ballRadius
          ) {
            // Bubble match and pop
            if (ballColor === b.color) {
              b.popped = true;
            }
            shootBall = false;
            ballDY = 0;
          }
        }
      }
    }
  } else {
    ballX = playerX + playerWidth / 2;
    ballY = canvas.height - playerHeight - ballRadius;
}

// Check if ball hits the wall
if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
ballDX = -ballDX;
}

if (ballY + ballDY < ballRadius) {
ballDY = -ballDY;
} else if (ballY + ballDY > canvas.height - ballRadius) {
// Ball is out of bounds, reset it
shootBall = false;
ballDX = 0;
ballDY = 0;
}
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  drawPlayer();
  drawBall();
  drawBubbles();

  updatePlayer();
  updateBall();

  requestAnimationFrame(draw);
}

draw();
