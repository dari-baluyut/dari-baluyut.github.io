import Bullet from "./bullet.js";

export default class BulletController {
    bullets = [];
    cooldown = 0;

    constructor(canvas, overheatLimit, bulletColor) {
        this.canvas = canvas;
        this.overheatLimit = overheatLimit;
        this.bulletColor = bulletColor;
    }

    draw(ctx) {
        this.bullets = this.bullets.filter((bullet) => bullet.y + bullet.width > 0 && bullet.y <= this.canvas.height);

        this.bullets.forEach((bullet) => bullet.draw(ctx));
        if(this.cooldown > 0) {
            this.cooldown--;
        }
    }

    collisionDetected(sprite) {
        const bulletHit = this.bullets.findIndex((bullet) => bullet.collisionDetected(sprite));

        if(bulletHit >= 0) {
            this.bullets.splice(bulletHit, 1);
            return true;
        }

        return false;
    }

    shoot(x, y, velocity, cooldown = 0) {
        if(this.cooldown <= 0 && this.bullets.length < this.overheatLimit) {
            const bullet = new Bullet(this.canvas, x, y, velocity, this.bulletColor);
            this.bullets.push(bullet);
        }
        this.cooldown = cooldown;
    }
}