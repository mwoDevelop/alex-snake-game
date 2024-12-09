const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const scoreElement = document.getElementById('scoreValue');
const timeElement = document.getElementById('timeValue');

// Ustawienia gry
canvas.width = 1000;
canvas.height = 1000;
const gridSize = 20;
const tileCount = canvas.width / gridSize;
let speed = 7;
let paused = false; // Dodanie zmiennej paused
let czasGry = 1200; // Czas gry w sekundach (20 minut)

// Wąż
let snake = [
    {x: 10, y: 10},
    {x: 9, y: 10},
    {x: 8, y: 10}
];
let dx = 0;
let dy = 0;

// Jedzenie
let foodX = Math.floor(Math.random() * tileCount);
let foodY = Math.floor(Math.random() * tileCount);

// Punktacja
let score = 0;

// Czas gry

// Główna pętla gry
function gameLoop() {
    if (!paused) {
        updateGame();
        drawGame();
    }
    setTimeout(gameLoop, 1000 / speed);
}

// Aktualizacja stanu gry
function updateGame() {
    // Poruszanie wężem z przechodzeniem przez ściany
    let newHeadX = snake[0].x + dx;
    let newHeadY = snake[0].y + dy;

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
    snake.unshift(newHead);

    // Sprawdzanie kolizji z jedzeniem
    if (snake[0].x === foodX && snake[0].y === foodY) {
        score += 100;
        scoreElement.textContent = score;
        generateFood();
        speed += 0.5; // Zwiększanie prędkości
    } else {
        snake.pop();
    }

    // Sprawdzanie kolizji z własnym ciałem
    for (let i = 1; i < snake.length; i++) {
        if (snake[i].x === snake[0].x && snake[i].y === snake[0].y) {
            resetGame();
        }
    }

    // Odmierzanie czasu gry
    czasGry--;
    timeElement.textContent = czasGry;
    if (czasGry <= 0) {
        resetGame();
        alert("Czas gry minął!");
    }
}

