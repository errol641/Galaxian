let monsterIMG, playerImg, missileIMG;
const WIDTH = 1024;
const HEIGHT = 768;
const MISSILE_SPEED = 20;
const MONSTER_MISSILE_SPEED = 5;
const PLAYER_SPEED = 6;
const DELAY_MIN = 3500;
const DELAY_MAX = 4000;
let GAME_OVER = false;
let startTime;

let LEVEL = 50;
let NUM_MONSTERS = (LEVEL * 2) + 2;
let NUM_MONSTER_MISSILES = NUM_MONSTERS;
let NUM_ALIVE = NUM_MONSTERS;

let Monsters = new LinkedList();
let monsterMissiles = new Array();
let Player;
let playerMissile;

function createPlayer() {
    Player = new Sprite(playerIMG, 450, 700, true);
    Player.setBoundry(-50, WIDTH - 50, 550, 700, 'stop');
}

function createMissile() {
    playerMissile = new Sprite(missileIMG, 0, 0, false);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createMonsters() {

    for(let i = 0; i < NUM_MONSTERS; i++)
    {
        let xpos = Math.floor(Math.random() * (WIDTH - monsterIMG.width));
        let ypos = Math.floor(Math.random() * (HEIGHT/4));
        let monster = new Monster(monsterIMG, missileIMG, xpos, ypos, true);    
        monster.setBoundry(0,WIDTH - monsterIMG.width,0, 300, 'bounce');
        monster.setxVel(getRandomInt(1,4) == 2? -1:1);
        monster.setyVel(getRandomInt(1,4) == 3? 1:-1);

        monsterMissiles.push(monster.missile);
        Monsters.add(new Node(monster));
    }       
}

function fireMissile() {
    
    let x = Player.xpos + (Player.width / 2) - (missileIMG.width / 2);
    let y = Player.ypos - missileIMG.height;
    playerMissile.setXY(x,y);
    playerMissile.setyVel(MISSILE_SPEED, 'up');
    playerMissile.setVisible(true);
}

function calculateAngle(opp, adj) {
    return Math.atan(opp/adj);
}

function fireMonsterMissiles() {
    let monsterNode = Monsters.head;
    while(monsterNode != null) {
        let monster = monsterNode.payload;
        monster.shootMissileTowards(Player);
        monsterNode = monsterNode.next;
    }
}

function processCollisions() {

    if(playerMissile.isOnScreen() && playerMissile.ypos <= 300) {
        let monsterNode = Monsters.head;
        while(monsterNode != null) {
            let monster = monsterNode.payload;
            if(playerMissile.collidesWith(monster)) {
                playerMissile.setVisible(false);
                playerMissile.setVelocity(0,0);
                monster.setVisible(false);
                monster.setDead(true);

                // Remove monster from list
                let hold = monsterNode;
                monsterNode = monsterNode.next;
                Monsters.remove(hold);

                --NUM_ALIVE;
            } else {
                monsterNode = monsterNode.next;
            }
        }
    }

    for(let i = 0; i < monsterMissiles.length; i++) {
        let missile = monsterMissiles[i];
        if(missile.isOnScreen() && missile.ypos >= 550 && missile.collidesWith(Player)) {
            Player.setVisible(false);
            missile.setVisible(false);
            GAME_OVER = true;            
        }
    }
}

function preload() {
    monsterIMG = loadImage('./data/monster.png');
    playerIMG = loadImage('./data/ship.png');
    missileIMG = loadImage('./data/rocket.png', img => {
        img.resize(30,0);
    });
}

function setup() {
    createCanvas(WIDTH,HEIGHT);
    createMonsters();
    createPlayer();
    createMissile();
    startTime = + new Date().getTime();
}

function checkKeys() {
    // A
    if(keyIsDown(65)) {
        Player.xpos = Player.xpos - PLAYER_SPEED;
    }
    // D
    if(keyIsDown(68)) {
        Player.xpos = Player.xpos + PLAYER_SPEED;
    }
    // W
    if(keyIsDown(87)) {
        Player.ypos = Player.ypos - PLAYER_SPEED;
    }
    // S
    if(keyIsDown(83)) {
        Player.ypos = Player.ypos + PLAYER_SPEED;
    }
}

function resetGame() {
    GAME_OVER = false;
    NUM_MONSTERS = (LEVEL * 2) + 2;
    NUM_ALIVE = NUM_MONSTER_MISSILES = NUM_MONSTERS;
    Monsters = new LinkedList();
    SP.sprites = new LinkedList();
    monsterMissiles = new Array();

    Player.setVisible(true);
    let p = new Node(Player);
    SP.sprites.add(p);

    createMonsters();
    createMissile();
}

function keyPressed() {
    if(keyCode === 32 && !(playerMissile.isOnScreen())) {
        fireMissile();
    }
}

function pre() {

    if(NUM_ALIVE == 0) {
        ++LEVEL; 
        resetGame(); 
    } else if(GAME_OVER) {
        resetGame();
    }
    let passedTime = + new Date().getTime() - startTime;
    if(passedTime >= getRandomInt(DELAY_MIN,DELAY_MAX)) {
        fireMonsterMissiles();
        startTime = + new Date().getTime();
    }
    processCollisions();
    checkKeys();
}

let r = getRandomInt(0,255);
let g = getRandomInt(0,255);
let b = getRandomInt(0,255);

function draw() {
    pre();
    background(r,g,b);          
    SP.updateSprites();   
}