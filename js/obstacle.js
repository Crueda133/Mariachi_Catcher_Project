class Obstacle {
  constructor() {
    this.gameScreen = document.querySelector("#game-screen");
    this.positionsX = [250, 300, 350, 400, 450, 500, 550];
    this.randomIndex = Math.floor(Math.random() * this.positionsX.length);
    this.left = this.positionsX[this.randomIndex];
    this.top = -150;
    this.width = 60;
    this.height = 60;

    // Randomly pick an obstacle type from the list
    this.obstacleTypes = [
      { name: "candy", src: "images/candies.png" },
      { name: "avocado", src: "images/avocado.png" },
      { name: "cactus", src: "images/cactus.png" },
      { name: "chili", src: "images/chili.png" },
      { name: "tacos", src: "images/tacos.png" },
      { name: "tequila", src: "images/tequila2.png" },
    ];

    this.randomObstacle =
      this.obstacleTypes[Math.floor(Math.random() * this.obstacleTypes.length)];

    //this creates the <img /> in js to append to the game screen
    this.element = document.createElement("img");
    this.element.style.position = "absolute";
    this.element.src = this.randomObstacle.src;
    this.element.style.height = `${this.height}px`;
    this.element.style.width = `${this.width}px`;
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;

    console.log("obstacle", Obstacle);

    //this actually adds the img to the DOM
    this.gameScreen.appendChild(this.element);
  }
  move() {
    this.top += 3;
    this.updatePosition();
    console.log(`Obstacle moved to the top: ${this.top}`);
  }

  //this method visually shows us where the player move
  updatePosition() {
    this.element.style.top = `${this.top}px`;
    this.element.style.left = `${this.left}px`;
  }
}
