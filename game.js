let gameState = "Start"; // start | play | gameover

// ----- CLASSES -----

// Player class
class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 100;
    this.w = 40;
    this.h = 40;
    this.vy = 0;
    this.gravity = 0.4;
    this.jumpForce = -5;
  }

  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    // Left/right movement (A, D or arrow keys)
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= 4;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += 4;
    }

    // Wrap around left/right
    if (this.x < -this.w) this.x = width;
    if (this.x > width) this.x = -this.w;

    // Player falls out of screen
    if (this.y > height) {
      gameState = "gameover";
    }
  }

  jump() {
    this.vy = this.jumpForce;
  }

  draw() {
    fill(255, 180, 0);
    rect(this.x, this.y, this.w, this.h, 8);
  }
}
class Paltform {
    constructor(x, y, type = "normal") {
    this.x = x;
    this.y = y;
    this.w = 60;
    this.h = 20;
    this.type = type;
    this.borken = false;
    this.moveDir = 1;
}
  
  update() {
    // Moving platform
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

  // Player collision
  hits(player) {
    if (
      player.vy > 0 && // only when falling down
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


// ----- GLOBAL VARIABLES -----
let player;
let platforms = [];
let scrollSpeed = 2; // platforms move down as player jumps


// ----- SETUP -----
function setup() {
  createCanvas(400, 600);
  player = new Player();
  resetPlatforms();
}


// Create starting platforms
function resetPlatforms() {
  platforms = [];
  for (let i = 0; i < 10; i++) {
    let x = random(20, width - 100);
    let y = i * 60;

    // Random type
    let r = random();
    let type = "normal";

    if (r < 0.1) type = "broken";
    else if (r < 0.25) type = "moving";

    platforms.push(new Platform(x, y, type));
  }

  }

