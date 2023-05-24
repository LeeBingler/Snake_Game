const gameBoard = document.querySelector('#gameBoard');
const resetBtn = document.querySelector('#resetBtn');
const scoreText = document.querySelector('#scoreText');

const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const ctx = gameBoard.getContext('2d');

const boardBg = 'white';
const snakeColor = 'lightgreen';
const snakeBorderColor = 'black';
const foodColor = 'red';
const unitSize = 25;

let running = false;
let tickInMS = 75;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
let snake = [
    {x:unitSize * 4, y:0},
    {x:unitSize * 3, y:0},
    {x:unitSize * 2, y:0},
    {x:unitSize, y:0},
    {x:0, y:0},
];

window.addEventListener('keydown', changeDirection);
resetBtn.addEventListener('click', resetGame);

gameStart();

function gameStart() {
    running = true;
    scoreText.textContent = `Score: ${score}`;
    createFood();
    drawFood();
    nextTick();
};

function nextTick() {
    if (running) {
        setTimeout(() => {
            clearBoard();
            drawFood();
            moveSnake();
            drawSnake();
            checkGameOver();
            nextTick();
        }, tickInMS);
    } else {
        displayGameOver();
    }
};

function clearBoard() {
    ctx.fillStyle = boardBg;
    ctx.fillRect(0, 0, gameWidth, gameHeight);
};

function drawSnake() {
    ctx.fillStyle = snakeColor;
    ctx.strokeStyle = snakeBorderColor;
    snake.forEach(cell => {
        ctx.fillRect(cell.x, cell.y, unitSize, unitSize);
        ctx.strokeRect(cell.x, cell.y, unitSize, unitSize);
    });
};

function moveSnake() {
    const head = {x: snake[0].x + xVelocity,
                  y: snake[0].y + yVelocity};

    snake.unshift(head);
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 1;
        scoreText.textContent = `Score: ${score}`;
        createFood();
    } else
        snake.pop();
};

function checkOutOfBound(head) {
    switch (true) {
    case (head.y < 0 || head.x < 0):
        running = false;
        break;
    case (head.y >= gameHeight || head.x >= gameWidth):
        running = false;
        break;
    default:
        running = true
    }
};

function checkCollideSnake(head) {
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            running = false;
        }
    }
};

function checkGameOver() {
    const head = snake[0];

    checkOutOfBound(head);
    checkCollideSnake(head);
};

function displayGameOver() {
    ctx.fillStyle = 'red';
    ctx.font = '99px cursive';
    ctx.fillText('Game Over !!!', 0, gameHeight / 2);
};

function changeDirection(event){
    const keyPressed = event.keyCode;

    const LEFT = 37;
    const RIGHT = 39;
    const UP = 38;
    const DOWN = 40;

    const goingUp = (yVelocity == -unitSize);
    const goingDown = (yVelocity == unitSize);
    const goingLeft = (xVelocity == -unitSize);
    const goingRight = (xVelocity == unitSize);

    switch(true) {
    case (keyPressed == LEFT && !goingLeft && !goingRight):
        xVelocity = -unitSize;
        yVelocity = 0;
        break;
    case (keyPressed == RIGHT && !goingRight && !goingLeft):
        xVelocity = unitSize;
        yVelocity = 0;
        break;
    case (keyPressed == UP && !goingUp && !goingDown):
        xVelocity = 0;
        yVelocity = -unitSize;
        break;
    case (keyPressed == DOWN && !goingDown && !goingUp):
        xVelocity = 0;
        yVelocity = unitSize;
        break;
    }
};

function resetGame() {
    xVelocity = unitSize;
    yVelocity = 0;
    score = 0;
    snake = [
        {x:unitSize * 4, y:0},
        {x:unitSize * 3, y:0},
        {x:unitSize * 2, y:0},
        {x:unitSize, y:0},
        {x:0, y:0},
    ];

    gameStart();
};

function createFood() {
    function randomNum(min, max) {
        return Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize;
    }
    foodX = randomNum(0, gameWidth - unitSize);
    foodY = randomNum(0, gameHeight - unitSize);
};

function drawFood() {
    ctx.fillStyle = foodColor;
    ctx.fillRect(foodX, foodY, unitSize, unitSize);
};
