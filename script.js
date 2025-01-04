$(document).ready(game);

const gameSequence = [];
let playerSequence = [];
const clickDuration = 370;

const mockeryText = {
  level1: [
    "Wow, you made it to Level 1! Truly groundbreaking stuff.",
    "Don't strain yourself; it's only one button!",
    "Well done, you pressed a button. Truly elite gaming skills.",
    "Congrats on achieving what a toddler can do on their first try!",
  ],
  level2To5: [
    "Nice job! But don't get too comfortable, genius.",
    "Congratulations, you're officially smarter than a goldfish... barely.",
    "Level 3, huh? Big brain energy incoming... or will it fizzle out?",
    "Hey, you might just beat a toddler at this rate! Keep dreaming.",
    "Level 5? Don't get cocky, this isn't exactly rocket science.",
  ],
  level6To10: [
    "Level 6? Oh, so you’re good at pushing buttons. Impressive career move.",
    "Wow, Level 7! That’s one step closer to eternal mediocrity.",
    "You’re getting far… in a game that literally a machine plays better than you.",
    "If you were this good at real-life skills, imagine where you’d be right now.",
    "Level 10? Congrats, you’ve peaked at something no one cares about.",
  ],
  level11To15: [
    "Level 11? Is this dedication or just a lack of better hobbies?",
    "Oh, look who’s becoming the Simon whisperer. What a legacy to leave behind.",
    "You’re still going? I admire your stamina… and pity your priorities.",
    "Level 15 already? At this rate, you might break the record for wasting time.",
    "Ever think about applying this effort to something productive? Nah, me neither.",
  ],
  level16To20: [
    "You’re at Level 16? Okay, now I’m starting to think you’re part robot.",
    "Level 17, huh? Enjoy your 15 seconds of imaginary fame.",
    "You’re getting suspiciously good at this. Do I smell a cheater?",
    "Level 19?! Now you’re just showing off. Relax, button-masher.",
    "Level 20? Well, at least now your obsession has a number attached to it.",
  ],
  level21AndAbove: [
    "Level 21? Congratulations, you're officially better than anyone cares to be.",
    "Wow, you're still playing? I'm starting to think this game is your soulmate.",
    "You’ve reached a level so high, even Simon’s getting bored.",
    "Oh, look at you, the self-proclaimed Simon Master. How prestigious.",
    "Above Level 21? Great, now even the game regrets letting you in.",
  ],
  mistakes: [
    "Oooh, so close! Just kidding, you weren't even close.",
    "I didn't think it was possible to mess up that bad. And yet, here we are.",
    "Simon says: Try harder next time. Seriously, TRY.",
    "Did you forget the order, or are you just pressing random buttons?",
    "Impressive. You somehow failed at the most basic task imaginable.",
    "Remember, it's always either Green, Red, Yellow, or Blue. Not that hard.",
  ],
};

function game() {
  removeGlow();
  $(".mockery").text("");
  $(".play-button").click(function () {
    $(".play-text").hide();
    resetGame();
    $(".score").text("000");
    $(".play-button").hide();
    nextRound();
  });
}

function resetGame() {
  gameSequence.length = 0;
  playerSequence.length = 0;
  disableUserInput();
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
  playButtonAudio(buttonClass);
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
  playButtonAudio(classList[1]);
  validatePress();
}

function validatePress() {
  const currentMoveIndex = playerSequence.length - 1;
  if (playerSequence[currentMoveIndex] !== gameSequence[currentMoveIndex]) {
    $("body").css("background-color", "red");
    setTimeout(() => {
      $("body").css("background-color", "");
    }, 100);
    $(".play-button").show();
    $(".play-text").show();
    playButtonAudio("fail");
    showLostMock();
    resetGame();
    return;
  }
  if (playerSequence.length === gameSequence.length) {
    updateMock();
    updateLevelText();
    playerSequence = [];
    disableUserInput();
    setTimeout(nextRound, 1000);
  }
}

function nextRound() {
  addToGameSequence();
  playMoves();
}

function playButtonAudio(color) {
  const audio = new Audio(`assets/audios/${color}.wav`);
  audio.play();
}

function removeGlow() {
  $(".simon-button").removeClass(
    "green-active red-active yellow-active blue-active"
  );
}

function updateMock() {
  const mock = $(".mockery");
  let text;
  if (gameSequence.length === 1) {
    text = mockeryText.level1[Math.floor(Math.random() * 2)];
  } else if (gameSequence.length >= 2 && gameSequence.length <= 5) {
    if (gameSequence.length === 3) {
      text = mockeryText.level2To5[2];
    } else if (gameSequence.length === 5) {
      text = mockeryText.level2To5[4];
    } else {
      text = mockeryText.level2To5[Math.floor(Math.random() * 4)];
    }
  } else if (playerSequence.length > 0) {
    text = mockeryText.mistakes[Math.floor(Math.random() * 4)];
  } else if (playerSequence.length === 0) {
    text = mockeryText.repeatedFails[Math.floor(Math.random() * 3)];
  } else if (gameSequence.length === 10) {
    text = mockeryText.success[Math.floor(Math.random() * 3)];
  } else if (gameSequence.length >= 6 && gameSequence.length <= 10) {
    if (gameSequence.length === 6) {
      text = mockeryText.level6To10[0];
    } else if (gameSequence.length === 10) {
      text = mockeryText.level6To10[4];
    } else {
      text = mockeryText.level6To10[Math.floor(Math.random() * 4)];
    }
  } else if (gameSequence.length >= 11 && gameSequence.length <= 15) {
    if (gameSequence.length === 11) {
      text = mockeryText.level11To15[0];
    } else if (gameSequence.length === 15) {
      text = mockeryText.level11To15[3];
    } else {
      text = mockeryText.level11To15[Math.floor(Math.random() * 4)];
    }
  } else if (gameSequence.length >= 16 && gameSequence.length <= 20) {
    if (gameSequence.length === 16) {
      text = mockeryText.level16To20[0];
    } else if (gameSequence.length === 20) {
      text = mockeryText.level16To20[4];
    } else {
      text = mockeryText.level16To20[Math.floor(Math.random() * 4)];
    }
  } else if (gameSequence.length >= 21) {
    if (gameSequence.length === 21) {
      text = mockeryText.level21AndAbove[0];
    } else if (gameSequence.length === 25) {
      text = mockeryText.level21AndAbove[3];
    } else {
      text = mockeryText.level21AndAbove[Math.floor(Math.random() * 4)];
    }
  }
  mock.text(text);
}

function updateLevelText() {
  $(".score").text(
    `${gameSequence.length < 10 ? "00" : gameSequence.length < 100 ? "0" : ""}${
      gameSequence.length
    }`
  );
}

function showLostMock() {
  const mock = $(".mockery");
  const text =
    mockeryText.mistakes[
      Math.floor(Math.random() * mockeryText.mistakes.length)
    ];
  mock.text(text);
}
