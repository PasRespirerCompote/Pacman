class Pacman {
    constructor(x, y, width, height, speed) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIR_RIGHT;
        this.nextDirection = this.direction;
        this.currentFrame = 1;
        this.frameCount = 7;

        let timeout = 80 - this.currentFrame * 10;

        setInterval(() => {
            this.changeAnimation();
        }, timeout);
    }


    moveProcess() {
        this.changeDirection();
        this.moveForward();

        if (this.checkCollision())
            this.moveBackward();
    }

    eat() {
        for (let i = 0; i < map.length; i++) {
            for (let j = 0; j < map[0].length; j++) {
                if (map[i][j] === 2 &&
                    this.getMapX() === j &&
                    this.getMapY() === i
                ) {
                    map[i][j] = 0;
                    score += 10;
                }
            }
        }
    }


    moveBackward() {
        switch (this.direction) {
            case DIR_RIGHT:
                this.x -= this.speed;
                break;
            case DIR_UP:
                this.y += this.speed;
                break;
            case DIR_LEFT:
                this.x += this.speed;
                break;
            case DIR_BOTTOM:
                this.y -= this.speed;
                break;
        }
    }


    moveForward() {
        switch (this.direction) {
            case DIR_RIGHT:
                this.x += this.speed;
                break;
            case DIR_UP:
                this.y -= this.speed;
                break;
            case DIR_LEFT:
                this.x -= this.speed;
                break;
            case DIR_BOTTOM:
                this.y += this.speed;
                break;
        }
    }


    checkCollision() {
        const x1 = this.getMapX();
        const y1 = this.getMapY();
        const x2 = this.getMapXRightSide();
        const y2 = this.getMapYRightSide();

        return (
            map[y1][x1] === 1 ||
            map[y2][x1] === 1 ||
            map[y1][x2] === 1 ||
            map[y2][x2] === 1);
    }


    checkGhostCollision() {
        for (let i = 0; i < ghosts.length; i++) {
            let ghost = ghosts[i];
            if (ghost.getMapX() === this.getMapX() && ghost.getMapY() === this.getMapY())
                return true;
        }

        return false;
    }


    changeDirection() {
        if (this.direction === this.nextDirection)
            return;

        let tmpDirection = this.direction;
        this.direction = this.nextDirection;
        this.moveForward();

        if (this.checkCollision()) {
            this.moveBackward();
            this.direction = tmpDirection;
        }

        else {
            this.moveBackward();
        }

    }


    changeAnimation() {
        this.currentFrame = this.currentFrame === this.frameCount ? 1 : this.currentFrame + 1;
    }


    draw() {
        canvasContext.save();
        canvasContext.translate(
            this.x + blockSize / 2,
            this.y + blockSize / 2
            );

        canvasContext.rotate((this.direction * 90 * Math.PI) / 180);

        canvasContext.translate(
            -this.x - blockSize / 2,
            -this.y - blockSize / 2
        );

        canvasContext.drawImage(
            pacmanFrames,
            (this.currentFrame - 1) * blockSize,
            0,
            blockSize,
            blockSize,
            this.x,
            this.y,
            this.width,
            this.height
        );

        canvasContext.restore();
    }


    getMapX() {
        return parseInt(this.x / blockSize);
    }


    getMapY() {
        return parseInt(this.y / blockSize);
    }


    getMapXRightSide() {
        return parseInt((this.x + 0.9999 * blockSize) / blockSize);
    }


    getMapYRightSide() {
        return parseInt((this.y + 0.9999 * blockSize) / blockSize);
    }
}