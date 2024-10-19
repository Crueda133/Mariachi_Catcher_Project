class Player {
  constructor(left, top, width, height, playerImage) {
    this.gameScreen = document.querySelector("#game-screen");
    this.left = left;
    this.top = top;
    this.width = width;
    this.height = height;
    this.directionX = 0;
    this.directionY = 0;
    this.speed = 5;

    // Calculate initial position: center horizontally, bottom of the screen
    this.left = window.innerWidth / 2 - this.width / 2;
    this.top = window.innerHeight - this.height - 10;

    // the following creates the img in js to append to the game screen
    this.element = document.createElement("img");
    this.element.style.position = "absolute";
    this.element.src = playerImage;
    this.element.style.height = `${height}px`;
    this.element.style.width = `${width}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    // //this adds the img to the DOM
    // this.gameScreen.appendChild(this.element);
  }

  // reset the mariachi's position
  setPosition(x, y) {
    this.left = x;
    this.top = y;
    this.updatePosition();
  }

  // to move the Mariachi
  move() {
    this.left += this.directionX;
    this.top += this.directionY;
    // this part limits the mariachi to not go more to the left
    if (this.left < 150) {
      this.left = 150;
    }
    // this part puts the mariachi to the right
    if (this.left + this.width > window.innerWidth) {
      this.left = window.innerWidth - this.width;
    }
    // this part moves the mariachi up and down
    if (this.top < 2200) {
      this.top = 1200;
    }

    // this part moves the mariachi up and down
    if (this.top + this.height > 2200) {
      this.top = 2200 - this.height;
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
      return true;
    } else {
      return false;
    }
  }

  // Shake the Mariachi on collision
  shake() {
    this.element.classList.add("shake");

    // Remove the shake class after the animation duration
    setTimeout(() => {
      this.element.classList.remove("shake");
    }, 500); // Match this duration with the CSS animation duration
  }
}
