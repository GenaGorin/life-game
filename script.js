let gridSize = 10;
let grid = [];
let generation = 0;
let isRunning = false;
let timer;

function generateRandom() {
  if (!isRunning) {
    let newGrid = [];
    let gameGrid = document.getElementById("game-grid");
    for (let i = 0; i < gridSize; i++) {
      let newRow = [];
      let rowElement = gameGrid.children[i];

      for (let j = 0; j < gridSize; j++) {
        let cell = rowElement.children[j];
        let isAlive = Math.round(Math.random());
        newRow.push(isAlive);
        cell.style.backgroundColor = isAlive ? "black" : "white";
      }

      newGrid.push(newRow);
    }

    grid = newGrid;
  }
}

function generateGrid() {
  let value = Number(document.getElementById("size").value);
  if (value > 0) {
    let gameGrid = document.getElementById("game-grid");
    gameGrid.innerHTML = "";
    gridSize = value;

    for (let i = 0; i < gridSize; i++) {
      let row = [];
      let rowElement = document.createElement("div");
      rowElement.className = "row";

      for (let j = 0; j < gridSize; j++) {
        let cell = document.createElement("div");
        cell.className = "cell";
        cell.onclick = toggleCell;
        rowElement.appendChild(cell);
        row.push(false);
      }

      gameGrid.appendChild(rowElement);
      grid.push(row);
    }
  }
}

function toggleCell() {
  let cell = this;
  let row = cell.parentNode;
  let rowIndex = Array.from(row.parentNode.children).indexOf(row);
  let columnIndex = Array.from(row.children).indexOf(cell);
  grid[rowIndex][columnIndex] = !grid[rowIndex][columnIndex];
  cell.style.backgroundColor = grid[rowIndex][columnIndex] ? "black" : "white";
}

function startGame() {
  if (!isRunning) {
    isRunning = true;
    timer = setInterval(() => {
      console.time("Генерация поколения");
      generateNextGeneration();
      console.timeEnd("Генерация поколения");
    }, 1000);
  }
}

function stopGame() {
  isRunning = false;
  clearInterval(timer);
}

function clearGrid() {
  if (!isRunning) {
    generation = 0;
    grid.forEach(function (row) {
      row.fill(false);
    });

    let cells = document.getElementsByClassName("cell");
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "white";
    }
  }
}

function generateNextGeneration() {
  let newGrid = [];
  let gameGrid = document.getElementById("game-grid");
  let newLiveCells = new Set();

  for (let i = 0; i < gridSize; i++) {
    let newRow = [];
    let rowElement = gameGrid.children[i];

    for (let j = 0; j < gridSize; j++) {
      let cell = rowElement.children[j];
      let isAlive = grid[i][j];
      let liveNeighbors = countLiveNeighbors(i, j);

      if (isAlive) {
        if (liveNeighbors < 2 || liveNeighbors > 3) {
          isAlive = false;
        }
      } else {
        if (liveNeighbors === 3) {
          isAlive = true;
        }
      }

      newRow.push(isAlive);
      cell.style.backgroundColor = isAlive ? "black" : "white";
    }

    newGrid.push(newRow);
  }

  grid = newGrid;
  generation++;
}

function countLiveNeighbors(row, col) {
  let count = 0;
  let neighbors = [
    [-1, -1],
    [-1, 0],
    [-1, 1],
    [0, -1],
    [0, 1],
    [1, -1],
    [1, 0],
    [1, 1],
  ];

  for (let i = 0; i < neighbors.length; i++) {
    let neighborRow = (row + neighbors[i][0] + gridSize) % gridSize;
    let neighborCol = (col + neighbors[i][1] + gridSize) % gridSize;

    if (grid[neighborRow][neighborCol]) {
      count++;
    }
  }

  return count;
}

generateGrid();
