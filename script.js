const rows = 6;
const cols = 7;
let board = [];
let currentPlayer = 'red';
let gameOver = false;
let vsAI = false;

const score = { red: 0, yellow: 0 };

const gameBoard = document.getElementById('game-board');
const statusText = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const changeModeBtn = document.getElementById('change-mode-btn');
const customizeBtn = document.getElementById('customize-btn');
const quitBtn = document.getElementById('quit-btn');
const closeCustomizationBtn = document.getElementById('close-customization');

const vsPlayerBtn = document.getElementById('vs-player');
const vsAIbtn = document.getElementById('vs-ai');
const modeSelect = document.getElementById('mode-select');
const gameContainer = document.getElementById('game-container');
const customizationPanel = document.getElementById('customization-panel');

const scoreRed = document.getElementById('score-red');
const scoreYellow = document.getElementById('score-yellow');
const nameRedSpan = document.getElementById('name-red');
const nameYellowSpan = document.getElementById('name-yellow');

const colorGridInput = document.getElementById('color-grid');
const colorBgInput = document.getElementById('color-bg');
const colorTextInput = document.getElementById('color-text');
const nameRedInput = document.getElementById('name-red-input');
const nameYellowInput = document.getElementById('name-yellow-input');
const bgImageFileInput = document.getElementById('bg-image-file');

function createBoard() {
  gameBoard.innerHTML = '';
  board = [];

  for (let r = 0; r < rows; r++) {
    board[r] = [];
    for (let c = 0; c < cols; c++) {
      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.row = r;
      cell.dataset.col = c;
      gameBoard.appendChild(cell);
      board[r][c] = '';
    }
  }

  currentPlayer = 'red';
  gameOver = false;
  statusText.textContent = `Tour de ${nameRedSpan.textContent}`;
}

function updateScore() {
  scoreRed.textContent = score.red;
  scoreYellow.textContent = score.yellow;
}

function placeDisc(col) {
  if (gameOver) return;

  for (let r = rows - 1; r >= 0; r--) {
    if (board[r][col] === '') {
      board[r][col] = currentPlayer;
      const cell = document.querySelector(`.cell[data-row="${r}"][data-col="${col}"]`);
      cell.classList.add(currentPlayer);

      if (checkWin(r, col)) {
        gameOver = true;
        statusText.textContent = `${currentPlayer === 'red' ? nameRedSpan.textContent : nameYellowSpan.textContent} a gagné !`;
        score[currentPlayer]++;
        updateScore();
        return;
      }

      if (board.flat().every(cell => cell !== '')) {
        gameOver = true;
        statusText.textContent = "Match nul !";
        return;
      }

      currentPlayer = currentPlayer === 'red' ? 'yellow' : 'red';
      statusText.textContent = `Tour de ${currentPlayer === 'red' ? nameRedSpan.textContent : nameYellowSpan.textContent}`;

      if (vsAI && currentPlayer === 'yellow') setTimeout(aiMove, 500);
      return;
    }
  }
}

function aiMove() {
  let col;
  do {
    col = Math.floor(Math.random() * cols);
  } while (board[0][col] !== '');
  placeDisc(col);
}

function checkWin(r, c) {
  const directions = [
    [0, 1], [1, 0], [1, 1], [1, -1]
  ];
  const color = board[r][c];

  for (let [dr, dc] of directions) {
    let count = 1;
    for (let i = 1; i < 4; i++) {
      const nr = r + dr * i;
      const nc = +c + dc * i;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== color) break;
      count++;
    }
    for (let i = 1; i < 4; i++) {
      const nr = r - dr * i;
      const nc = +c - dc * i;
      if (nr < 0 || nr >= rows || nc < 0 || nc >= cols || board[nr][nc] !== color) break;
      count++;
    }
    if (count >= 4) return true;
  }

  return false;
}

// Événements
gameBoard.addEventListener('click', (e) => {
  const col = e.target.dataset.col;
  if (col !== undefined && !gameOver && (!vsAI || currentPlayer === 'red')) {
    placeDisc(+col);
  }
});

resetBtn.addEventListener('click', createBoard);
changeModeBtn.addEventListener('click', () => {
  gameContainer.style.display = 'none';
  modeSelect.style.display = 'block';
  score.red = 0;
  score.yellow = 0;
  updateScore();
});

vsPlayerBtn.addEventListener('click', () => {
  vsAI = false;
  modeSelect.style.display = 'none';
  gameContainer.style.display = 'block';
  createBoard();
});

vsAIbtn.addEventListener('click', () => {
  vsAI = true;
  modeSelect.style.display = 'none';
  gameContainer.style.display = 'block';
  createBoard();
});

customizeBtn.addEventListener('click', () => {
  customizationPanel.style.display = 'block';
});

closeCustomizationBtn.addEventListener('click', () => {
  customizationPanel.style.display = 'none';
  applyCustomization();
});

quitBtn.addEventListener('click', () => {
  if (confirm("Voulez-vous vraiment quitter le jeu ?")) {
    window.close();
  }
});

// Personnalisation
function applyCustomization() {
  gameBoard.style.backgroundColor = colorGridInput.value;
  document.body.style.backgroundColor = colorBgInput.value;
  document.body.style.color = colorTextInput.value;

  const redName = nameRedInput.value.trim() || 'Rouge';
  const yellowName = nameYellowInput.value.trim() || (vsAI ? 'Ordinateur' : 'Jaune');

  nameRedSpan.textContent = redName;
  nameYellowSpan.textContent = yellowName;
  statusText.textContent = `Tour de ${currentPlayer === 'red' ? redName : yellowName}`;
}

// Image de fond
bgImageFileInput.addEventListener('change', (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = () => {
    document.body.style.backgroundImage = `url(${reader.result})`;
    document.body.style.backgroundSize = 'cover';
  };
  reader.readAsDataURL(file);
});

// Initialisation
createBoard();
updateScore();
