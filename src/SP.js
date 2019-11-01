class SP {

    constructor() {
        let sprite = new Node(this);
        SP.sprites.add(sprite);
    }

    static updateSprites() {
        let ptr = SP.sprites.head;
        while(ptr != null)
        {
            let sp = ptr.payload;
            if(sp.isVisible)
            {
                if(sp.hasBounderies) {
                    sp.checkBoundaries();
                }
                sp.show();
                sp.move();
                ptr = ptr.next;
            } else if(!sp.isVisible) {
                sp.setVelocity(0,0);
                ptr = ptr.next;
            } else if(sp.isDead) {
                let hold = ptr;
                ptr = ptr.next;
                SP.sprites.remove(hold);
            } else {
                ptr = ptr.next;
            }
        }   
    }

    collidesWith(sprite) {

        const { width, height } = this.img;
        const { xpos, ypos } = this;

        let srcXPos = sprite.xpos;
        let srcYPos = sprite.ypos;
        let srcWidth = sprite.width;
        let srcHeight = sprite.height;

        if (xpos < srcXPos + srcWidth &&
            xpos + width > srcXPos &&
            ypos < srcYPos + srcHeight &&
            ypos + height > srcYPos) {
                return true;
         }
        return false;
    }

    checkBoundaries() {

        if(this.xpos < this.xMIN) {
            if(this.onBoundryHit === 'bounce') {
                this.xv = -1 * this.xv;
            } else {
                this.xpos = this.xMIN;
            }
        } else if(this.xpos > this.xMAX) {
            if(this.onBoundryHit === 'bounce') {
                this.xv = -1 * this.xv;
            } else {
                this.xpos = this.xMAX;
            }
        }

        if(this.ypos < this.yMIN) {
            if(this.onBoundryHit === 'bounce') {
                this.yv = -1 * this.yv; 
            } else {
                this.ypos = this.yMIN;
            }
        } else if(this.ypos > this.yMAX) {
            if(this.onBoundryHit === 'bounce') {
                this.yv = -1 * this.yv;
            } else {
                this.ypos = this.yMAX;
            }
        }
    }
    
    setBoundry(xMIN, xMAX, yMIN, yMAX, onBoundryHit) {
        this.hasBounderies = true;
        this.xMIN = xMIN;
        this.xMAX = xMAX;
        this.yMIN = yMIN;
        this.yMAX = yMAX;
        this.onBoundryHit = onBoundryHit;
    }

    removeBoundry() {
        this.hasBounderies = false;
    }
}
SP.sprites = new LinkedList();