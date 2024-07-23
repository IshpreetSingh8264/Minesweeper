const boardSize = 10;
const mineCount = 10;
const board = document.getElementById('board');
const gameStatus = document.getElementById('game-status');
const restartBtn = document.getElementById('restart-btn');
const cells = [];
let revealedCells = 0;
let gameEnded = false;

function initBoard() {
    board.innerHTML = '';
    gameStatus.innerHTML = '';
    revealedCells = 0;
    gameEnded = false;
    cells.length = 0;

    for (let row = 0; row < boardSize; row++) {
        cells[row] = [];
        for (let col = 0; col < boardSize; col++) {
            const cell = document.createElement('div');
            cell.className = 'cell';
            cell.dataset.row = row;
            cell.dataset.col = col;
            cell.addEventListener('click', handleCellClick);
            cell.addEventListener('contextmenu', handleCellRightClick); // Add right-click event listener
            board.appendChild(cell);
            cells[row][col] = cell;
        }
    }
    placeMines();
}

function placeMines() {
    let placedMines = 0;
    while (placedMines < mineCount) {
        const row = Math.floor(Math.random() * boardSize);
        const col = Math.floor(Math.random() * boardSize);
        const cell = cells[row][col];
        if (!cell.classList.contains('mine')) {
            cell.classList.add('mine');
            placedMines++;
        }
    }
}

function handleCellClick(event) {
    if (gameEnded) return;
    const cell = event.target;
    const row = cell.dataset.row;
    const col = cell.dataset.col;

    if (cell.classList.contains('revealed')) return;
    if (cell.classList.contains('marked')) return;

    if (event.button == 0) {
        if (cell.classList.contains('mine')) {
            cell.classList.add('revealed');
            revealAllMines();
            gameStatus.innerHTML = 'Game Over!';
            gameEnded = true;
        } else {
            revealCell(cell);
            if (revealedCells === boardSize * boardSize - mineCount) {
                gameStatus.innerHTML = 'You Win!';
                revealAllMines(true);
                gameEnded = true;
            }
        }
    }
}

function handleCellRightClick(event) {
    event.preventDefault(); // Prevent default context menu
    if (gameEnded) return;

    const cell = event.target;

    if (cell.classList.contains('revealed')) return;

    markCell(cell);
}

function markCell(cell) {
    if (cell.classList.contains('marked')) {
        cell.classList.remove('marked');
    } else {
        cell.classList.add('marked');
    }
}

function revealAllMines(isWin = false) {
    for (let row = 0; row < boardSize; row++) {
        for (let col = 0; col < boardSize; col++) {
            const cell = cells[row][col];
            if (cell.classList.contains('mine')) {
                cell.classList.add('revealed');
                if (isWin) {
                    cell.classList.add('win');
                }
            }
        }
    }
}

function revealCell(cell) {
    const row = parseInt(cell.dataset.row);
    const col = parseInt(cell.dataset.col);

    if (cell.classList.contains('revealed')) return;
    if (cell.classList.contains('marked')) return;

    cell.classList.add('revealed');
    revealedCells++;

    let mineCount = 0;
    for (let r = -1; r <= 1; r++) {
        for (let c = -1; c <= 1; c++) {
            const newRow = row + r;
            const newCol = col + c;
            if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                if (cells[newRow][newCol].classList.contains('mine')) {
                    mineCount++;
                }
            }
        }
    }

    if (mineCount === 0) {
        for (let r = -1; r <= 1; r++) {
            for (let c = -1; c <= 1; c++) {
                const newRow = row + r;
                const newCol = col + c;
                if (newRow >= 0 && newRow < boardSize && newCol >= 0 && newCol < boardSize) {
                    revealCell(cells[newRow][newCol]);
                }
            }
        }
    } else {
        cell.textContent = mineCount;
    }
}

function restartGame() {
    initBoard();
}

initBoard();
restartBtn.addEventListener('click', restartGame);

// Prevent context menu from appearing on the entire document
window.addEventListener('contextmenu', (event) => event.preventDefault());
