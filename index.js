/*
  1) Create start button in the middle instead of pressing a key to start
  2) Cache last sequence
  3) Cache longest sequence
  4) Add 4 game levels: sequences (8, 16, 24, 32)
  5) Add winner text/effects/sounds
  6) Improve look
*/

const playCurrentGameSequence = () => {
  let count = 0;
  interval = setInterval(() => {
    $(`#${gamePattern[count]}`)
      .fadeOut(100)
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100);
    playSound(gamePattern[count]);
    count++;
    if (count >= gamePattern.length) clearInterval(interval);
  }, 500);
};

const nextSequence = () => {
  const randomNumber = Math.floor(Math.random() * Math.floor(4));
  const buttonColors = ["red", "blue", "green", "yellow"];
  const randomChosenColor = buttonColors[randomNumber];
  gamePattern.push(randomChosenColor);
  if (firstRun) {
    $(`#${randomChosenColor}`)
      .fadeOut(100)
      .fadeIn(100)
      .fadeOut(100)
      .fadeIn(100);
    playSound(randomChosenColor);
    level++;
    $("#level-title").text(`Level ${level}`);
  } else {
    playCurrentGameSequence();
    level++;
    $("#level-title").text(`Level ${level}`);
  }
};

const playSound = (name) => {
  const sound = new Audio(`/sounds/${name}.mp3`);
  sound.play();
};

const animatePress = (currentColor) => {
  const btn = $(`#${currentColor}`);
  btn.addClass("pressed");
  setTimeout(() => {
    btn.removeClass("pressed");
  }, 100);
};

const checkAnswer = (currentValue) => {
  const userValue = userClickedPattern[currentValue];
  const gameValue = gamePattern[currentValue];
  if (userValue === gameValue) {
    return true;
  } else {
    return false;
  }
};

const resetGame = () => {
  gamePattern.length = 0;
  userClickedPattern.length = 0;
  level = 0;
  gameOver = false;
};

const gamePattern = [];
const userClickedPattern = [];
let level = 0;
let firstRun = true;
let interval;
let gameOver = false;

$(document).on("keydown", (type) => {
  if (firstRun) {
    nextSequence();
    firstRun = false;
  } else {
    if (!gameOver) {
      let userContinue = true;
      const userPrompt = prompt(
        "Pressing a key starts the game over.  Did you mean to press a key, or would you like to start over? Press (y/n)"
      ).toLowerCase();
      if (userPrompt === "y") {
        userContinue = false;
      }
      if (!userContinue) {
        resetGame();
        nextSequence();
      } else {
        clearInterval(interval);
        interval = null;
        userClickedPattern.length = 0;
        playCurrentGameSequence();
      }
    } else {
      resetGame();
      nextSequence();
    }
  }
});

$(".btn").on("click", (type) => {
  if (level !== 0) {
    userChosenColor = type.target.id;
    userClickedPattern.push(userChosenColor);
    playSound(userChosenColor);
    animatePress(userChosenColor);

    const currentValue = userClickedPattern.length - 1;
    const correct = checkAnswer(currentValue);
    if (correct) {
      if (userClickedPattern.length === gamePattern.length) {
        setTimeout(() => {
          nextSequence();
        }, 1000);

        userClickedPattern.length = 0;
      }
    } else {
      playSound("wrong");
      $("body").addClass("game-over");
      setTimeout(() => {
        $("body").removeClass("game-over");
      }, 500);
      gameOver = true;
      $("#level-title").html("Game Over<br/><br/>Press any key to continue.");
    }
  }
});
