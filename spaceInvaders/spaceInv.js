import AlienController from "./enemyController.js";
import Player from "./player.js";
import BulletController from "./bulletController.js";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const scorePoints = document.querySelector("#scorePoints");
const resetBtn = document.querySelector("#resetBtn");
let score = 0;
let highScore = 0;

canvas.width = 500;
canvas.height = 500;

const background = "#151515";

const playerBulletController = new BulletController(canvas, 10, "red");
const enemyBulletController = new BulletController(canvas, 4, "white");
const player = new Player(canvas, 3, playerBulletController);
const enemyController = new AlienController(canvas, enemyBulletController, playerBulletController);
resetBtn.addEventListener("click", resetGame);

let isGameOver = false;
let win = false;

function gameRun() {
    checkGameOver();
    if(!isGameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);

        score = enemyController.getPoints();
        scorePoints.textContent = score;
    }
    displayGameOver();
}

function displayGameOver() {
    if(isGameOver) {
        if(score > highScore) {
            highScore = score;
        }

        ctx.globalAlpha = 0.6;
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        let text = win ? "You Win" : "Game Over";

        ctx.font = "bold 60px Poppins, sans-serif";
        ctx.fillStyle = "white";
        ctx.textAlign = "center";
        ctx.fillText(text, canvas.width / 2, canvas.height / 2);

        if(highScore != 0) {
            ctx.font = "bold 30px Poppins, sans-serif";
            ctx.fillStyle = "#ff00d4";
            ctx.textAlign = "center";
            ctx.fillText("Highscore: " + highScore, canvas.width / 2, (canvas.height / 2) + 40);
        }
    }
}

function checkGameOver() {
    if(isGameOver) {
        return;
    }
    if(enemyBulletController.collisionDetected(player)) {
        isGameOver = true;
    }

    if(enemyController.collisionDetected(player)) {
        isGameOver = true;
    }

    if(enemyController.alienRows.length === 0) {
        win = true;
        isGameOver = true;
    }
}

function resetGame() {
    score = 0;
    isGameOver = false;
    win = false;

    enemyController.reset();
    player.reset();
    playerBulletController.reset();
    enemyBulletController.reset();
};

setInterval( function() {
    if(!isGameOver) {
        gameRun();
    }
}, 1000 / 60);