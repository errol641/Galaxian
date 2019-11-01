class Monster extends Sprite {
    constructor(img, missileIMG, xpos = 0, ypos = 0, isVisible = false) {
        super(img, xpos, ypos, isVisible);
        this.missile = new Sprite(missileIMG, 0, 0, false);
    }
    shootMissileTowards(player) {
        let x = this.xpos + (this.width / 2) - (this.missile.width / 2);
        let y = this.ypos + this.missile.height;   
        let dx = player.xpos - this.xpos;
        let dy = player.ypos - this.ypos;
        let magnitude = Math.sqrt((dx * dx) + (dy * dy));
        dx = (MONSTER_MISSILE_SPEED * dx) / magnitude; 
        dy = (MONSTER_MISSILE_SPEED * dy) / magnitude;
        dx += getRandomInt(0,1) == 0? 1:-1;
        dy += getRandomInt(0,1) == 0? 1:-1;
        this.missile.setXY(x,y);
        this.missile.setVelocity(dx, dy);
        this.missile.setVisible(true);
    }
    moveRandomly() {
        let x = getRandomInt(0,5);
        if(x == 0) {
            this.xv += (getRandomInt(0,1) == 0? -1:1) * getRandomInt(1, 2);
            this.yv += (getRandomInt(0,1) == 0? -1:1) * getRandomInt(1, 2);
        }
    }
}