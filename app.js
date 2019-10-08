// UI
const winnerMsg = document.querySelector('#winner-msg');
const opponentComment = document.querySelector('#opponent-comment');
const inGameImg = document.querySelector('#in-game-img');
const startPage = document.querySelector('#start-page');
const gamePage = document.querySelector(`#game-page`);
const reloadMsg = document.querySelector('#reload-msg');


let opponent,
human = 'O',
    puter = 'X';

document.addEventListener('DOMContentLoaded', () => {
    const pages = document.querySelectorAll('.page-container')
    for (let page of pages) {
        page.style.display = 'none';
    }
    startPage.style.display = 'block';
    chooseOpponent();
    startDefaults();
});

function chooseOpponent() {
    const einsteinBtn = document.querySelector('#einstein-btn');
    einsteinBtn.addEventListener('click', () => {
        einsteinBtn.style.background = '#fc0';
        trumpBtn.style.background = 'none';
        opponent = 'einstein';
        nextBtn.style.visibility = 'visible';
    })
    const trumpBtn = document.querySelector('#trump-btn');
    trumpBtn.addEventListener('click', () => {
        trumpBtn.style.background = '#fc0';
        einsteinBtn.style.background = 'none';
        opponent = 'trump';
        nextBtn.style.visibility = 'visible';
    })
}

const nextBtn = document.querySelector('#next-page-btn');
nextBtn.addEventListener('click', () => {
    if (opponent == undefined) {
        return;
    }
    document.querySelector(`#${opponent}-page`).style.display = 'block';
    startPage.style.display = 'none';
    choosePlayer();
    playGameBtn();
})

function choosePlayer() {
    const humanX = document.querySelector('#human-X');
    humanX.addEventListener('click', () => {
        human = 'X';
        puter = 'O';
        humanX.style.background = '#fc0';
        humanO.style.background = 'none';
    })
    const humanO = document.querySelector('#human-O');
    humanO.addEventListener('click', () => {
        human = 'O';
        puter = 'X';
        humanO.style.background = '#fc0';
        humanX.style.background = 'none';
    })
}

const btns = document.querySelectorAll('.play-game-btn');

function playGameBtn() {
    for (let btn of btns) {
        btn.addEventListener('click', () => {
            document.querySelector(`#${opponent}-page`).style.display = 'none';
            gamePage.style.display = 'block';
            whoseOnFirst();
        })
    }
}

function whoseOnFirst() {
    if (human == 'X') {
        humanMove();
    } else {
        puterMove()
    }
}

// GAME
const cells = document.querySelectorAll('.cells');
let board = [],
    puterTurn = false,
    gameOver;

function startDefaults() {
    board = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    for (let cell of cells) {
        cell.innerText = '';
    };
    gameOver = false;
    winnerMsg.style.visibility = 'hidden';
    inGameImg.style.visibility = 'hidden';
    opponentComment.innerText = '';
    playAgainBtn.style.visibility = 'hidden';
    nextBtn.style.visibility = 'hidden';
    reloadMsg.style.visibility = 'hidden';
}

function updateBoardUI() {
    for (let cell of cells) {
        if (cell.id != board[cell.id]) {
            cell.innerText = board[cell.id];
        }
    }
}

function humanMove() {
    const boardUI = document.querySelector('#board-UI');
    boardUI.addEventListener('click', (e) => {
        if (!e.target.innerText == '' || gameOver == true || puterTurn == true) {
            return;
        }
        board[e.target.id] = human;
        // NEED UPDATE PLAY FUNC
        updateBoardUI();
        checkWins();
        puterMove();
    })
}

function puterMove() {
    console.clear();
    if (gameOver == true) {
        return;
    }
    if (opponent == 'trump') {
        return trumpMove();
    } else {
        einsteinMove();
    }
}

