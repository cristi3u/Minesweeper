let board = [];
let rows = 9;
let columns = 9;
let minesCount = 10;
let minesLocation = [];
let tilesClicked = 0;
let flagEnabled = false;
let gameOver = false;

window.onload = function() {
    startGame();
}

function insertMines() {
    let minesLeft = minesCount;
    while (minesLeft > 0) { 
        let row = Math.floor(Math.random() * rows);
        let column = Math.floor(Math.random() * columns);
        let id = row.toString() + "-" + column.toString();
        if (!minesLocation.includes(id)) {
            minesLocation.push(id);
            --minesLeft;
        }
    }
}

function startGame() {
    document.getElementById("minesCount").innerHTML = "Mines : " + minesCount;
    document.getElementById("flagButton").addEventListener("click", setFlag);
    insertMines();
    for (let i = 0; i < rows; ++i) {
        let row = [];
        for (let j = 0; j < columns; ++j) {
            let tile = document.createElement("div");
            tile.id = i.toString() + "-" + j.toString();
            tile.addEventListener("click", clickTile);
            document.getElementById("board").append(tile);
            row.push(tile);
        }
        board.push(row);
    }
}

function setFlag() {
    if (flagEnabled == true) {
         document.getElementById("flagButton").style.backgroundColor = "lightgreen";
        flagEnabled = false;
    } else {
        flagEnabled = true;
        document.getElementById("flagButton").style.backgroundColor = "darkgreen";
    }
}

function clickTile() {
    if (gameOver == true || this.classList.contains("tileClicked")) {
        return;
    }
    let tile = this;

    if (flagEnabled == true) {
        if (tile.innerText == "") {
            tile.innerText = "🚩";
        } else if (tile.innerText == "🚩") {
            tile.innerText = "";
        }
        return;
    }

    if (minesLocation.includes(tile.id)) {
        gameOver = true;
        revealMines();
        return;
    }

    let coordonates = tile.id.split("-"); 
    let row = parseInt(coordonates[0]);
    let column = parseInt(coordonates[1]);
    checkTile(row, column);
}

function revealMines() {
    for (let i = 0; i < rows; ++i) {
        for (let j = 0; j < columns; ++j) {
            let tile = board[i][j];
            if (minesLocation.includes(tile.id)) {
                tile.innerText = "💣";
                tile.style.backgroundColor = "red";                
            }
        }
    }
}

function checkTile(row, column) {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
        return;
    }
    if (board[row][column].classList.contains("tileClicked")) {
        return;
    }
    board[row][column].classList.add("tileClicked");
    ++tilesClicked;
    let minesFound = 0;
    
    for (let i = row - 1; i <= row + 1; ++i) {
        for (let j = column - 1; j <= column + 1; ++j) {
            minesFound += checkMine(i, j);
        }
    }

    if (minesFound > 0) {
        board[row][column].innerText = minesFound;
        board[row][column].classList.add("number" + minesFound.toString());
    } else {
        for (let i = row - 1; i <= row + 1; ++i) {
            for (let j = column - 1; j <= column + 1; ++j) {
                minesFound += checkTile(i, j);
            }
        }  
    }
    if (tilesClicked == rows * columns - minesCount) {
        document.getElementById("minesCount").innerHTML = "Cleared";
        gameOver = true;
    }
}

function checkMine(row, column) {
    if (row < 0 || row >= rows || column < 0 || column >= columns) {
        return 0;
    }
    if (minesLocation.includes(row.toString() + "-" + column.toString())) {
        return 1;
    }
    return 0;
}
