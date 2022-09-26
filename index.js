const startBtn = document.querySelector(".start-button");
const squareShooterTitle = document.querySelector(".square-shooter-title");
const canvas = document.querySelector("#game");
const ctx = canvas.getContext("2d");

let oldTimeStamp = 0;
let timeStamp = 0;
let createSquaresInterval = 0;

let game = {
  squares: [],
  numOfSquaresToCreate: 1,
  score: 0,
  gameOver: false,
  mouseX: 0,
  mouseY: 0,
  deltaTime: 0,
  theme: new Audio("./theme.wav"),
  lost: new Audio("./lost.wav"),
};

window.onload = () => {
  startBtn.addEventListener("click", startGame);
};
const createGameOverWindow = () => {
  const gameOverBox = document.createElement("div");
  gameOverBox.classList.add("game-over-box");
  document.body.append(gameOverBox);
  const gameOverBoxTitle = document.createElement("h1");
  gameOverBoxTitle.classList.add("game-over-box-title");
  gameOverBoxTitle.innerHTML = "Game Over";
  gameOverBox.append(gameOverBoxTitle);
  const gameOverScoreTitle = document.createElement("h1");
  gameOverScoreTitle.classList.add("game-over-score-title");
  gameOverScoreTitle.innerHTML = `Score: ${game.score}`;
  gameOverBox.append(gameOverScoreTitle);
  const replayButton = document.createElement("button");
  replayButton.classList.add("replay-button");
  replayButton.innerHTML = `Play Again`;
  gameOverBox.append(replayButton);

  replayButton.addEventListener("click", restartGame);
};

const startGame = () => {
  game.theme.pause();
  game.theme.currentTime = 0;
  game.theme.play();
  game.theme.loop = true;
  canvas.classList.remove("hidden");
  startBtn.classList.add("hidden");
  squareShooterTitle.classList.add("hidden");
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
  window.requestAnimationFrame(updateAll);

  window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
  });

  const makeSquaresTransparentOnClick = () => {
    game.squares.forEach((square) => {
      square.draw();
      if (
        game.mouseX < square.x + square.width &&
        game.mouseX > square.x &&
        game.mouseY < square.y + square.height &&
        game.mouseY > square.y
      ) {
        const laser = new Audio("./laser.wav");

        if (square.color === "white") {
          laser.pause();
          laser.play();
        }
        square.color = "transparent";
      }
    });
  };

  window.addEventListener("click", (e) => {
    game.mouseX = e.clientX;
    game.mouseY = e.clientY;

    makeSquaresTransparentOnClick();
  });
};

class ScoreBoard {
  constructor(x, y) {
    this.x = x;
    this.y = y;
  }

  draw() {
    ctx.fillStyle = "white";
    ctx.font = "30px Arial";
    ctx.fillText(`Score: ${game.score}`, this.x, this.y);
  }
}

class Square {
  constructor() {
    this.color = "white";
    this.height = 50;
    this.width = 50;
    this.x = Math.floor(Math.random() * canvas.width);
    this.y = Math.floor(Math.random() * canvas.height);
  }

  createSquares(numOfSquares) {
    for (let i = 0; i < numOfSquares; i++) {
      const square = new Square();
      game.squares.push(square);
    }
  }

  checkIfSquareOffScreen() {
    if (this.x < this.width) {
      this.x += this.width;
    }

    if (this.x > canvas.width - this.width) {
      this.x -= this.width;
    }

    if (this.y > canvas.height - this.height) {
      this.y -= this.height;
    }

    if (this.y < this.height) {
      this.y += this.height;
    }
  }

  draw() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

const mySquare = new Square();
const myScoreBoard = new ScoreBoard(30, 50);

const updateAll = (timeStamp) => {
  if (game.gameOver === false) {
    game.deltaTime = timeStamp - oldTimeStamp;
    timeStamp = timeStamp;

    drawCanvas();
    myScoreBoard.draw();
    window.requestAnimationFrame(updateAll);
    oldTimeStamp = timeStamp;

    createSquaresInterval += game.deltaTime;

    if (createSquaresInterval >= 2000) {
      mySquare.createSquares(game.numOfSquaresToCreate);
      createSquaresInterval = 0;
    }

    if (game.score >= 1000) {
      game.numOfSquaresToCreate = 2;
    }

    if (game.score >= 2000) {
      game.numOfSquaresToCreate = 3;
    }

    game.squares.forEach((square) => {
      square.checkIfSquareOffScreen();
      square.draw();
    });

    checkForLosingCondition();
    game.score += 1;
  }
};

const checkForLosingCondition = () => {
  let numOfWhiteSquares = game.squares.filter(
    (i) => i.color === "white"
  ).length;
  if (numOfWhiteSquares >= 4) {
    gameOver();
  }
};

const gameOver = () => {
  setTimeout(() => {
    if (game.gameOver === false) {
      game.gameOver = true;
      game.theme.pause();
      game.lost.play();
      createGameOverWindow();
      canvas.classList.add("hidden");
    }
  }, 400);
};

const restartGame = () => {
  const gameOverBox = document.querySelector(".game-over-box");
  gameOverBox.remove();
  game.numOfSquaresToCreate = 1;
  timeStamp = 0;
  oldTimeStamp = 0;
  game.deltaTime = 0;
  game.score = 0;
  game.gameOver = false;
  game.squares = [];
  startGame();
};

const drawCanvas = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);
};
