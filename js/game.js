class Game {
  constructor(startScreen, gameScreen, gameEndScreen) {
    this.startScreen = document.querySelector("#game-intro");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameContainer = document.querySelector("#game-container");
    this.gameEndScreen = document.querySelector("#game-end");
    this.candiesScoreElement = document.getElementById("candies");
    this.livesElement = document.getElementById("lives");
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.obstacles = [];
    this.counter = 0;
    this.candies = 0;
    this.lives = 5;
    this.score = 0;
    this.speed = 5;
    this.defaultSpeed = 5;
    this.gameIsOver = false;
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 60;

    // Player Mariachi - this uses the Player class from player.js
    this.player = new Player(500, 500, 300, 300, "images/mariachi.png");
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    // the following is to hide the start screen
    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameContainer.style.display = "block";

    // Reset the score and lives display
    this.candies = 0;
    this.lives = 5;
    this.candiesScoreElement.innerText = this.candies;
    this.livesElement.innerText = this.lives;

    //create the loop for the game
    this.gameIntervalId = setInterval(() => {
      this.gameLoop();
    }, this.gameLoopFrequency);
  }

  // the update checks if the game is finished. If true the game will stop
  gameLoop() {
    // Moves the mariachi player
    this.player.move();
    this.update();
    console.log("Game loop is running");
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  // Update player position and here I will update the obstacles, scores, etc.
  update() {
    //increment the counter so we can add obstacles when it is a certain number
    this.counter++;
    //this updates the player on the DOM based on the directions of the player
    this.player.move();

    //this will move all of the obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const currentObstacle = this.obstacles[i];
      currentObstacle.move(this.speed);

      //this is checking for collisions and the action depends on the object
      let removeObstacle = false;
      const didCollide = this.player.didCollide(currentObstacle);

      // Check which type of obstacle was collided with and apply respective logic
      if (didCollide) {
        if (currentObstacle.element.src.includes("candies")) {
          this.candies++;
          this.candiesScoreElement.innerText = this.candies;
          removeObstacle = true;
        } else if (currentObstacle.element.src.includes("avocado")) {
          this.player.width -= 40; // Decrease width (make player thin)
          this.player.element.style.width = `${this.player.width}px`;
          removeObstacle = true;
        } else if (currentObstacle.element.src.includes("chili")) {
          this.speed += 14; // Increase falling speed of obstacles
          removeObstacle = true;
        } else if (currentObstacle.element.src.includes("tacos")) {
          this.player.width += 40; // Increase width (make player fat)
          this.player.element.style.width = `${this.player.width}px`;
          removeObstacle = true;
        } else if (currentObstacle.element.src.includes("tequila")) {
          this.player.directionX *= 0.02; // Reduce player movement speed
          this.player.directionY *= 0.02;
          removeObstacle = true;
        }
      }

      // If the obstacle has gone off the screen, mark it for removal
      if (currentObstacle.top > this.height + 100) {
        removeObstacle = true;
      }
      //this checks the top of the obstacle and if it is greater than the height of the game screen it removes that obstacle
      if (removeObstacle) {
        currentObstacle.element.remove();
        this.obstacles.splice(i, 1);
        i--;
      }
    }

    // Remove obstacles that go off the screen
    if (currentObstacle.top > this.height + 100) {
      currentObstacle.element.remove();
      this.obstacles.splice(i, 1);
      i--;
    }

    //this adds a new obstacle to the array every so many frames
    if (this.counter % 60 === 0) {
      this.obstacles.push(new Obstacle());
      console.log("New obstacle created");
    }

    //outside the for loop
    //checking for when the game is over
    if (this.lives === 0) {
      this.gameIsOver = true;
      this.endGame();
    }
  }
  endGame() {
    this.player.element.remove();
    this.obstacles.forEach((oneObstacle) => oneObstacle.element.remove());
    //hide the game screen and show the game over screen
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "block";
  }
}
