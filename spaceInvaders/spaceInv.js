import AlienController from "./enemyController.js";
import Player from "./player.js";
import BulletController from "./bulletController.js";

const canvas = document.getElementById("board");
const ctx = canvas.getContext("2d");
const gameOver = document.getElementById("gameOver");
const gameOverText = document.getElementById("gameOverText");

canvas.width = 500;
canvas.height = 500;

const background = "#151515";

const playerBulletController = new BulletController(canvas, 10, "red");
const enemyBulletController = new BulletController(canvas, 4, "white");
const player = new Player(canvas, 3, playerBulletController);
const enemyController = new AlienController(canvas, enemyBulletController, playerBulletController);

let isGameOver = false;
let win = false;

function gameRun() {
    checkGameOver();
    ctx.fillStyle = background;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    displayGameOver();
    if(!isGameOver) {
        enemyController.draw(ctx);
        player.draw(ctx);
        playerBulletController.draw(ctx);
        enemyBulletController.draw(ctx);
    }
}

function displayGameOver() {
    if(isGameOver) {
        ctx.globalAlpha = 0.6;
        ctx.beginPath();
        ctx.fillStyle = 'black';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalAlpha = 1;

        let text = win ? "You Win" : "Game Over";

        gameOverText.innerText = text;
        gameOver.style.visibility = 'visible';
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

setInterval(gameRun, 1000 / 60);