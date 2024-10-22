//agregar musica

// Show the piñata cursor when the mouse moves :)
window.onload = function () {
  const sombrero = document.getElementById("sombrero");

  document.addEventListener("mousemove", function (event) {
    sombrero.style.display = "block";
    sombrero.style.left = event.pageX + "px";
    sombrero.style.top = event.pageY + "px";
  });

  document.addEventListener("mouseleave", function () {
    sombrero.style.display = "none";
  });
};

// Start Game button
const startButton = document.querySelector("#start-button");

// Restart Game button
const restartButton = document.querySelector("#restart-button");
// Hide the game end screen
document.getElementById("game-end").style.display = "none"; //new

// Show the game intro screen
document.getElementById("game-intro").style.display = "block"; //new

// Make the mariachi spin when the Start Game button is clicked
const mariachiImage = document.querySelector("#game-intro img");

let ourGame;

startButton.addEventListener("click", function () {
  mariachiImage.classList.add("spin-animation");

  setTimeout(function () {
    mariachiImage.classList.remove("spin-animation");
    // Start Game after it stops spining
    startGame();
    // changeBackgroundImage("/images/background0.avif");
  }, 1000);
  console.log(" start game and it should spin");
});

// atually creates the game object and stores it in the variable
function startGame() {
  ourGame = new Game();
  ourGame.start();
}

// Change the background when the button Start game is clicked
function changeBackgroundImage(imageUrl) {
  document.body.style.backgroundImage = `url('${imageUrl}')`;
  document.body.style.backgroundRepeat = "no-repeat";
  document.body.style.backgroundSize = "cover";
}

const gameMariachi = document.getElementById("game-mariachi");
gameMariachi.style.display = "block";

// Add event listeners for arrow keys to move the mariachi
document.addEventListener("keydown", (event) => {
  if (ourGame && ourGame.player) {
    if (event.key === "ArrowLeft") {
      ourGame.player.directionX = ourGame.speed * -1; // Move left
    } else if (event.key === "ArrowRight") {
      ourGame.player.directionX = ourGame.speed; // Move right
    }
  }
});

document.addEventListener("keyup", () => {
  if (ourGame && ourGame.player) {
    ourGame.player.directionX = 0; // Stop moving when key is released
  }
});

// Restart Game button
restartButton.addEventListener("click", function () {
  if (ourGame) {
    ourGame.restartGame(); // Call the restart method in the Game class
  }
  location.reload(); // refresh the page
  console.log("restart game clicked");
});
