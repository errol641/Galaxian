let monsterIMG, playerImg, missileIMG;
let popSound, explosionSound, missileSound;
let backgroundImage, gameOver;
let explosionVideo;
let restart;
const WIDTH = 1024;
const HEIGHT = 768;
let MISSILE_SPEED = 30;
let GAME_OVER = false;
let startTime;

let LEVEL = 1;
let NUM_MONSTERS = (LEVEL * 2) + 2;
let NUM_MONSTER_MISSILES = NUM_MONSTERS;
let NUM_ALIVE = NUM_MONSTERS;
let KILL_COUNT = 0;

let MONSTER_MISSILE_SPEED = 5;
let INITIAL_MONSTER_SPEED = 1;
let PLAYER_SPEED = 6;
let DELAY_MIN = 3500;
let DELAY_MAX = 4000;

let Monsters = new LinkedList();
let monsterMissiles = new Array();
let Player;
let playerMissile;

function createPlayer() {
    Player = new Sprite(playerIMG, 450, 690, true);
    Player.setBoundry(-50, WIDTH - 50, 550, 690, 'stop');
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
        monster.setxVel(getRandomInt(0,1) == 0? -INITIAL_MONSTER_SPEED : INITIAL_MONSTER_SPEED);
        monster.setyVel(getRandomInt(0,1) == 1? INITIAL_MONSTER_SPEED : -INITIAL_MONSTER_SPEED);

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
    missileSound.play();
}

function calculateAngle(opp, adj) {
    return Math.atan(opp/adj);
}

function fireMonsterMissiles() {
    let monsterNode = Monsters.head;
    while(monsterNode != null) {
        let monster = monsterNode.payload;
        monster.shootMissileTowards(Player);
        if(!missileSound.isPlaying()) {
            missileSound.play();
        }
        monster.moveRandomly();
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

                if(!popSound.isPlaying()) {
                    popSound.play();
                }

                KILL_COUNT++;

            } else {
                monsterNode = monsterNode.next;
            }
        }
    }

    for(let i = 0; i < monsterMissiles.length; i++) {
        let missile = monsterMissiles[i];
        if(missile.isOnScreen() && missile.ypos >= 550 && missile.collidesWith(Player)) {
            explosionSound.play();
            Player.setVisible(false);
            missile.setVisible(false);
            GAME_OVER = true; 
            break;           
        }
    }
}

function drawText(txt, font, fontsize, color, x, y) {
    textFont(font, fontsize);
    fill(color)
    text(txt, x, y);
}

function preload() {
    monsterIMG = loadImage('./data/monster.png');
    playerIMG = loadImage('./data/ship.png');
    missileIMG = loadImage('./data/rocket.png', img => {
        img.resize(30,0);
    });

    soundFormats('wav', 'mp3');
    popSound = loadSound('./data/pop.wav');
    popSound.setVolume(0.25);
    explosionSound = loadSound('./data/explosion2-1.mp3');
    explosionSound.setVolume(0.05);
    missileSound = loadSound('./data/missile_sound.wav');
    missileSound.setVolume(0.05);

    backgroundImage = loadImage('./data/background.png');
    gameOver = loadImage('./data/gameOver.png');

    explosionVideo = createVideo('./data/explosion_gif.mp4');
    explosionVideo.hide();
}

function setup() {
    let canvas = createCanvas(WIDTH,HEIGHT);

    var x = (windowWidth - width) / 2;
    var y = (windowHeight - height) / 2;
    canvas.position(x, y);

    createMonsters();
    createPlayer();
    createMissile();
    startTime = + new Date().getTime();
    restart = createButton('Restart');
    restart.class("restart");
    restart.elt.addEventListener('click', resetGame);
    restart.size(200,50);
    restart.position(x + (width / 2) - 100, y + (height / 2) + 70);
    restart.hide();
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

function showGameOver() { 
    background(0);
    background(gameOver);
    drawText('Level:' + LEVEL, 'Courier', 20, 255, 925, 755);
    drawText('Kill Count:' + KILL_COUNT, 'Courier', 30, 255, 400, 435); 
    if(!explosionVideo.elt.ended) {
        explosionVideo.play();
        image(explosionVideo, Player.xpos - 50, Player.ypos - Player.height, 200, 100);
    } else {
        restart.show();
    }
}

function resetGame() {
    if(GAME_OVER) {
        LEVEL = 1;
        KILL_COUNT = 0;
        MONSTER_MISSILE_SPEED = 5;
        INITIAL_MONSTER_SPEED = 1;
        DELAY_MIN = 3500;
        DELAY_MAX = 4000;
        Player.setXY(450, 690);
    }

    restart.hide();
    explosionVideo.elt.currentTime = 0;
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

    startTime = + new Date().getTime();
}

function keyPressed() {
    if(keyCode === 32 && !(playerMissile.isOnScreen())) {
        fireMissile();
    }
}

function pre() {

    if(NUM_ALIVE == 0) {
        ++LEVEL;
        if(LEVEL % 5 == 0) {
            MONSTER_MISSILE_SPEED += 1;
            INITIAL_MONSTER_SPEED += 1;
            DELAY_MIN -= 400;
            DELAY_MAX -= 400;
        }   
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

function draw() {
    if(GAME_OVER) { 
        showGameOver(); 
    } else {
        pre();
        background(backgroundImage);       
        SP.updateSprites();
        drawText('Level:' + LEVEL, 'Courier', 20, 255, 925, 755);
        drawText('Kill Count:' + KILL_COUNT, 'Courier', 20, 255, 10, 755); 
    }
}