function einsteinMove() {
    setTimeout(() => {
        puterTurn = true;
        inGameImg.src = "images/einstein.png";
        inGameImg.style.visibility = 'visible';
        return setTimeout(() => {
            einsteinTurn = false,
                inGameImg.style.visibility = 'hidden';
            puterTurn = false,
                puterSmartMove();
        }, 500)
    }, 500)
}

function trumpMove() {
    puterTurn = true;
    const thinkTime = Math.round(Math.random() * (7 - 1) + 1);
    const trumpSmarts = Math.round(Math.random() * 1);

    setTimeout(() => {
        inGameImg.src = "images/thinkTrump.png",
            inGameImg.style.visibility = 'visible';
        setTimeout(() => {
            if (trumpSmarts == 0) {
                return puterTurn = false,
                    inGameImg.style.visibility = 'hidden',
                    puterSmartMove();

            } else {
                return puterTurn = false,
                    inGameImg.style.visibility = 'hidden',
                    puterRandomMove();
            }
        }, thinkTime * 500)
    }, 750)
}

function puterRandomMove() {
    console.log('puterRandomMove')
    if (board.every(cell => typeof cell == 'number')) {
        return firstPuterMove(),
            updateBoardUI(),
            humanMove();
    }
    const randMove = Math.floor(Math.random() * 9)
    if (typeof board[randMove] == 'number') {
        return board[randMove] = puter,
            updateBoardUI(),
            checkWins();
    } else {
        puterRandomMove();
    }
}
const wins = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [6, 4, 2]
];

function firstPuterMove() {
    const corners = [0, 2, 6, 8];
    const randIndex = Math.round(Math.random() * 3);
    console.log('first move', randIndex)
    return board[corners[randIndex]] = puter;
}

function puterSmartMove() {
    console.log('puterSmartMove')
    if (board.every(cell => typeof cell == 'number')) {
        return firstPuterMove(),
            updateBoardUI(),
            humanMove();
    }
    // DECLARE VARS FUNC LEVEL  - STRAIGHT FOR LOOPS 4 LOGIC
    //  PUTER WINS
    for (const win of wins) {
        const unplayed = win.filter(cell => typeof board[cell] == 'number');
        const puterPlayed = win.filter(cell => board[cell] == puter);
        if (puterPlayed.length == 2 && unplayed.length == 1) {
            return console.log('puter wins'),
                board[unplayed] = puter,
                updateBoardUI(),
                checkWins();
        }
    }

    for (const win of wins) {
        const unplayed = win.filter(cell => typeof board[cell] == 'number');
        const humanPlayed = win.filter(cell => board[cell] == human);

        // PUTER BLOCKS
        if (humanPlayed.length == 2 && unplayed.length == 1) {
            return console.log('puter blocks'),
                board[unplayed] = puter,
                updateBoardUI(),
                puterTurn = false,
                checkWins();
        }
    }
    puterRandomMove()
}

const tieGame = () => board.filter(cell => typeof cell == 'string').length == 9;

function checkWins() {
    for (const win of wins) {
        if (win.every(cell => board[cell] == human)) {
            return winner(human)
        } else if (win.every(cell => board[cell] == puter)) {
            return winner(puter)
        }
    }
    if (tieGame() == true) {
        return winner('tie');
    }
}

let tempIndex = [],
    randAlbertIndex;

function randomAlbert() {
    if (tempIndex.length == 6) {
        return tempIndex = [], randomAlbert();
    }
    randAlbertIndex = Math.round(Math.random() * 5);
    if (!tempIndex.includes(randAlbertIndex)) {
        tempIndex.push(randAlbertIndex);
        return randAlbertIndex;
    } else randomAlbert();
}

