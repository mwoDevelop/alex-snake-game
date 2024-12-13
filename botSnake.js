// Bot Snake
let botSnake = [
    {x: 5, y: 5},
    {x: 4, y: 5},
    {x: 3, y: 5}
];
let botDx = 1;
let botDy = 0;

// Funkcja sprawdzająca, czy dany punkt jest wolny
function isFree(x, y) {
    // Sprawdzanie kolizji z ciałem bota
    for (let segment of botSnake) {
        if (segment.x === x && segment.y === y) {
            return false;
        }
    }
    // Sprawdzanie kolizji z ciałem gracza
    for (let segment of snake) {
        if (segment.x === x && segment.y === y) {
            return false;
        }
    }
    return true;
}

// Aktualizacja stanu bota
function updateBotSnake() {
    let potentialMoves = [
        { x: botSnake[0].x + 1, y: botSnake[0].y, dx: 1, dy: 0 }, // Prawo
        { x: botSnake[0].x - 1, y: botSnake[0].y, dx: -1, dy: 0 }, // Lewo
        { x: botSnake[0].x, y: botSnake[0].y + 1, dx: 0, dy: 1 }, // Dół
        { x: botSnake[0].x, y: botSnake[0].y - 1, dx: 0, dy: -1 }  // Góra
    ];

    // Filtruj ruchy, które są wolne
    potentialMoves = potentialMoves.filter(move => isFree(move.x, move.y));

    // Wybierz ruch, który zbliża bota do jedzenia
    let bestMove = potentialMoves[0];
    let minDistance = Infinity;

    for (let move of potentialMoves) {
        let distance = Math.abs(move.x - foodX) + Math.abs(move.y - foodY);
        if (distance < minDistance) {
            minDistance = distance;
            bestMove = move;
        }
    }

    if (bestMove) {
        botDx = bestMove.dx;
        botDy = bestMove.dy;
    }

    let newHeadX = botSnake[0].x + botDx;
    let newHeadY = botSnake[0].y + botDy;

    // Przechodzenie przez ściany
    if (newHeadX < 0) {
        newHeadX = tileCount - 1;
    } else if (newHeadX >= tileCount) {
        newHeadX = 0;
    }
    
    if (newHeadY < 0) {
        newHeadY = tileCount - 1;
    } else if (newHeadY >= tileCount) {
        newHeadY = 0;
    }

    const newHead = { x: newHeadX, y: newHeadY };
    botSnake.unshift(newHead);

    // Sprawdzanie kolizji z jedzeniem
    if (botSnake[0].x === foodX && botSnake[0].y === foodY) {
        generateFood();
        // Dodaj 15 segmentów do węża bota
        for (let i = 0; i < 15; i++) {
            botSnake.push({x: botSnake[botSnake.length - 1].x, y: botSnake[botSnake.length - 1].y});
        }
    } else {
        botSnake.pop();
    }

    // Sprawdzanie kolizji bota z samym sobą
    for (let i = 1; i < botSnake.length; i++) {
        if (botSnake[i].x === botSnake[0].x && botSnake[i].y === botSnake[0].y) {
            resetBotSnake();
        }
    }

    // Sprawdzanie kolizji bota z wężem gracza
    for (let i = 0; i < snake.length; i++) {
        if (snake[i].x === botSnake[0].x && snake[i].y === botSnake[0].y) {
            resetBotSnake();
        }
    }
}

// Początkowa pozycja i długość bota
const initialBotSnake = [
    {x: 5, y: 5},
    {x: 4, y: 5},
    {x: 3, y: 5}
];

// Resetowanie pozycji bota
function resetBotSnake() {
    // Kopiowanie początkowej pozycji i długości do botSnake
    botSnake = initialBotSnake.map(segment => ({ ...segment }));
    botDx = 1;
    botDy = 0;
}

// Rysowanie bota
function drawBotSnake() {
    botSnake.forEach((segment, index) => {
        if (index === 0) {
            // Rysowanie głowy bota
            ctx.fillStyle = '#2980b9'; // Inny kolor dla głowy
            ctx.beginPath();
            ctx.arc(segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2, gridSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();

            // Rysowanie oczu
            const eyeSize = 4;
            const eyeOffset = 5;
            ctx.fillStyle = 'white';
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;

            if (botDx === 1) { // w prawo
                leftEyeX = segment.x * gridSize + gridSize - eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
            } else if (botDx === -1) { // w lewo
                leftEyeX = segment.x * gridSize + eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
            } else if (botDy === -1) { // w górę
                leftEyeX = segment.x * gridSize + eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + eyeOffset;
            } else if (botDy === 1) { // w dół
                leftEyeX = segment.x * gridSize + eyeOffset;
                leftEyeY = segment.y * gridSize + gridSize - eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
            }

            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize, 0, Math.PI * 2);
            ctx.fill();

            // Czarne źrenice
            ctx.fillStyle = 'black';
            ctx.beginPath();
            ctx.arc(leftEyeX, leftEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.arc(rightEyeX, rightEyeY, eyeSize/2, 0, Math.PI * 2);
            ctx.fill();
        } else {
            // Rysowanie ciała bota
            ctx.fillStyle = '#3498db';
            ctx.beginPath();
            ctx.arc(segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2, gridSize/2, 0, Math.PI * 2);
            ctx.fill();
            ctx.closePath();
        }
    });
}

// Modyfikacja głównej pętli gry, aby uwzględnić bota
function gameLoop() {
    if (!paused) {
        updateGame();
        updateBotSnake(); // Aktualizacja bota
        drawGame();
        drawBotSnake(); // Rysowanie bota
    }
    setTimeout(gameLoop, 1000 / speed);
}

console.log('Bot Snake:', botSnake);
console.log('Food Position:', foodX, foodY);
