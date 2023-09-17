const board = document.querySelector("#board");
const context = board.getContext("2d");
const scorePoints = document.querySelector("#scorePoints");
const resetBtn = document.querySelector("#resetBtn");
const gameWidth = board.width;
const gameHeight = board.height;
const boardBackground = "#151515";
const snakeColor = "#ffffff";
const snakeBorder = "black";
const foodColor = "#ff00d4";
const unitSize = 25;
var timeout = setTimeout; 
let running = false;
let velocityX = 0;
let velocityY = 0;
let foodX;
let foodY;
let currDirection;
let score = 0;
let highScore = 0;
let snake = [{x: unitSize * 5, y: unitSize* 5}];

window.addEventListener("keydown", changeDirection);
resetBtn.addEventListener("click", resetGame);

gameStart();

function gameStart() {
    running= true;
    scorePoints.textContent = score;
    createFood();
    drawFood();
    nextTick();
};

function nextTick() {
    if(running){
        timeout = setTimeout(()=> {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, 100);
    }
    else{
        displayGameOver();
    }
};

function clearBoard() {
    context.fillStyle = boardBackground;
    context.fillRect(0, 0, gameWidth, gameHeight);
};

function createFood() {
    let isValid = false;
    let newPosX;
    let newPosY;

    while(!isValid) {
        newPosX = Math.round((Math.random() * ((gameWidth - unitSize) - 0) + 0) / unitSize) * unitSize;
        newPosY = Math.round((Math.random() * ((gameWidth - unitSize) - 0) + 0) / unitSize) * unitSize;
        
        for(let i = 0; i < snake.length; i++) {
            if(newPosX == snake[i].x && newPosY == snake[i].y) {
                isValid = false;
                break;
            } else {
                isValid = true;
            }
        }
    }

    foodX = newPosX;
    foodY = newPosY
};

function drawFood() {
    context.fillStyle = foodColor;
    context.fillRect(foodX, foodY, unitSize, unitSize);
};

function moveSnake() {
    if(currDirection == "up") {
        velocityX = 0;
        velocityY = -unitSize;
    }
    if(currDirection == "down") {
        velocityX = 0;
        velocityY = unitSize;
    }
    if(currDirection == "left") {
        velocityX = -unitSize;
        velocityY = 0;
    }
    if(currDirection == "right") {
        velocityX = unitSize;
        velocityY = 0;
    }

    const head = {x: snake[0].x + velocityX, y: snake[0].y + velocityY};
    
    snake.unshift(head);
    if(snake[0].x == foodX && snake[0].y == foodY){
        score+=1;
        scorePoints.textContent = score;
        createFood();
    }
    else{
        snake.pop();
    }     
};

function drawSnake() {
    context.fillStyle = snakeColor;
    context.lineWidth = 1.5;
    context.strokeStyle = snakeBorder;
    snake.forEach(snakePart => {
        context.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
        context.strokeRect(snakePart.x, snakePart.y, unitSize, unitSize);
    })
};

function changeDirection(event) {
    const keyPressed = event.keyCode;
    const UP = 38;
    const DOWN = 40;
    const LEFT = 37;
    const RIGHT = 39;

    const goingUp = (velocityY == -unitSize);
    const goingDown = (velocityY == unitSize);
    const goingLeft = (velocityX == -unitSize);
    const goingRight = (velocityX == unitSize);

    if(keyPressed == UP && !goingDown) {
        currDirection = "up";
    }
    if(keyPressed == DOWN && !goingUp) {
        currDirection = "down";
    }
    if(keyPressed == LEFT && !goingRight) {
        currDirection = "left";
    }
    if(keyPressed == RIGHT && !goingLeft) {
        currDirection = "right";
    }
};

function checkGameOver() {
    if(snake[0].x < 0) {
        running = false;
    }
    if(snake[0].x >= gameWidth - 1) {
        running = false;
    }
    if(snake[0].y < 0) {
        running = false;
    }
    if(snake[0].y >= gameHeight - 1) {
        running = false;
    }

    for(let i = 1; i < snake.length; i+=1){
        if(snake[i].x == snake[0].x && snake[i].y == snake[0].y){
            running = false;
        }
    }
};

function displayGameOver() {
    if(score > highScore) {
        highScore = score;
    }

    context.font = "bold 60px Poppins, sans-serif";
    context.fillStyle = "white";
    context.textAlign = "center";
    context.fillText("Game Over!", gameWidth / 2, gameHeight / 2);
    context.strokeStyle = 'black';
    context.lineWidth = 2;
    context.strokeText("Game Over!", gameWidth / 2, gameHeight / 2);
    
    if(highScore != 0) {
        context.font = "bold 30px Poppins, sans-serif";
        context.fillStyle = "#ff00d4";
        context.textAlign = "center";
        context.fillText("Highscore: " + highScore, gameWidth / 2, (gameHeight / 2) + 40);
        context.strokeStyle = 'black';
        context.lineWidth = 1.5;
        context.strokeText("Highscore: " + highScore, gameWidth / 2, (gameHeight / 2) + 40);
    }

    running = false;
};

function resetGame() {
    clearBoard();
    score = 0;
    velocityX = 0;
    velocityY = 0;
    currDirection = "";
    snake = [{x: unitSize * 5, y: unitSize * 5}];
    clearTimeout(timeout);
    gameStart();
};