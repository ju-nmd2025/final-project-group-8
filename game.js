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

  }
