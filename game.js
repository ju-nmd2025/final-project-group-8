// ---------------------------------------------------------
// PLAYER CLASS IMPORT
// ---------------------------------------------------------
import { Player } from "./player.js";

let gameState = "Start"; // Start | play | gameover

let player;
let platforms = [];
let birdLeft, birdRight;
let currentBird;
let titleImg;
let bgImg;

let scrollSpeed = 1;
let score = 0;

// ---------------------------------------------------------
// PRELOAD IMAGES
// ---------------------------------------------------------
function preload() {
  birdLeft = loadImage("likLeft.png");
  birdRight = loadImage("likRight.png");
  titleImg = loadImage("doodleTitle.png");
  bgImg = loadImage("background.png");
}

// ---------------------------------------------------------
// PLATFORM CLASS
// ---------------------------------------------------------
class Platform {
  constructor(x, y, type = "normal") {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 20;
    this.type = type;
    this.broken = false;
    this.moveDir = 1;
  }

  update() {
    if (this.type === "moving") {
      this.x += this.moveDir * 2;
      if (this.x < 0 || this.x + this.w > width) {
        this.moveDir *= -1;
      }
    }
  }

  draw() {
    if (this.type === "normal") fill(50, 200, 50);
    if (this.type === "moving") fill(50, 150, 250);
    if (this.type === "broken") fill(200, 50, 50);

    if (!this.broken) {
      rect(this.x, this.y, this.w, this.h, 5);
    }
  }

  hits(player) {
    if (
      player.vy > 0 &&
      player.x + player.w > this.x &&
      player.x < this.x + this.w &&
      player.y + player.h > this.y &&
      player.y + player.h < this.y + this.h
    ) {
      return true;
    }
    return false;
  }
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
  for (let i = 0; i < 8; i++) {
    let x = random(20, width - 100);
    let y = i * 70;

    let r = random();
    let type = "normal";

    if (r < 0.1) type = "broken";
    else if (r < 0.25) type = "moving";

    platforms.push(new Platform(x, y, type));
  }

  platforms.push(new Platform(width / 2 - 30, height - 40, "normal"));

  //Score reset with platform reset (back to 0)
  score = 0;
}

// ---------------------------------------------------------
// DRAW LOOP
// ---------------------------------------------------------
function drawBackground() {
  if (bgImg) {
    imageMode(CORNER);
    image(bgImg, 0, 0, width, height);
  }
}

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

  // Scrolling
  // Increase score when player is jumping upward
  if (player.vy < 0) {
    score += floor(-player.vy * 0.1);
  }
  if (player.vy < 0 && player.y < height * 0.4) {
    let scroll = -player.vy;
    player.y = height * 0.4;
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
  } else if (gameState === "gameover") {
    player = new Player();
    resetPlatforms();
    gameState = "play";
  }
}

//windows so import and export work
window.preload = preload;
window.setup = setup;
window.draw = draw;
window.keyPressed = keyPressed;
