export default class Alien {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.width = 44;
        this.height = 32;
        
        this.image = new Image();
        this.image.src = "images/enemy.png";
    }

    draw(ctx) {
        ctx.drawImage(this.image, this.x, this.y, this.width, this.height);
    }

    move(xVel, yVel) {
        this.x += xVel;
        this.y += yVel;
    }

    collisionDetected(sprite) {
        if(this.x + this.width > sprite.x && this.x < sprite.x + sprite.width && 
            this.y + this.height > sprite.y && this.y < sprite.y + sprite.height) {
            return true;
        } else {
            return false;
        }
    }
}