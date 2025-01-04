$(document).ready(game);

const gameSequence = [];
let playerSequence = [];
const clickDuration = 875;

function game() {
  $(".play-button").click(function () {
    resetGame();
    nextRound();
  });
}

function resetGame() {
  removeGlow();
  gameSequence.length = 0;
  playerSequence.length = 0;
}

function generateIndex() {
  return Math.floor(Math.random() * 4) + 1;
}

function addToGameSequence() {
  gameSequence.push(generateIndex());
}

function playMoves() {
  let index = 0;
  const interval = setInterval(() => {
    if (index < gameSequence.length) {
      const move = gameSequence[index];
      highlightButton(move);
      index++;
    } else {
      clearInterval(interval);
      enableUserInput();
    }
  }, clickDuration * 2);
}

function highlightButton(move) {
  let buttonClass;
  switch (move) {
    case 1:
      buttonClass = "green";
      break;
    case 2:
      buttonClass = "red";
      break;
    case 3:
      buttonClass = "yellow";
      break;
    case 4:
      buttonClass = "blue";
      break;
  }
  $(`.${buttonClass}`).addClass(`${buttonClass}-active`);
  setTimeout(() => {
    $(`.${buttonClass}`).removeClass(`${buttonClass}-active`);
  }, clickDuration);
}

function enableUserInput() {
  $(".simon-button").click(parseClick);
}

function disableUserInput() {
  $(".simon-button").off("click");
}

function parseClick(e) {
  const classList = e.target.classList;
  let buttonClicked;
  if (classList.contains("green")) {
    buttonClicked = 1;
  } else if (classList.contains("red")) {
    buttonClicked = 2;
  } else if (classList.contains("yellow")) {
    buttonClicked = 3;
  } else if (classList.contains("blue")) {
    buttonClicked = 4;
  }
  playerSequence.push(buttonClicked);
  validatePress();
}

function validatePress() {
  const currentMoveIndex = playerSequence.length - 1;
  if (playerSequence[currentMoveIndex] !== gameSequence[currentMoveIndex]) {
    alert("Game Over! You missed the sequence.");
    resetGame();
    return;
  }
  if (playerSequence.length === gameSequence.length) {
    playerSequence = [];
    disableUserInput();
    setTimeout(nextRound, 1000);
  }
}

function nextRound() {
  addToGameSequence();
  playMoves();
}

function removeGlow() {
  $(".green").removeClass("green-active");
  $(".red").removeClass("red-active");
  $(".yellow").removeClass("yellow-active");
  $(".blue").removeClass("blue-active");
}
