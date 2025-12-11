export class Player {
  constructor() {
    this.x = width / 2;
    this.y = height - 200;
    this.w = 60;
    this.h = 60;

    this.vy = 0;
    this.gravity = 0.35;
    this.jumpForce = -15;

    this.direction = "right"; // "left" | "right"
  }

  // Return true if player fell below the screen
  update() {
    this.vy += this.gravity;
    this.y += this.vy;

    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      this.x -= 4;
      this.direction = "left";
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      this.x += 4;
      this.direction = "right";
    }

    if (this.x < -this.w) this.x = width;
    if (this.x > width) this.x = -this.w;

    return this.y > height; // tell the caller if we died
  }

  draw(birdLeftImg, birdRightImg) {
    const img = this.direction === "left" ? birdLeftImg : birdRightImg;
    image(img, this.x, this.y, this.w, this.h);
  }

  jump() {
    this.vy = this.jumpForce;
  }
}
