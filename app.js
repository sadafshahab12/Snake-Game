const play_board = document.querySelector(".play-board");
const player_score = document.querySelector(".score");
let high_scored = document.querySelector(".high-score");
let controls = document.querySelectorAll(".controls svg");

let food_x;
let food_y;
let snake_x = 5;
let snake_y = 10;
let velocity_x = 0;
let velocity_y = 0;
let snake_body = [];
let game_over = false;
let set_game_over_interlval_alert;
let score = 0;
// getting high score  from the lcoal storage
let high_score = localStorage.getItem("high-score") || 0;
high_scored.innerText = `High Score : ${high_score}`;

const change_food_position = () => {
  //passing a random number 0 -30 value as food position
  food_x = Math.floor(Math.random() * 30) + 1;
  food_y = Math.floor(Math.random() * 30) + 1;
};

controls.forEach((key) => {
  key.addEventListener("click", () =>
    change_direction({ key: key.dataset.key })
  );
});
const handle_game_over = () => {
  //clearing the timer and reloading the page after game over
  clearInterval(set_game_over_interlval_alert);
  alert("Game Over!! Press OK to replay.");
  location.reload();
};
const init_game = () => {
  if (game_over) return handle_game_over();

  let html_markup = `<div class = "food" style= "grid-area: ${food_y}/ ${food_x}"> </div>`;
  //checking if the snake hit the food
  if (snake_x === food_x && snake_y === food_y) {
    change_food_position();
    snake_body.push([food_x, food_y]); //pushing food to the snake body
    console.log(snake_body);
    score++;

    high_score = score >= high_score ? score : high_score;
    localStorage.setItem("high-score", high_score);
    player_score.innerText = `Score : ${score}`;
    high_scored.innerText = `High Score : ${high_score}`;
  }

  for (let i = snake_body.length - 1; i > 0; i--) {
    snake_body[i] = snake_body[i - 1]; // bshifting the values in the snake body one by one
  }
  snake_body[0] = [snake_x, snake_y]; //setting first element of the snake body to current snak position

  // updating the snake's head position based on the current velocity
  snake_x += velocity_x;
  snake_y += velocity_y;

  if (snake_x <= 0 || snake_x > 34 || snake_y <= 0 || snake_y > 30) {
    // console.log("Game over!!")
    game_over = true; //if the snake out of teh wall game over
  }

  for (let i = 0; i < snake_body.length; i++) {
    html_markup += `<div class = "head" style= "grid-area: ${snake_body[i][1]}/ ${snake_body[i][0]}"> </div>`;
    // snake head  hit the body game over !
    if (
      i !== 0 &&
      snake_body[0][1] === snake_body[i][1] &&
      snake_body[0][0] === snake_body[i][0]
    ) {
      game_over = true;
    }
  }
  play_board.innerHTML = html_markup;
};
change_food_position();
// init_game();
set_game_over_interlval_alert = setInterval(init_game, 125);

const change_direction = (e) => {
  // console.log(e);
  //Changing velocity value based on key press
  if (e.key === "ArrowUp" && velocity_y != 1) {
    velocity_x = 0;
    velocity_y = -1;
  } else if (e.key === "ArrowDown" && velocity_y != -1) {
    velocity_x = 0;
    velocity_y = 1;
  } else if (e.key === "ArrowLeft" && velocity_x != 1) {
    velocity_x = -1;
    velocity_y = 0;
  } else if (e.key === "ArrowRight" && velocity_x != -1) {
    velocity_x = 1;
    velocity_y = 0;
  }
  init_game();
};

document.addEventListener("keydown", change_direction);