function winner(player) {
    if (opponent == 'einstein') {
        randomAlbert();
    }
    let winMsg = '';
    let opponentMsg = '';
    if (player == 'tie') {
        if (opponent == 'trump') {
            return winnerMsg.innerText = 'you tied Trump!!!',
                winnerMsg.style.visibility = 'visible',
                opponentComment.innerText = trumpComments.tie,
                inGameImg.src = `images/${opponent}.png`,
                inGameImg.style.visibility = 'visible',
                gameOver = true,
                setTimeout(() => {
                    callPutin();
                }, 3000);
        } else {
            opponentMsg = 'Albert says: ' + einsteinComments[randAlbertIndex];
        }
        inGameImg.src = `images/${opponent}.png`;
        inGameImg.style.visibility = 'visible';
        winMsg = `you tied ${capMe(opponent)}!!!`
    }

    if (player == puter) {
        winMsg = `${capMe(opponent)} wins!!!`;
        inGameImg.src = `images/${opponent}.png`;
        inGameImg.style.visibility = 'visible';
        if (opponent == 'trump') {
            opponentMsg = trumpComments.win;
        } else {
            opponentMsg = 'Albert says: ' + einsteinComments[randAlbertIndex];
        }
    }
    if (player == human) {
        winMsg = `you beat ${capMe(opponent)}!!!`
        if (opponent == 'trump') {
            inGameImg.src = "images/hillary.png";
            inGameImg.style.visibility = 'visible';
            opponentMsg = trumpComments.loss;
        } else {
            inGameImg.src = "images/einstein.png";
            inGameImg.style.visibility = 'visible';
            opponentMsg = 'Albert says: ' + einsteinComments[randAlbertIndex];
        }
    }
    return gameOver = true, winnerMsg.style.visibility = 'visible', winnerMsg.innerText = winMsg, opponentComment.innerText = opponentMsg, playAgain();
}

function playAgain() {
    playAgainBtn.innerText = `play ${capMe(opponent)} again`;
    playAgainBtn.style.visibility = 'visible';
    reloadMsg.style.visibility = 'visible';
}

const capMe = (word) => word.split('')[0].toUpperCase() + word.slice(1);

const playAgainBtn = document.querySelector('#play-again-btn');
playAgainBtn.addEventListener('click', () => {
    playAgainBtn.style.visibility = 'hidden';
    startDefaults();
    whoseOnFirst();
})


const callPutinPage = document.querySelector('#call-putin-page');

// document.querySelector('#test-call').addEventListener('click', () => {
//     callPutin();
// })

function callPutin() {
    gamePage.style.display = 'none';
    callPutinPage.style.display = 'block';
    const trumpPhoneImg = document.querySelector('#trump-phone');
    const putinPhoneImg = document.querySelector('#putin-phone');

    setTimeout(() => {
        trumpPhoneImg.style.visibility = 'visible';
    }, 500);
    setTimeout(() => {
        putinPhoneImg.style.visibility = 'visible';
    }, 2000);
    setTimeout(() => {
        putinPhoneImg.style.visibility = 'hidden';
    }, 5000);
    setTimeout(() => {
        trumpPhoneImg.style.visibility = 'hidden';
    }, 5500);
    setTimeout(() => {
        callPutinPage.style.display = 'none';
        gamePage.style.display = 'block';
        return opponent = 'trump', board = ['X', 'X', 'X', 'X', 'X', 'X', 'X', 'X', 'X'], updateBoardUI(), checkWins();
    }, 7500)
}

const trumpComments = {
    win: '"STABLE GENIUS!!!"',
    tie: "Putin will know how to fix this...",
    loss: "Please call the  Democratic National Committee  at 202-863-8000 now!"
};
const einsteinComments = {
    0: `"A calm and modest life brings more happiness than the pursuit of success combined with constant restlessness."`,
    1: `"Try not to become a man of success, but rather try to become a man of value."`,
    2: `"If you can't explain it simply, you don't understand it well enough."`,
    3: `"Unthinking respect for authority is the greatest enemy of truth."`,
    4: `"Great spirits have always encountered violent opposition from mediocre minds."`,
    5: `"The world is in greater peril from those who tolerate or encourage evil than from those who actually commit it."`
}