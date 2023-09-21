const canvas = document.querySelector("#board");
const context = canvas.getContext('2d');
const shapeHeld = document.querySelector("#holding");
const shapeHeldContext = shapeHeld.getContext('2d');
const gameOverText = document.getElementById("gameOverText");
const highScoreText = document.getElementById("highScoreText");
const highScorePoints = document.getElementById("highScorePoints");
var timeout = setTimeout; 
const gameWidth = canvas.width;
const gameHeight = canvas.height;
let gameRunning = true;
let highScore = 0;
let curShape;
let cleared = false;
let multiplier = 1;

context.scale(20, 20);
shapeHeldContext.scale(20, 20);

function checkCompletedRows() {
    let rowCount = 1;

    outer: for(let y = board.length - 1; y > 0; --y) {
        for(let x = 0; x < board[y].length; ++x) {
            if(board[y][x] == 0) {
                continue outer;
            }
        }

        const row = board.splice(y, 1)[0].fill(0);
        board.unshift(row);
        ++y;
        
        player.score += rowCount * 10 * multiplier;
        rowCount *= 2;

        cleared = true;
    }

    if(cleared) {
        multiplier += multiplier;
    } else {
        multiplier = 1;
    }

    cleared = false;
}

function collision(board, player) {
    const [m, o] = [player.matrix, player.pos];

    for(let y = 0; y < m.length; ++y) {
        for(let x = 0; x < m[y].length; ++x) {
            if(m[y][x] !== 0 && (board[y + o.y] && board[y + o.y][x + o.x]) !== 0) {
                return true;
            }
        }
    }
    return false;
}

function createMatrix(width, height) {
    const matrix = [];
    while(height--) {
        matrix.push(new Array(width).fill(0));
    }

    return matrix;
}

function createHeldMatrix(width, height) {
    const heldMatrix = [];
    while(height--) {
        heldMatrix.push(new Array(width).fill(0));
    }

    return heldMatrix;
}

function createShape(type) {
    if(type == 'T') {
        return [
            [0, 0, 0],
            [1, 1, 1],
            [0, 1, 0]
        ];
    } else if(type == 'I') {
        return [
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0],
            [0, 2, 0, 0]
        ];
    } else if(type == 'J') {
        return [
            [0, 3, 0],
            [0, 3, 0],
            [3, 3, 0]
        ];
    } else if(type == 'O') {
        return [
            [4, 4],
            [4, 4]
        ];
    } else if(type == 'L') {
        return [
            [0, 5, 0],
            [0, 5, 0],
            [0, 5, 5]
        ];
    } else if(type == 'S') {
        return [
            [0, 6, 6],
            [6, 6, 0],
            [0, 0, 0]
        ];
    } else if(type == 'Z') {
        return [
            [7, 7, 0],
            [0, 7, 7],
            [0, 0, 0]
        ];
    }
}

function draw() {
    context.fillStyle = '#151515';
    context.fillRect(0, 0, canvas.width, canvas.height);

    drawMatrix(board, {x: 0, y: 0});
    drawMatrix(player.matrix, player.pos);
}

function drawMatrix(matrix, offset) {
    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                context.fillStyle = colors[value];
                context.fillRect((x + 0.1) + offset.x, (y + 0.1) + offset.y, 0.8, 0.8);
            }
        });
    });
}

function drawHeldMatrix(matrix) {
    shapeHeldContext.fillStyle = '#151515';
    shapeHeldContext.fillRect(0, 0, shapeHeld.width, shapeHeld.height);

    matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                shapeHeldContext.fillStyle = colors[value];
                shapeHeldContext.fillRect((x + 0.1) +  1.5, (y + 0.1) + 1.5, 0.8, 0.8);
            }
        });
    });
}

function merge(board, player) {
    player.matrix.forEach((row, y) => {
        row.forEach((value, x) => {
            if(value !== 0) {
                board[y + player.pos.y][x + player.pos.x] = value;
            }
        });
    });
}

function playerDrop() {
    player.pos.y++;
    if(collision(board, player)) {
        player.pos.y--;
        merge(board, player);
        playerReset();
        checkCompletedRows();
        updateScore();
        swapped = false;
    }
    dropCounter = 0;
}

