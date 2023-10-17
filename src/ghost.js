class Ghost {
    constructor(x, y, width, height, speed, imageX, imageY, imageWidth, imageHeight, range) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.speed = speed;
        this.direction = DIR_RIGHT;
        this.imageX = imageX;
        this.imageY = imageY;
        this.imageWidth = imageWidth;
        this.imageHeight = imageHeight;
        this.range = range;
        this.randomTargetIndex = parseInt(Math.random() * randomGhostTargets.length);
        this.target = randomGhostTargets[this.randomTargetIndex];

        setInterval(() => {
            this.changeRandomDirection();
        }, 10000);
    }


    moveProcess() {
        if (this.isInRangeOfPacman())
            this.target = pacman;
        else
            this.target = randomGhostTargets[this.randomTargetIndex];
        this.changeDirection();
        this.moveForward();

        if (this.checkCollision())
            this.moveBackward();
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


    isInRangeOfPacman() {
        let xDistance = Math.abs(pacman.getMapX() - this.getMapX());
        let yDistance = Math.abs(pacman.getMapY() - this.getMapY());

        return Math.sqrt(xDistance * xDistance + yDistance * yDistance) <= this.range;
    }


    changeRandomDirection() {
        this.randomTargetIndex += 1;
        this.randomTargetIndex = this.randomTargetIndex % 4;
    }

    calculateNewDirection(map, destX, destY) {
        let mp = [];
        for (let i = 0; i < map.length; i++)
            mp[i] = map[i].slice();

        let queue = [
            {
                x: this.getMapX(),
                y: this.getMapY(),
                moves: []
            },
        ];

        while (queue.length > 0) {
            let poped = queue.shift();
            if (poped.x === destX && poped.y === destY)
                return poped.moves[0];
            else {
                mp[poped.y][poped.x] = 1
                let neighbourList = this.addNeighbours(poped, mp);

                for (let i = 0; i < neighbourList.length; i++)
                    queue.push(neighbourList[i]);
            }
        }
    }


    addNeighbours(poped, mp) {
        let queue = [];
        let rowCount = mp.length;
        let colCount = mp[0].length;

        // Left
        if
        (
            poped.x - 1 >= 0 &&
            poped.x - 1 < rowCount &&
            mp[poped.y][poped.x - 1] !== 1
        )
        {
            let tmpMoves = poped.moves.slice();
            tmpMoves.push(DIR_LEFT);
            queue.push({x: poped.x - 1, y: poped.y, moves: tmpMoves});
        }

        // Right
        if
        (
            poped.x + 1 >= 0 &&
            poped.x + 1 < rowCount &&
            mp[poped.y][poped.x + 1] !== 1
        )
        {
            let tmpMoves = poped.moves.slice();
            tmpMoves.push(DIR_RIGHT);
            queue.push({x: poped.x + 1, y: poped.y, moves: tmpMoves});
        }

        // Up
        if
        (
            poped.y - 1 >= 0 &&
            poped.y - 1 < rowCount &&
            mp[poped.y - 1][poped.x] !== 1
        )
        {
            let tmpMoves = poped.moves.slice();
            tmpMoves.push(DIR_UP);
            queue.push({x: poped.x, y: poped.y - 1, moves: tmpMoves});
        }

        // Down
        if
        (
            poped.y + 1 >= 0 &&
            poped.y + 1 < rowCount &&
            mp[poped.y + 1][poped.x] !== 1
        )
        {
            let tmpMoves = poped.moves.slice();
            tmpMoves.push(DIR_BOTTOM);
            queue.push({x: poped.x, y: poped.y + 1, moves: tmpMoves});
        }

        return queue;
    }


    changeDirection() {
        let tmpDirection = this.direction;
        this.direction = this.calculateNewDirection(
            map,
            this.target.x / blockSize,
            this.target.y / blockSize
        );

        if (typeof this.direction === "undefined") {
            this.direction = tmpDirection;
            return;
        }

        this.moveForward();

        if (this.checkCollision()) {
            this.moveBackward();
            this.direction = tmpDirection;
        }
        else {
            this.moveBackward();
        }
    }


    draw() {
        canvasContext.save();
        canvasContext.drawImage(
            ghostFrames,
            this.imageX,
            this.imageY,
            this.imageWidth,
            this.imageHeight,
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