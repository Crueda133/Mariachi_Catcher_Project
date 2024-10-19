class Game {
  constructor(startScreen, gameScreen, gameEndScreen) {
    // Necessary game elements
    this.startScreen = document.querySelector("#game-intro");
    this.gameScreen = document.querySelector("#game-screen");
    this.gameContainer = document.querySelector("#game-container");
    this.gameEndScreen = document.querySelector("#game-end");

    // Audio elements
    this.music = new Audio("music/musicMariachi.mp3");
    this.music.loop = true;
    this.music.volume = 0.1;
    this.crashSound = new Audio("music/crash.mp3");

    // Score and lives
    this.candiesScoreElement = document.getElementById("candies");
    this.livesElement = document.getElementById("lives");
    this.height = window.innerHeight;
    this.width = window.innerWidth;
    this.obstacles = [];
    this.counter = 0;
    this.candies = 0;
    this.lives = 3;
    this.score = 0;
    this.speed = 5; //obstacles speed CHECK
    this.playerSpeed = 5; //player speed CHECK
    this.defaultSpeed = 5;
    this.gameIsOver = false;
    this.gameIntervalId = null;
    this.gameLoopFrequency = 1000 / 60;
    this.countdownMessageElement = document.querySelector("#countdown-message");
    this.countdownTexts = ["¡Tres!", "¡Dos!", "¡Uno!", "GO!"];
    this.restartButton = document.querySelector("#restart-button");

    // // Player Mariachi - this uses the Player class from player.js and center it
    this.player = new Player(500, 500, 300, 300, "images/mariachi.png");
    const playerStartX = (this.width - this.player.width) / 2;
    const playerStartY = this.height - this.player.height - 20;
    this.player.setPosition(playerStartX, playerStartY);

    // // Ensure the player is added to the screen before the countdown starts
    // this.gameScreen.appendChild(this.player.element);

    // Timer
    this.timer = 60;
    this.timerElement = document.querySelector("#timer");
    this.gameIntervalId = null;
    this.timerIntervalId = null;

    // Start the background mariachi music
    this.music.play();
  }
  stopMusic() {
    this.music.pause();
    this.music.currentTime = 0;
  }

  start() {
    this.gameScreen.style.height = `${this.height}px`;
    this.gameScreen.style.width = `${this.width}px`;

    // the following is to hide the start screen
    this.startScreen.style.display = "none";

    // Hide or remove the intro Mariachi image
    const introMariachi = document.querySelector("#game-mariachi");
    if (introMariachi) {
      introMariachi.style.display = "none";
    }

    this.startScreen.style.display = "none";
    this.gameScreen.style.display = "block";
    this.gameContainer.style.display = "block";
    this.gameEndScreen.style.display = "none";

    // Reset the score and lives display
    this.candies = 0;
    this.lives = 3;
    this.candiesScoreElement.innerText = this.candies;
    this.livesElement.innerText = this.lives;

    // Ensure the player is added to the screen only once
    if (!this.player.element.parentNode) {
      this.gameScreen.appendChild(this.player.element);
    }

    // Start timer, countdown
    this.startTimer();
  }

  startTimer() {
    this.timerElement.innerText = this.timer;
    this.timerIntervalId = setInterval(() => {
      this.timer--;
      this.timerElement.innerText = this.timer;

      // Check if time is up
      if (this.timer <= 0) {
        this.gameIsOver = true; // Set game over condition
        this.endGame("lost"); // Call endGame with lose message
      }
    }, 1000); // Update timer every second

    // Start countdown
    this.startCountdown();
  }

  // Show the countdown message
  startCountdown() {
    let countdownIndex = 0;
    this.countdownMessageElement.style.display = "block";

    const countdownInterval = setInterval(() => {
      this.countdownMessageElement.innerText =
        this.countdownTexts[countdownIndex];
      countdownIndex++;

      // After the last message, clear the interval, Hide the countdown and start the game
      if (countdownIndex >= this.countdownTexts.length) {
        clearInterval(countdownInterval);
        this.countdownMessageElement.style.display = "none";

        //create the loop for the game (1sec)
        this.gameIntervalId = setInterval(() => {
          this.gameLoop();
        }, this.gameLoopFrequency);
      }
    }, 1000);
  }

  // the update checks if the game is finished. If true the game will stop
  gameLoop() {
    // Moves the mariachi player
    this.update();
    if (this.gameIsOver) {
      clearInterval(this.gameIntervalId);
    }
  }

  // Function to highlight the candy score
  highlightCandyScore(element) {
    element.classList.add("candy-highlight");
    setTimeout(() => {
      element.classList.remove("candy-highlight");
    }, 800);
  }

  // Function to highlight the lives score
  highlightLivesScore(element) {
    element.classList.add("lives-highlight");
    setTimeout(() => {
      element.classList.remove("lives-highlight");
    }, 800);
  }

  // Update player position and here I will update the obstacles, scores, etc.
  update() {
    //increment the counter so we can add obstacles when it is a certain number
    this.counter++;
    //this updates the player on the DOM based on the directions of the player
    if (this.player) {
      this.player.move();
    }

    //this will move all of the obstacles
    for (let i = 0; i < this.obstacles.length; i++) {
      const currentObstacle = this.obstacles[i];
      currentObstacle.move(this.speed);

      //this is checking for collisions and the action depends on the object
      let removeObstacle = false;
      const didCollide = this.player.didCollide(currentObstacle);

      // Check which type of obstacle was collided with and apply respective logic
      if (didCollide) {
        this.player.shake();
        if (currentObstacle.element.src.includes("candies")) {
          this.candies++;
          this.candiesScoreElement.innerText = this.candies;
          this.highlightCandyScore(this.candiesScoreElement);
          currentObstacle.element.remove();
        } else if (currentObstacle.element.src.includes("avocado")) {
          this.player.width -= 110; // Decrease width (make player thin)
          this.player.element.style.width = `${this.player.width}px`;
          currentObstacle.element.remove();
        } else if (currentObstacle.element.src.includes("cactus")) {
          this.crashSound.play();
          this.lives--;
          this.livesElement.innerText = this.lives;
          this.highlightLivesScore(this.livesElement);
          currentObstacle.element.remove();
        } else if (currentObstacle.element.src.includes("chili")) {
          this.speed += 10; // Increase player speed
          this.playerSpeed += 10; // Increase falling speed of obstacles
          currentObstacle.element.remove();
        } else if (currentObstacle.element.src.includes("tacos")) {
          this.player.width += 110; // Increase width (make player fat)
          this.player.element.style.width = `${this.player.width}px`;
          currentObstacle.element.remove();
        } else if (currentObstacle.element.src.includes("tequila")) {
          this.speed -= 10; // Decreases speed of player
          // this.playerSpeed -= 10; // Decrease falling objects
          currentObstacle.element.remove();
        }
      }

      // If the obstacle has gone off the screen, mark it for removal
      if (currentObstacle.top > this.height + 100) {
        currentObstacle.element.remove();
      }
      //this checks the top of the obstacle and if it is greater than the height of the game screen it removes that obstacle
      if (removeObstacle) {
        currentObstacle.element.remove();
        this.obstacles.splice(i, 1);
        i--;
      }

      // Remove obstacles that go off the screen
      if (currentObstacle.top > this.height + 100) {
        currentObstacle.element.remove();
        this.obstacles.splice(i, 1);
        i--;
      }
    }
    //this adds a new obstacle to the array every so many frames
    if (this.counter % 140 === 0) {
      this.obstacles.push(new Obstacle());
      console.log("New obstacle created");
    }

    //Game is over conditions

    // Check if candies or cactus conditions are met
    if (this.candies >= 5) {
      this.gameIsOver = true;
      this.endGame("won");
      return;
    }

    if (this.cactusTouches >= 3 || this.lives <= 0) {
      this.gameIsOver = true;
      this.endGame("lost");
      return;
    }

    //checking for when the game is over
    if (this.lives === 0) {
      this.gameIsOver = true;
      this.endGame();
    }
  }

  // restartGame method to reset the game
  restartGame() {
    this.stopMusic();
    this.gameEndScreen.style.display = "none";
    this.gameScreen.style.display = "none";
    this.startScreen.style.display = "block";
    // Remove the old player element from the DOM
    if (this.player && this.player.element) {
      this.player.element.remove();
    }

    // Re-initialize the player
    this.player = new Player(500, 500, 300, 300, "images/mariachi.png");
    this.setPlayerPosition();
  }

  setPlayerPosition() {
    const playerStartX = (this.width - this.player.width) / 2;
    const playerStartY = this.height - this.player.height - 20;
    this.player.setPosition(playerStartX, playerStartY);
  }

  endGame(result) {
    // Stop the timer when the game ends
    clearInterval(this.timerIntervalId);

    //for the obstacles
    this.player.element.remove();
    this.obstacles.forEach((oneObstacle) => oneObstacle.element.remove());

    //hide the game screen and show the game over screen
    this.gameScreen.style.display = "none";
    this.gameEndScreen.style.display = "block";

    // change the background image depending on the result of the game
    if (result === "won") {
      changeBackgroundImage("images/finalImageWon.webp");
      console.log("change background WON");
    } else {
      changeBackgroundImage("images/finalImageSad.webp");
      console.log("LOST");
    }

    // end message text
    const endMessage = document.createElement("p");
    if (result === "won") {
      endMessage.innerText =
        "Congratulations, you helped the Mariachi to fill up the piñata! Now is time to PARTY!";
    } else {
      endMessage.innerText =
        "Oh no! The Mariachi doesn't have enough candies for the piñata. Wanna try again? ";
    }

    // CSS class for styling
    endMessage.classList.add("end-message");

    this.gameEndScreen.appendChild(endMessage);
  }

  // Restart the game and reset the music
  restartGame() {
    this.music.play();
    this.startScreen.style.display = "block";
    this.gameEndScreen.style.display = "none";
  }
}

// Start music when the intro screen is displayed
const game = new Game();
game.startIntroMusic();
