import {Snake} from "./Snake.js";
import {Food} from "./Food.js";
import {Count} from "./Count.js";
import {config}  from "./config.js";
import {EventBus} from "./EventBus.js";
import {Walls} from "./Walls.js";

window.onload = function () {
  // Board is hidden before size applying.
  // It helps to hide jumping on the beginning
  const wrapper = document.querySelector('.wrapper');
  wrapper.style.opacity = '1';

  const scoreNode = document.getElementById('score');
  const recordNode = document.getElementById('record');
  const startPauseButton = document.getElementById('startPauseButton');
  const checkboxWalls = document.getElementById('checkbox_walls');

  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  canvas.width = config.boardSize;
  canvas.height = config.boardSize;

  let repeater, snake, food, walls;

  function initBoard() {
    snake = new Snake({ctx, border: checkboxWalls.checked ? config.step : 0, ...config});

    food = new Food({ctx, border: checkboxWalls.checked ? config.step : 0, ...config});

    walls = new Walls({ctx, border: checkboxWalls.checked ? config.step : 0, ...config});

    checkboxWalls.disabled = true;
  }

  function update() {
    snake?.draw()
    food?.draw()
    walls?.draw();
  }

  const count = new Count(scoreNode, recordNode)

  count.loadRecord();

  document.addEventListener("keydown", (e) => {
    if(e.code == 'KeyS') return startPauseGame();
    if(e.code == 'KeyP' || e.code == 'Space') return startPauseGame();
    snake?.changeDirection(e)
  });

  startPauseButton.addEventListener("click", startPauseGame);

  EventBus.subscribe('snake-died', () => {
    clearInterval(repeater);
    alert("Game Over!");
    location.reload();
  });

  function startPauseGame() {
    initBoard()
    startPauseButton.innerText = "Pause";
    if(repeater) {
      clearInterval(repeater);
      repeater = null;
      startPauseButton.blur();
    } else {
      repeater = setInterval(update, config.speed);
    }
  }
}