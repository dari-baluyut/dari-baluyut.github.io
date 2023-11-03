import Alien from "./enemy.js";
import MoveDirection from "./moveDirection.js";

export default class AlienController {
    alienMap = [
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1],
        [1, 1, 1, 1, 1, 1, 1, 1, 1]
    ];

    alienRows = [];

    curDirection = MoveDirection.right;
    xVelocity = 0;
    yVelocity = 0;
    defaultXVelocity = 1;
    defaulyYVelocity = 1;
    
    points = 0;

    defaultMoveDownTimer = 30;
    moveDownTimer = this.defaultMoveDownTimer;

    defaultBulletTimer = 100;
    bulletTimer = this.defaultBulletTimer;

    constructor(canvas, enemyBulletController, playerBulletController) {
        this.canvas = canvas;
        this.enemyBulletController = enemyBulletController;
        this.playerBulletController = playerBulletController;

        this.createAliens();
    }

    draw(ctx) {
        this.decrementMoveDownTimer();
        this.updateVelAndDir();
        this.checkCollision();
        this.drawAliens(ctx);
        this.resetMoveDownTimer();
        this.shootBullet();
    }

    checkCollision() {
        this.alienRows.forEach((alienRow) => {
            alienRow.forEach((alien, alienIndex) => {
                if(this.playerBulletController.collisionDetected(alien)) {
                    this.points += 10;
                    alienRow.splice(alienIndex, 1);
                }
            });
        });

        this.alienRows = this.alienRows.filter((alienRow) => alienRow.length > 0);
    }

    shootBullet() {
        this.bulletTimer--;
        if(this.bulletTimer <= 0) {
            this.bulletTimer = this.defaultBulletTimer;
            
            const allAliens = this.alienRows.flat();
            const alienIndex = Math.floor(Math.random() * allAliens.length);
            const alien = allAliens[alienIndex];
            
            this.enemyBulletController.shoot(alien.x, alien.y, -3);
        }
    }

    resetMoveDownTimer() {
        if(this.moveDownTimer <= 0) {
            this.moveDownTimer = this.defaultMoveDownTimer;
        }
    }

    decrementMoveDownTimer() {
        if(this.curDirection === MoveDirection.downLeft ||
            this.curDirection === MoveDirection.downRight) {
                this.moveDownTimer--;
            }
    }

    updateVelAndDir() {
        for(const alienRow of this.alienRows) {
            if(this.curDirection == MoveDirection.right) {
                this.xVelocity = this.defaultXVelocity;
                this.yVelocity = 0;
                
                const rightMostAlien = alienRow[alienRow.length - 1];
                if(rightMostAlien.x + rightMostAlien.width >= this.canvas.width) {
                    this.curDirection = MoveDirection.downLeft;
                    break;
                }
            } else if(this.curDirection === MoveDirection.downLeft) {
                if(this.moveDown(MoveDirection.left)) {
                    break;
                }
            } else if(this.curDirection === MoveDirection.left) {
                this.xVelocity = -this.defaultXVelocity;
                this.yVelocity = 0;

                const leftMostAlien = alienRow[0];
                if(leftMostAlien.x <= 0) {
                    this.curDirection = MoveDirection.downRight;
                    break;
                }
            } else if(this.curDirection === MoveDirection.downRight) {
                if(this.moveDown(MoveDirection.right)) {
                    break;
                }
            }
        }
    }

    moveDown(newDirection) {
        this.xVelocity = 0;
        this.yVelocity = this.defaulyYVelocity;
        
        if(this.moveDownTimer <= 0) {
            this.curDirection = newDirection;
            return true;
        }
        
        return false;
    }

    drawAliens(ctx) {
        this.alienRows.flat().forEach((alien) => {
            alien.move(this.xVelocity, this.yVelocity);
            alien.draw(ctx);
        });
    }

    createAliens() {
        this.alienMap.forEach((row, rowIndex) => {
            this.alienRows[rowIndex] = [];
            row.forEach((alienNum, alienIndex) => {
                if(alienNum == 1) {
                    this.alienRows[rowIndex].push(new Alien(alienIndex * 50, rowIndex * 35));
                }
            });
        });
    }

    collisionDetected(sprite) {
        return this.alienRows.flat().some((alien) => alien.collisionDetected(sprite));
    }

    getPoints() {
        return this.points;
    }

    reset() {
        this.points = 0;
        this.curDirection = MoveDirection.right;
        this.createAliens();
    }
}