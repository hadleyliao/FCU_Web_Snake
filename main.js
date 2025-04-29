const GRID_SIZE = 30;
let snake, direction, nextDirection, food, score, speed, gameInterval, isRunning;

const gameBoard = document.getElementById('gameBoard');
const scoreEl = document.getElementById('score');
const startBtn = document.getElementById('startBtn');
const pauseBtn = document.getElementById('pauseBtn');

function initBoard() {
  gameBoard.innerHTML = '';
  for (let y = 0; y < GRID_SIZE; y++) {
    for (let x = 0; x < GRID_SIZE; x++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.x = x;
      cell.dataset.y = y;
      gameBoard.appendChild(cell);
    }
  }
}

function resetState() {
  const mid = Math.floor(GRID_SIZE / 2);
  snake = [
    { x: mid - 2, y: mid },
    { x: mid - 1, y: mid },
    { x: mid,     y: mid }
  ];
  direction = { x: 1, y: 0 };
  nextDirection = { ...direction };
  score = 0;
  speed = 200;
  isRunning = false;
  generateFood();
  updateBoard();
  updateScore();
}

function generateFood() {
  do {
    food = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE)
    };
  } while (snake.some(seg => seg.x === food.x && seg.y === food.y));
}

function updateBoard() {
  document.querySelectorAll('.cell').forEach(cell => {
    cell.classList.remove('snake', 'food');
  });
  snake.forEach(seg => {
    const cell = document.querySelector(`.cell[data-x="${seg.x}"][data-y="${seg.y}"]`);
    if (cell) cell.classList.add('snake');
  });
  const foodCell = document.querySelector(`.cell[data-x="${food.x}"][data-y="${food.y}"]`);
  if (foodCell) foodCell.classList.add('food');
}

function updateScore() {
  scoreEl.textContent = `Score: ${score}`;
}

function startGame() {
  clearInterval(gameInterval);
  resetState();
  isRunning = true;
  gameInterval = setInterval(gameLoop, speed);
}

function togglePause() {
  if (!isRunning) return;
  if (gameInterval) {
    clearInterval(gameInterval);
    gameInterval = null;
  } else {
    gameInterval = setInterval(gameLoop, speed);
  }
}

function onKeydown(e) {
  const dirs = {
    ArrowUp:    { x: 0,  y: -1 },
    ArrowDown:  { x: 0,  y: 1 },
    ArrowLeft:  { x: -1, y: 0 },
    ArrowRight: { x: 1,  y: 0 }
  };
  const nd = dirs[e.key];
  if (nd && (nd.x + direction.x !== 0 || nd.y + direction.y !== 0)) {
    nextDirection = nd;
  }
}

function gameLoop() {
  direction = nextDirection;
  const head = {
    x: snake[snake.length - 1].x + direction.x,
    y: snake[snake.length - 1].y + direction.y
  };
  // 碰撞牆壁
  if (head.x < 0 || head.x >= GRID_SIZE || head.y < 0 || head.y >= GRID_SIZE) {
    endGame();
    return;
  }

  // 自身碰撞
  if (snake.some(seg => seg.x === head.x && seg.y === head.y)) {
    endGame();
    return;
  }
  snake.push(head);
  // 吃食物
  if (head.x === food.x && head.y === food.y) {
    score++;
    updateScore();
    speed = Math.max(10, speed - 2);
    clearInterval(gameInterval);
    gameInterval = setInterval(gameLoop, speed);
    generateFood();
  } else {
    snake.shift();
  }
  updateBoard();
}

function endGame() {
  clearInterval(gameInterval);
  isRunning = false;
  alert('Game Over');
}

window.addEventListener('keydown', onKeydown);
startBtn.addEventListener('click', startGame);
pauseBtn.addEventListener('click', togglePause);

initBoard();
resetState();