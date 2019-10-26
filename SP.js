class SP {

    constructor() {
        SP.sprites.push(this);
    }

    static updateSprites() {
        for(let i = 0; i < SP.sprites.length; i++) {
            let sp = SP.sprites[i];
            if(!sp.isDead)
            {
                sp.show();
                sp.move();
                if(sp.hasBounderies) {
                    sp.checkBoundaries();
                }            
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
            this.xpos = this.xMIN;
        } else if(this.xpos > this.xMAX) {
            this.xpos = this.xMAX;
        }

        if(this.ypos < this.yMIN) {
            this.ypos = this.yMIN;
        } else if(this.ypos > this.yMAX) {
            this.ypos = this.yMAX;
        }
    }

    setBoundry(xMIN, xMAX, yMIN, yMAX) {
        this.hasBounderies = true;
        this.xMIN = xMIN;
        this.xMAX = xMAX;
        this.yMIN = yMIN;
        this.yMAX = yMAX;
    }

    removeBoundry() {
        this.hasBounderies = false;
    }
}
SP.sprites = new Array();