// Rysowanie gry
function drawGame() {
    // Czyszczenie canvas
    ctx.fillStyle = '#34495e';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Rysowanie węża
    ctx.fillStyle = '#2ecc71';
    snake.forEach((segment, index) => {
        ctx.beginPath();
        ctx.arc(segment.x * gridSize + gridSize/2, segment.y * gridSize + gridSize/2, gridSize/2, 0, Math.PI * 2);
        ctx.fill();
        ctx.closePath();

        // Rysowanie oczu i języka tylko dla głowy węża
        if (index === 0) {
            const eyeSize = 4;
            const eyeOffset = 5;
            ctx.fillStyle = 'white';
            
            // Określenie pozycji oczu w zależności od kierunku ruchu
            let leftEyeX, leftEyeY, rightEyeX, rightEyeY;
            let tongueStartX, tongueStartY, tongueEndX, tongueEndY;
            
            if (dx === 1) { // w prawo
                leftEyeX = segment.x * gridSize + gridSize - eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
                tongueStartX = segment.x * gridSize + gridSize;
                tongueStartY = segment.y * gridSize + gridSize/2;
                tongueEndX = tongueStartX + 8;
                tongueEndY = tongueStartY;
            } else if (dx === -1) { // w lewo
                leftEyeX = segment.x * gridSize + eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
                tongueStartX = segment.x * gridSize;
                tongueStartY = segment.y * gridSize + gridSize/2;
                tongueEndX = tongueStartX - 8;
                tongueEndY = tongueStartY;
            } else if (dy === -1) { // w górę
                leftEyeX = segment.x * gridSize + eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + eyeOffset;
                tongueStartX = segment.x * gridSize + gridSize/2;
                tongueStartY = segment.y * gridSize;
                tongueEndX = tongueStartX;
                tongueEndY = tongueStartY - 8;
            } else if (dy === 1) { // w dół
                leftEyeX = segment.x * gridSize + eyeOffset;
                leftEyeY = segment.y * gridSize + gridSize - eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
                tongueStartX = segment.x * gridSize + gridSize/2;
                tongueStartY = segment.y * gridSize + gridSize;
                tongueEndX = tongueStartX;
                tongueEndY = tongueStartY + 8;
            } else { // domyślnie (początek gry)
                leftEyeX = segment.x * gridSize + gridSize - eyeOffset;
                leftEyeY = segment.y * gridSize + eyeOffset;
                rightEyeX = segment.x * gridSize + gridSize - eyeOffset;
                rightEyeY = segment.y * gridSize + gridSize - eyeOffset;
                tongueStartX = segment.x * gridSize + gridSize;
                tongueStartY = segment.y * gridSize + gridSize/2;
                tongueEndX = tongueStartX + 8;
                tongueEndY = tongueStartY;
            }

            // Rysowanie oczu
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

            // Rysowanie języka
            ctx.strokeStyle = '#ff0066';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(tongueStartX, tongueStartY);
            ctx.lineTo(tongueEndX, tongueEndY);
            // Rozwidlenie języka
            if (dx === 1) {
                ctx.lineTo(tongueEndX + 4, tongueEndY - 4);
                ctx.moveTo(tongueEndX, tongueEndY);
                ctx.lineTo(tongueEndX + 4, tongueEndY + 4);
            } else if (dx === -1) {
                ctx.lineTo(tongueEndX - 4, tongueEndY - 4);
                ctx.moveTo(tongueEndX, tongueEndY);
                ctx.lineTo(tongueEndX - 4, tongueEndY + 4);
            } else if (dy === -1) {
                ctx.lineTo(tongueEndX - 4, tongueEndY - 4);
                ctx.moveTo(tongueEndX, tongueEndY);
                ctx.lineTo(tongueEndX + 4, tongueEndY - 4);
            } else if (dy === 1) {
                ctx.lineTo(tongueEndX - 4, tongueEndY + 4);
                ctx.moveTo(tongueEndX, tongueEndY);
                ctx.lineTo(tongueEndX + 4, tongueEndY + 4);
            }
            ctx.stroke();
        }
    });

    // Rysowanie jedzenia
    ctx.fillStyle = '#e74c3c';
    ctx.fillRect(foodX * gridSize, foodY * gridSize, gridSize - 2, gridSize - 2);
}

// Generowanie nowego jedzenia
function generateFood() {
    foodX = Math.floor(Math.random() * tileCount);
    foodY = Math.floor(Math.random() * tileCount);

    // Sprawdzanie czy jedzenie nie pojawiło się na wężu
    snake.forEach(segment => {
        if (segment.x === foodX && segment.y === foodY) {
            generateFood();
        }
    });
}

// Reset gry
function resetGame() {
    snake = [
        { x: 10, y: 10 },
        { x: 9, y: 10 },
        { x: 8, y: 10 }
    ];
    dx = 0;
    dy = 0;
    score = 0;
    speed = 7;
    scoreElement.textContent = score;
    timeElement.textContent = czasGry;
    generateFood();
}

// Obsługa sterowania
document.addEventListener('keydown', (event) => {
    switch (event.key) {
        case 'ArrowUp':
            if (dy!== 1) { // Zapobieganie zawracaniu
                dx = 0;
                dy = -1;
            }
            break;
        case 'ArrowDown':
            if (dy!== -1) {
                dx = 0;
                dy = 1;
            }
            break;
        case 'ArrowLeft':
            if (dx!== 1) {
                dx = -1;
                dy = 0;
            }
            break;
        case 'ArrowRight':
            if (dx!== -1) {
                dx = 1;
                dy = 0;
            }
            break;
        case ' ':
            paused = !paused; // Przełączanie stanu pauzy
            break;
    }
});

// Rozpoczęcie gry
gameLoop();