function playerMove(direction) {
    if(gameRunning) {
        player.pos.x += direction;
        
        if(collision(board, player)) {
            player.pos.x -= direction;
        }
    }
}

function quickDrop() {
    if(gameRunning) {
        while(!collision(board, player)) {
            player.pos.y++;
        }
        player.pos.y--;
        merge(board, player);
        playerReset();
        checkCompletedRows();
        updateScore();
        swapped = false;
    }
}

function playerHold() {
    drawHeldMatrix(createShape(curShape));
    if(heldShape == null) {
        heldShape = createShape(curShape);
        playerReset();
    } else {
        let playerCopy = createShape(curShape);
        player.matrix = heldShape;
        heldShape = playerCopy;
        player.pos.y = 0;
        player.pos.x = (board[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);
    }

    swapped = true;
}

function playerReset() {
    const shapes = 'TIJOLSZ';
    curShape = shapes[shapes.length * Math.random() | 0]
    if(gameRunning) {
        player.matrix = createShape(curShape);
        player.pos.y = 0;
        player.pos.x = (board[0].length / 2 | 0) - (player.matrix[0].length / 2 | 0);

        if(collision(board, player)) {
            displayGameOver();
        }
    }
}

function displayGameOver() {
    gameRunning = false;

    if(player.score > highScore) {
        highScore = player.score;
    }

    context.globalAlpha = 0.6;
    context.beginPath();
    context.fillStyle = 'black';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.globalAlpha = 1;

    gameOverText.style.visibility = 'visible';
    if(highScore != 0) {
        highScorePoints.innerText = highScore;
        highScoreText.style.visibility = 'visible';
    }
}

function playerRotate(direction) {
    const pos = player.pos.x
    let offset = 1;
    rotate(player.matrix, direction);
    
    while(collision(board, player)) {
        player.pos.x += offset;
        offset = -(offset + (offset > 0 ? 1 : -1));
        if(offset > player.matrix[0].length) {
            rotate(player.matrix, -direction);
            player.pos.x = pos;
            return;
        }
    }
}

function rotate(matrix, direction) {
    for(let y = 0; y < matrix.length; ++y) {
        for(let x = 0; x < y; ++x) {
            [
                matrix[x][y],
                matrix[y][x]
            ] = [
                matrix[y][x],
                matrix[x][y]
            ];
        }
    }

    if(direction > 0) {
        matrix.forEach(row => row.reverse());
    } else {
        matrix.reverse();
    }
}

let dropCounter = 0;
let dropInterval = 1000;

let lastTime = 0;
function update(time = 0) {
    const deltaTime = time - lastTime;
    lastTime = time;
    dropCounter += deltaTime;

    if(dropCounter > dropInterval) {
        playerDrop();
    }

    if(gameRunning) {
        draw();
    }

    requestAnimationFrame(update);
}

function updateScore() {
    document.getElementById('scorePoints').innerText = player.score;
}

function resetGame() {
    gameRunning = true;

    gameOverText.style.visibility = 'hidden';
    highScoreText.style.visibility = 'hidden';

    player.score = 0;
    board.forEach(row => row.fill(0));

    heldShape = null;
    shapeHeldContext.fillStyle = '#151515';
    shapeHeldContext.fillRect(0, 0, shapeHeld.width, shapeHeld.height);

    playerReset();
    updateScore();
    update();
}

const colors = [
    null,
    'purple',
    'cyan',
    'blue',
    'yellow',
    'orange',
    'green',
    'red'
]

const board = createMatrix(12, 20);

const player = {
    pos: {x: 0, y: 0},
    matrix: null,
    score: 0
};

let heldShape = null;
let swapped = false;

document.addEventListener('keydown', event => {
    if(gameRunning) {
        if(event.key == "ArrowLeft") {
            playerMove(-1);
        }
        if(event.key == "ArrowRight") {
            playerMove(1);
        }
        if(event.key == "ArrowDown") {
            playerDrop();
        }
        if(event.key == "z") {
            playerRotate(-1);
        }
        if(event.key == "ArrowUp") {
            playerRotate(1);
        }
        if(event.key == " ") {
            quickDrop();
        }
        if(!swapped) {
            if(event.key == "Shift") {
                playerHold();
            }
        }
    }
});

resetBtn.addEventListener("click", resetGame);
playerReset();
updateScore();
update();