let monsterIMG, playerImg, missileIMG;
const WIDTH = 1024;
const HEIGHT = 768;
const MISSILE_SPEED = 20;
const MONSTER_MISSILE_SPEED = 5;
const PLAYER_SPEED = 6;
const DIFFICULTY = 20;
let GAME_OVER = false;
let INVERTAL;

let LEVEL = 5;
let NUM_MONSTERS = LEVEL * 2;
let NUM_ALIVE = NUM_MONSTERS;

let monsters = new LinkedList();
let player;
let missile;

function createPlayer() {
    player = new Sprite(playerIMG, 450, 700, false);
    player.setBoundry(-50, WIDTH - 50, 550, 700, 'stop');
}

function createMissile() {
    missile = new Sprite(missileIMG, 0, 0, true);
}

function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}
function createMonsters() {

    for(let i = 0; i < NUM_MONSTERS; i++)
    {
        let xpos = Math.floor(Math.random() * (WIDTH));
        let ypos = Math.floor(Math.random() * (HEIGHT/4));
        let monster = new Sprite(monsterIMG, xpos, ypos, false);
        monster.setBoundry(0,WIDTH - 100,0, 300, 'bounce');
        monster.setxVel(getRandomInt(1,4) == 2? -1:1);
        monster.setyVel(getRandomInt(1,4) == 3? 1:-1);

        let newNode = SP.sprites.peek();
        monsters.add(newNode);
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

function calculateAngle(opp, adj) {
    return Math.atan(opp/adj);
}

function fireMonsterMissile() {

    let monsterNode = monsters.head;
    while(monsterNode != null) {
        let monster = monsterNode.payload;
        if(!monster.isDead) {
            //let x = getRandomInt(0,1);
            if(true) {

                let x = monster.xpos + (monster.width / 2) - (missileIMG.width / 2);
                let y = monster.ypos + missileIMG.height;   
                let dx = player.xpos - monster.xpos;
                let dy = player.ypos - monster.ypos;
                let magnitude = Math.sqrt((dx * dx) + (dy * dy));
                dx = (MONSTER_MISSILE_SPEED * dx) / magnitude; 
                dy = (MONSTER_MISSILE_SPEED * dy) / magnitude;
                let monsterMissile = new Sprite(missileIMG, x, y, false);
                monsterMissile.setVelocity(dx,dy);
            }
        }
        monsterNode = monsterNode.next;
    }
}   

function processCollisions() {

    if(missile.isOnScreen() && missile.ypos <= 300) {
        let monsterNode = monsters.head;
        while(monsterNode != null) {
            let monster = monsterNode.payload;
            if(missile.collidesWith(monster)) {
                missile.setDead(true);
                monster.setDead(true);
                
                // Remove monster from list
                let hold = monsterNode;
                monsterNode = monsterNode.next;
                monsters.remove(hold);

                --NUM_ALIVE;
            } else {
                monsterNode = monsterNode.next;
            }
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
    INVERTAL = setInterval(fireMonsterMissile, 3000);
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
    NUM_MONSTERS = LEVEL * 2;
    NUM_ALIVE = NUM_MONSTERS;
    monsters = new LinkedList();
    SP.sprites = new LinkedList();
    
    let newNode = new Node(player);
    SP.sprites.add(newNode);

    createMonsters();
    createMissile();
}

function keyPressed() {
    if(keyCode === 32 && !(missile.isOnScreen())) {
        fireMissile();
    }
}

function pre() {
    processCollisions();
    checkKeys();
    if(NUM_ALIVE == 0) {
        LEVEL++;
        resetGame();
    }
}
let r = getRandomInt(0,255);
let g = getRandomInt(0,255);
let b = getRandomInt(0,255);

function draw() {
    pre();
    background(r,g,b);               
    SP.updateSprites();      
}