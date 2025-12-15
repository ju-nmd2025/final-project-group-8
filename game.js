// ---------------------------------------------------------
// PLAYER AND PLATFORM CLASSES IMPORT
// ---------------------------------------------------------
import { Player } from "./player.js";

import { Platform } from "./platforms.js";

//--------------------------------------

let gameState = "Start"; // Start | play | gameover

let player;
let platforms = [];
let birdLeft, birdRight;
let titleImg;
let bgImg;
let bgMusic;
let score = 0;

// ---------------------------------------------------------
// PRELOAD IMAGES AND SOUND
// ---------------------------------------------------------
function preload() {
  birdLeft = loadImage("likLeft.png");
  birdRight = loadImage("likRight.png");
  titleImg = loadImage("doodleTitle.png");
  bgImg = loadImage("background.png");
  bgMusic = loadSound("music.mp3");
}

// ---------------------------------------------------------
// SETUP
// ---------------------------------------------------------
function setup() {
  createCanvas(400, 600);
  player = new Player();
  resetPlatforms();
}

// ---------------------------------------------------------
// CREATE INITIAL PLATFORMS
// ---------------------------------------------------------
function resetPlatforms() {
  platforms = [];

  //8 initial platforms
  for (let i = 0; i < 8; i++) {
    let x = random(20, width - 100);
    let y = i * 70;

    let r = random();
    let type = "normal";

    if (r < 0.1) type = "broken";
    else if (r < 0.25) type = "moving";

    platforms.push(new Platform(x, y, type));
  }

  //safety starting platform
  platforms.push(new Platform(width / 2 - 30, height - 40, "normal"));

  //Score reset with platform reset (back to 0)
  score = 0;
}

// ---------------------------------------------------------
// DRAW BACKGROUND
// ---------------------------------------------------------
function drawBackground() {
  if (bgImg) {
    imageMode(CORNER);
    image(bgImg, 0, 0, width, height);
  } else {
    background(200);
  }
}

//Main draw loop - state of game
function draw() {
  drawBackground();

  if (gameState === "Start") {
    drawStartScreen();
  } else if (gameState === "play") {
    runGame();
  } else if (gameState === "gameover") {
    drawGameOverScreen();
  }
}

// ---------------------------------------------------------
// START SCREEN
// ---------------------------------------------------------
function drawStartScreen() {
  if (titleImg) {
    imageMode(CENTER);
    image(titleImg, width / 2, height / 3, 260, 120);
    imageMode(CORNER);
  }

  fill(0);
  textSize(18);
  textAlign(CENTER);
  text("Press any key to start", width / 2, height / 2 + 20);
}

// ---------------------------------------------------------
// GAME OVER SCREEN
// ---------------------------------------------------------
function drawGameOverScreen() {
  //stop music when game is over
  if (bgMusic && bgMusic.isPlaying()) {
    bgMusic.stop();
  }

  fill(255, 50, 50);
  textSize(32);
  textAlign(CENTER);
  text("Game Over", width / 2, height / 2 - 20);

  fill(0);
  textSize(18);
  text("Press any key to restart", width / 2, height / 2 + 20);
  text("Score: " + score, width / 2, height / 2 + 50);
}

// ---------------------------------------------------------
// MAIN GAME LOOP
// ---------------------------------------------------------
function runGame() {
  const fellOff = player.update();
  if (fellOff) {
    gameState = "gameover";
    return;
  }
  //draw player
  player.draw(birdLeft, birdRight);

  // Platforms
  for (let p of platforms) {
    p.update();
    p.draw();

    if (!p.broken && p.hits(player)) {
      if (p.type === "broken") {
        p.broken = true;
      } else {
        player.jump();
      }
    }
  }

  // Scrolling and score increase
  //Increase score when player is jumping upward
  if (player.vy < 0) {
    score += floor(-player.vy * 0.1);
  }

  if (player.vy < 0 && player.y < height * 0.4) {
    let scroll = -player.vy;
    player.y = height * 0.4;

    //scroll platforms
    for (let p of platforms) {
      p.y += scroll;
    }
  }

  // Remove and create new platforms
  for (let i = platforms.length - 1; i >= 0; i--) {
    if (platforms[i].y > height) {
      platforms.splice(i, 1);

      let type =
        random() < 0.1 ? "broken" : random() < 0.25 ? "moving" : "normal";

      platforms.push(
        new Platform(random(20, width - 100), random(-80, -20), type)
      );
    }
  }

  // Draw score
  fill(0);
  textSize(20);
  text("Score: " + score, 55, 40);
}
// ---------------------------------------------------------
// INPUT HANDLING
// ---------------------------------------------------------
function keyPressed() {
  if (gameState === "Start") {
    gameState = "play";

    //start mmusic after first key pressed
    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.loop();
      musicStarted = true;
    }
  } else if (gameState === "gameover") {
    player = new Player();
    resetPlatforms();
    gameState = "play";

    if (bgMusic && !bgMusic.isPlaying()) {
      bgMusic.loop();
    }
  }
}

//windows so import and export work
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
