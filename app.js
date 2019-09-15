// UI person AND CHARACTERS
const startPage = document.querySelector('#start-page');
const trumpPage = document.querySelector('#trump-page');
trumpPage.style.display = 'none';
const einsteinPage = document.querySelector('#einstein-page');
einsteinPage.style.display = 'none';
const gamePage = document.querySelector('#game-page');
gamePage.style.display = 'none';

document.addEventListener('DOMContentLoaded', chooseOpponent)
let opponent = '';

function chooseOpponent() {
    const einsteinBtn = document.querySelector('#einstein-btn');
    const trumpBtn = document.querySelector('#trump-btn');
    einsteinBtn.addEventListener('click', () => {
        einsteinBtn.style.border = 'solid red 2px';
        trumpBtn.style.border = 'none';
        return opponent = 'Einstein';
    })
    trumpBtn.addEventListener('click', () => {
        trumpBtn.style.border = 'solid red 2px'
        einsteinBtn.style.border = 'none';
        return opponent = 'Trump';
    })
}

document.querySelector('#next-btn').addEventListener('click', () => {
    if (opponent == '') {
        // some kinda animated UI goes here
        return
    }
    startPage.style.display = 'none';
    if (opponent == 'Einstein') {
        einsteinPage.style.display = 'block';
        choosePlayer();
    } else {
        trumpPage.style.display = 'block'
    }
})

let person = 'O',
    puter = 'X';

function choosePlayer() {
    const chooseOpponentBtns = document.querySelectorAll('.choose-opponent-btn');
    for (chooseOpponentBtn of chooseOpponentBtns) {
        chooseOpponentBtn.addEventListener('click', (e) => {
            if (e.target.innerText == 'X') {
                return person = 'X', puter = 'O';
            }
        })
    }
}

const playGameBtns = document.querySelectorAll('.play-game-btn')
for (playGameBtn of playGameBtns) {
    playGameBtn.addEventListener('click', () => {
        if (opponent == 'Einstein') {
            einsteinPage.style.display = 'none';
        } else {
            trumpPage.style.display = 'none';
        }
        gamePage.style.display = 'block';
        puterFirst();
    })
}

function puterFirst() {
    if (puter == 'X') {
        setTimeout(randomPuter, 500);
    }
}

// GAME
const gridContainer = document.querySelector('#grid-container');
let gameOver = false;
let totalMoves = 0;

let grid = [
    [null, null, null],
    [null, null, null],
    [null, null, null]
];

gridContainer.addEventListener('click', (e) => {
    if (gameOver == true) {
        return;
    } else if (e.target.classList.contains('cell')) {
        if (e.target.innerText != '') {
            return
        } else {
            e.target.innerText = person;
            const personIndx1 = e.target.id.slice(0, 1);
            const personIndx2 = e.target.id.slice(1, 2);
            grid[personIndx1][personIndx2] = person;
            totalMoves++;
        }
    }
    updateBoard();
    setTimeout(smartPuter, 500);
})

function updateBoard() {
    for (let i = 0; i < grid.length; i++) {
        for (let j = 0; j < grid[i].length; j++) {
            document.getElementById(i + '' + j).innerText = grid[i][j];
        }
    }
    checkWinner();
}

function smartPuter() {
    // ROWS
    for (let row = 0; row < grid.length; row++) {
        if (!grid[row].includes(null)) {
            continue
        }
        if (grid[row].filter(x => x == puter).length == 2) {
            return grid[row][grid[row].indexOf(null)] = puter, totalMoves++, updateBoard();
        } else if (grid[row].filter(x => x == person).length == 2) {
            return grid[row][grid[row].indexOf(null)] = puter, totalMoves++, updateBoard();
        }
    }
    // COLS
    for (let col = 0; col < grid.length; col++) {
        let colArr = []
        for (let row = 0; row < grid.length; row++) {
            colArr.push(grid[row][col])
            if (colArr.length == 3) {
                if (!colArr.includes(null)) {
                    continue
                } else if (colArr.filter(x => x == puter).length == 2 ||
                    colArr.filter(x => x == person).length == 2) {
                    return grid[colArr.indexOf(null)][col] = puter, totalMoves++, updateBoard();
                }
            }
        }
    }
    // DIAGS
    const diagDown = [grid[0][0], grid[1][1], grid[2][2]];
    if (diagDown.includes(null)) {
        if (diagDown.filter(x => x == puter).length == 2 ||
            diagDown.filter(x => x == person).length == 2
        ) {
            return grid[diagDown.indexOf(null)][diagDown.indexOf(null)] = puter, totalMoves++, updateBoard();
        }
    }
    const diagUp = [grid[0][2], grid[1][1], grid[2][2]];

    return randomPuter();
}

