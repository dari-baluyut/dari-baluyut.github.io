export default class Player {
    leftPressed = false;
    rightPressed = false;
    shootPressed = false;

    constructor(canvas, velocity, bulletController) {
        this.canvas = canvas;
        this.velocity = velocity;
        this.bulletController = bulletController;

        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
        this.width = 50;
        this.height = 48;
        this.image = new Image();
        this.image.src = "images/player.png";

        document.addEventListener("keyup", this.keyup);
        document.addEventListener("keydown", this.keydown);
    }

    draw(ctx) {
        if(this.shootPressed) {
            this.bulletController.shoot(this.x + (this.width / 2), this.y, 4, 10);
        }
        this.move();
        this.checkWallCollision();
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    checkWallCollision() {
        // left
        if(this.x < 0) {
            this.x = 0;
        }

        // right
        if(this.x > this.canvas.width - this.width) {
            this.x = this.canvas.width - this.width;
        }
    }

    move() {
        if(this.leftPressed) {
            this.x += -this.velocity;
        } else if(this.rightPressed) {
            this.x += this.velocity;
        }
    }

    keyup = event => {
        if(event.code == "ArrowLeft") {
            this.leftPressed = false;
        }
        if(event.code == "ArrowRight") {
            this.rightPressed = false;
        }
        if(event.code == "Space") {
            this.shootPressed = false;
        }
    };

    keydown = event => {
        if(event.code == "ArrowLeft") {
            this.leftPressed = true;
        }
        if(event.code == "ArrowRight") {
            this.rightPressed = true;
        }
        if(event.code == "Space") {
            this.shootPressed = true;
        }
    };

    reset() {
        this.x = this.canvas.width / 2;
        this.y = this.canvas.height - 75;
    }
}