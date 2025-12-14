//Platform class export
export class Platform {
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