function randomPuter() {
    if (gameOver == true) {
        return;
    }
    const puterIndx1 = Math.floor(Math.random() * 3)
    const puterIndx2 = Math.floor(Math.random() * 3)

    if (grid[puterIndx1][puterIndx2] == null) {
        grid[puterIndx1][puterIndx2] = puter;
        updateBoard()
        totalMoves++;

    } else {
        randomPuter();
    }
}


const playAgainBtn = document.querySelector('.play-again-btn');
playAgainBtn.style.visibility = 'hidden';
playAgainBtn.addEventListener('click', () => {
    return grid = [
            [null, null, null],
            [null, null, null],
            [null, null, null]
        ],
        updateBoard(),
        totalMoves = 0,
        gameOver = false,
        winnerMsg.innerText = '',
        opponentComment.innerText = '',
        inGameImg.src = '',
        playAgainBtn.style.visibility = 'hidden',
        puterFirst()
});

const winnerMsg = document.querySelector('#winner-msg');
const opponentComment = document.querySelector('#opponent-comment');
const inGameImg = document.querySelector('#in-game-img');

function winner(player) {
    let msg;
    if (player == person) {
        msg = `you beat ${opponent}!`;
        if (opponent == 'Trump') {
            opponentComment.innerText = opponentComments.trump.win
            inGameImg.src = "images/hillary.png"
        }
    } else if (player == puter) {
        msg = `${opponent} beat you!`;
        if (opponent == 'Trump') {
            opponentComment.innerText = opponentComments.trump.loss
            inGameImg.src = "images/trump.png"
        }
    } else {
        msg = `you tied ${opponent}!`;
        if (opponent == 'Trump') {
            opponentComment.innerText = opponentComments.trump.tie
            inGameImg.src = "images/trump.png"
        };
    }
    return winnerMsg.innerText = msg, gameOver = true, playAgainBtn.style.visibility = 'visible';
}

function checkWinner() {
    if (grid[1][1] != null) {
        if (grid[0][0] == grid[1][1] && grid[0][0] == grid[2][2] ||
            grid[0][2] == grid[1][1] && grid[0][2] == grid[2][0]) {
            return winner(grid[1][1]);
        }
    }

    for (let row = 0; row < grid.length; row++) {
        if (grid[row].includes(null)) {
            continue;
        } else if (grid[row][0] == grid[row][1] && grid[row][0] == grid[row][2]) {
            return winner(grid[row][0]);
        }
    }
    for (let col = 0; col < grid.length; col++) {
        if (grid[0][col] == null) {
            continue;
        } else if (grid[0][col] == grid[1][col] && grid[0][col] == grid[2][col]) {
            return winner(grid[0][col]);
        }
    }
    if (totalMoves == 9) {
        return winner();
    }
}

// win / loss from user perspective
const opponentComments = {
    trump: {
        win: "OMG!!! please call the Democratic National Committee at 202-863-8000 now!",
        tie: '"THIS WAS NOT SUPPOSED TO HAPPEN!! Hold on..."',
        loss: '"I am the best tic tac toer that has ever lived. I would never lie. No one has ever been better at tic tac toeing than me..."'
    }
}




const wins = [
    // rows
    [grid[0][0], grid[0][1], grid[0][2]],
    [grid[1][0], grid[1][1], grid[1][2]],
    [grid[2][0], grid[2][1], grid[2][2]],
    // cols
    [grid[0][0], grid[1][0], grid[2][0]],
    [grid[0][1], grid[1][1], grid[2][1]],
    [grid[0][2], grid[1][2], grid[2][2]],
    // diags
    [grid[0][0], grid[1][1], grid[2][2]],
    [grid[2][0], grid[1][1], grid[0][2]]
];





// function smartMachine(arr) {
//     for (let row of arr) {
//         if (row.filter(cell => cell == 'X').length == 2) {
//             // console.log(row, row.indexOf(null))
//             return row[row.indexOf(null)] = 'X';
//         }
//     }
// }

// smartMachine(cols)