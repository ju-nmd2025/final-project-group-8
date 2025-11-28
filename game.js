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
// ----- DRAW LOOP -----
function draw() {
  background(30);

  if (gameState === "Start") {
    drawStartScreen();
  } else if (gameState === "play") {
    runGame();
  } else if (gameState === "gameover") {
    drawGameOverScreen();
  }
}

// ----- START SCREEN -----
function drawStartScreen() {
  fill(255);
  textSize(28);
  textAlign(CENTER);
  background(300);
  fill("green");
  text("DOODLE JUMP", width / 2, height / 2 - 20);

  fill("black");
  textSize(18);
  text("Press any key to start", width / 2, height / 2 + 20);
}

// ----- GAME OVER SCREEN -----
function drawGameOverScreen() {
  fill(255, 50, 50);
  textSize(32);
  textAlign(CENTER);
  text("End game", width / 2, height / 2 - 20);

  fill(255);
  textSize(18);
  text("Restart game", width / 2, height / 2 + 20);
}

// ----- GAME LOGIC -----
function runGame() {
  player.update();
  player.draw();

  // Update platforms
  for (let p of platforms) {
    p.update();
    p.draw();

    // Collision detection
    if (!p.broken && p.hits(player)) {
      if (p.type === "broken") {
        p.broken = true;
      } else {
        player.jump(); // normal or moving platform
      }
    }
  }

  // Scroll platforms down when player moves up
  if (player.y < height / 2) {
    player.y += scrollSpeed;
    for (let p of platforms) {
      p.y += scrollSpeed;
    }
  }

  // Remove old platforms and add new ones
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
}

// ----- KEY PRESSED -----
function keyPressed() {
  if (gameState === "start") {
    gameState = "play";
  } else if (gameState === "gameover") {
    player = new Player();
    resetPlatforms();
    gameState = "play";
  }
}
