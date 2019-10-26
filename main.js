let monsterIMG, playerImg, missileIMG;
const ROWS = 3;
const COLS = 10;
const WIDTH = 1024;
const HEIGHT = 768;
const MISSILE_SPEED = 16;
const PLAYER_SPEED = 6;
let GAME_OVER = false;
let NUM_ALIVE = ROWS * COLS;
let monsters = new Array(ROWS * COLS);
let player;
let missile;

function createPlayer() {
    player = new Sprite(playerIMG, 450, 700, false);
    player.setBoundry(0, WIDTH - 100, 550, 700);
}

function createMissile() {
    missile = new Sprite(missileIMG, 0, 0, true);
}

function createMonsters() {

    let ypos = 40;
    for(let i = 0; i < monsters.length; i++)
    {
        let xpos = 110 + (((i + 1) * 80) % (COLS * 80));
        monsters[i] = new Sprite(monsterIMG, xpos, ypos, false);
        if((i+1) % COLS == 0)
            ypos+= 80;
    }   
}

function updatePlayer() {
    player.setDead(true);
}

function fireMissile() {
    
    let x = player.xpos + (player.width / 2) - (missileIMG.width / 2);
    let y = player.ypos - missileIMG.height;
    missile.setXY(x,y);
    missile.setyVel(MISSILE_SPEED, 'up');
    missile.setDead(false);
}

function processCollisions() {

    if(missile.isOnScreen()) {
        for(let i = 0; i < monsters.length; i++) {
            let monster = monsters[i];
            if(!monster.isDead && monster.collidesWith(missile))
            {   
                monster.setDead(true);
                missile.setDead(true);
                --NUM_ALIVE;
            }
        }
    }
}

function preload() {
    monsterIMG = loadImage('./data/monster.png');
    playerIMG = loadImage('./data/ship.png');
    missileIMG = loadImage('./data/rocket.png', img => {
        img.resize(25,0);
    });
}

function setup() {
    createCanvas(WIDTH,HEIGHT);
    createMonsters();
    createPlayer();
    createMissile();
}

function checkKeys() {
    // A
    if(keyIsDown(65)) {
        player.xpos = player.xpos - PLAYER_SPEED;
    }
    // D
    if(keyIsDown(68)) {
        player.xpos = player.xpos + PLAYER_SPEED;
    }
    // W
    if(keyIsDown(87)) {
        player.ypos = player.ypos - PLAYER_SPEED;
    }
    // S
    if(keyIsDown(83)) {
        player.ypos = player.ypos + PLAYER_SPEED;
    }
}

function resetGame() {
    NUM_ALIVE = ROWS * COLS;
    monsters = new Array(ROWS * COLS);
    SP.sprites = new Array();
    createMonsters();
    createPlayer();
    createMissile();
}

function keyPressed() {
    if(keyCode === 32 && !(missile.isOnScreen())) {
        fireMissile();
    }
}

function pre() {
    processCollisions();
    if(NUM_ALIVE == 0)
        resetGame();
    checkKeys();
}

function draw() {
    pre();
    background(0);
    SP.updateSprites();         
}