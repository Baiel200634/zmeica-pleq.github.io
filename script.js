const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Настройки игры
const boxSize = 20; // Размер квадрата
const canvasSize = canvas.width; // Размер холста
let snake = [{ x: 9 * boxSize, y: 9 * boxSize }]; // Начальная длина змейки
let food = spawnFood(); // Координаты еды
let direction = null; // Текущее направление
let score = 0;
let level = 1; // Начальный уровень
let speed = 300; // Скорость (мс между кадрами)
let gameInterval; // Интервал игры

// Функция для отрисовки элементов
function draw() {
  ctx.clearRect(0, 0, canvasSize, canvasSize);

  // Рисуем змейку
  snake.forEach((segment, index) => {
    ctx.fillStyle = index === 0 ? "green" : "lightgreen";
    ctx.fillRect(segment.x, segment.y, boxSize, boxSize);
  });

  // Рисуем еду
  ctx.fillStyle = "red";
  ctx.fillRect(food.x, food.y, boxSize, boxSize);

  // Вывод уровня
  ctx.fillStyle = "black";
  ctx.font = "16px Arial";
  ctx.fillText(`Level: ${level}`, 10, 20);
}

// Функция для обновления состояния игры
function update() {
  const head = { ...snake[0] }; // Получаем голову змейки

  // Изменяем координаты в зависимости от направления
  if (direction === "LEFT") head.x -= boxSize;
  if (direction === "UP") head.y -= boxSize;
  if (direction === "RIGHT") head.x += boxSize;
  if (direction === "DOWN") head.y += boxSize;

  // Проверяем, съедена ли еда
  if (head.x === food.x && head.y === food.y) {
    score++;
    document.getElementById("score").textContent = `Score: ${score}`;
    food = spawnFood();

    // Повышение уровня каждые 5 очков
    if (score % 5 === 0) {
      level++;
      speed = Math.max(100, speed - 50); // Уменьшаем интервал, увеличивая скорость
      clearInterval(gameInterval); // Останавливаем текущий цикл
      gameInterval = setInterval(gameLoop, speed); // Запускаем с новой скоростью
    }
  } else {
    snake.pop(); // Убираем хвост, если еда не съедена
  }

  // Проверяем столкновения
  if (
    head.x < 0 || head.x >= canvasSize || // Выход за границы
    head.y < 0 || head.y >= canvasSize || // Выход за границы
    snake.some(segment => segment.x === head.x && segment.y === head.y) // Столкновение с телом
  ) {
    alert(`Game Over! Your score: ${score} | Level: ${level}`);
    document.location.reload();
    return;
  }

  snake.unshift(head); // Добавляем новый сегмент в голову
}

// Функция для генерации еды
function spawnFood() {
  return {
    x: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
    y: Math.floor(Math.random() * (canvasSize / boxSize)) * boxSize,
  };
}

// Управление
document.addEventListener("keydown", event => {
  if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
  if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
});

// Игровой цикл
function gameLoop() {
  update();
  draw();
}

// Запускаем игру
gameInterval = setInterval(gameLoop, speed);
