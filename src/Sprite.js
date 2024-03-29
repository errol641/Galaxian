
class Sprite extends SP {

    constructor(img, xpos = 0, ypos = 0, isVisible = true) {
        super();
        this.xpos = xpos;
        this.ypos = ypos;
        this.xv = 0;
        this.yv = 0;
        this.img = img;
        this.width = img.width;
        this.height = img.height;
        this.isVisible = isVisible;
        this.isDead = false;
        this.hasBounderies = false;
    }

    isOnScreen() {
        let { xpos, ypos, width, height } = this;
        let canvasWidth = p5.width;
        let canvasHeight = p5.height;
        let dy;
        let dx;

        if(!this.isVisible) {
            return false;
        }

        if((ypos > 0 && ypos < canvasHeight) || (xpos > 0 && xpos < canvasWidth)) {
            return true;
        } else {
            if(ypos < 0) {
                dy = -1 * ypos;
            } else if(ypos > canvasHeight) {
                dy = ypos - canvasHeight;
            }
            if(xpos < 0) {
                dx = (-1 * xpos);
            } else if(xpos > canvasWidth) {
                dx = xpos - canvasWidth;
            }
            if(dy > height || dx > width) {
                return false;
            } else {
                return true;
            }
        } 
    }

    setVisible(state) {
        this.isVisible = state;
    }

    setDead(state) {
        this.isDead = state;
    }

    resize(w, h) {
        let { width, height, img } = this;
        img.resize(w, h);
        width = img.width;
        height = img.height;        
    }

    setXY(xpos, ypos) {
        this.xpos = xpos;
        this.ypos = ypos;
    }
    setSpeed(xv, yv) {
        this.xv = xv;
        this.yv = yv;
    }

    setVelocity(xv, yv) {
        this.xv = xv;
        this.yv = yv;
    }

    setxVel(xvel, direction) {
        if(direction === 'right') {
            this.xv = xvel;
        } else if(direction === 'left') {
            this.xv = -xvel;
        } else {
            this.xv = xvel;
        }
    }

    setyVel(yvel, direction) { 
        if(direction === 'up') {
            this.yv = -yvel;
        } else if(direction === 'down') {
            this.yv = yvel;
        } else {
            this.yv = yvel;
        }
    }
    show() {
        image(this.img, this.xpos, this.ypos);
    }
    move() {
        this.xpos += this.xv;
        this.ypos += this.yv;
    }               
}
