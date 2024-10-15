class Player {
  constructor(left, top, width, height, playerImage) {
    this.gameScreen = document.querySelector("#game-screen");
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.directionY = 0;

    // the following creates the img in js to append to the game screen
    this.element = document.createElement("img");
    this.element.style.position = "absolute";
    this.element.src = playerImage;
    this.element.style.height = `${height}px`;
    this.element.style.width = `${width}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    //this adds the img to the DOM
    this.gameScreen.appendChild(this.element);
  }

  // to move the Mariachi
  move() {
    this.left += this.directionX;
    this.top += this.directionY;
    // this part limits the mariachi to not go more to the left
    if (this.left < 150) {
      this.left = 150;
    }
    // this part puts the mariachi to the left
    if (this.left + this.width > 1050) {
      this.left = 1050 - this.width;
    }
    // this part moves the mariachi up and down
    if (this.top < 1200) {
      this.top = 1200;
    }

    // this part moves the mariachi up and down
    if (this.top + this.height > 1500) {
      this.top = 1500 - this.height;
    }

    this.updatePosition();
  }

  updatePosition() {
    this.element.style.left = `${this.left}px`;
    this.element.style.top = `${this.top}px`;
  }

  didCollide(obstacle) {
    const playerRect = this.element.getBoundingClientRect();
    const obstacleRect = obstacle.element.getBoundingClientRect();

    if (
      playerRect.left < obstacleRect.right &&
      playerRect.right > obstacleRect.left &&
      playerRect.top < obstacleRect.bottom &&
      playerRect.bottom > obstacleRect.top
    ) {
      // setTimeout(()=>){
      // this.element.classList.add("spin");
      return true;
    } else {
      return false;
    }
  }
}
