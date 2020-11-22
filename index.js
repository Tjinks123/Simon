(() => {
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
    const sound = new Audio(`sounds/${name}.mp3`);
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

  const isWinner = () => {
    let winner;
    switch (difficulty) {
      case 2:
        winner = 16;
        break;
      case 3:
        winner = 24;
        break;
      case 4:
        winner = 32;
        break;
      default:
        winner = 8;
    }
    if (gamePattern.length === winner) {
      $("#level-title").text("YOU WIN!");
      gameOver = true;
      return true;
    } else {
      return false;
    }
  };

  const resetGame = () => {
    if (!firstRun) {
      gamePattern.length = 0;
      userClickedPattern.length = 0;
      level = 0;
      firstRun = true;
      gameOver = false;
      $("#level-title").text("SIMON");
    }
  };

  const gamePattern = [];
  const userClickedPattern = [];
  let level = 0;
  let firstRun = true;
  let difficulty;
  $(".difficulty").on("change", (event) => {
    difficulty = parseInt(event.target.value);
  });
  let interval;
  let gameOver = false;

  $(".start").on("click", () => {
    if (firstRun) {
      firstRun = false;
      nextSequence();
    } else {
      return;
    }
  });

  $(".reset").on("click", () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    resetGame();
  });

  $(".simon-btn").on("click", (type) => {
    if (!gameOver) {
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
              if (isWinner()) {
                return;
              }
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
          $("#level-title").html("GAME OVER<br/>PRESS RESET TO TRY AGAIN.");
        }
      }
    }
  });
})();
