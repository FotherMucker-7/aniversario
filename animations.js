// animations.js - Maneja la creación y movimiento de elementos animados de fondo

document.addEventListener("DOMContentLoaded", () => {
  // Crear el contenedor de las animaciones de fondo
  createBackgroundContainer();

  // Generar los diferentes elementos animados
  generateFloatingElements();

  // Aplicar efecto parallax en scroll
  setupParallaxEffect();
});

// Crear el contenedor principal para las animaciones
function createBackgroundContainer() {
  const container = document.createElement("div");
  container.className = "background-animations";
  document.body.appendChild(container);
}

// Generar los elementos flotantes
function generateFloatingElements() {
  const container = document.querySelector(".background-animations");

  // Generar corazones
  createMultipleElements("floating-heart", 6, container, {
    size: [15, 40],
    animationDuration: [10, 15],
    delay: [0, 5],
  });

  // Generar burbujas
  createMultipleElements("bubble", 10, container, {
    size: [20, 60],
    animationDuration: [20, 30],
    delay: [0, 10],
  });

  // Generar estrellas
  createMultipleElements("star", 12, container, {
    size: [5, 15],
    animationDuration: [4, 8],
    delay: [0, 5],
  });

  // Generar confeti
  createMultipleElements("confetti", 15, container, {
    size: [5, 10],
    animationDuration: [15, 25],
    delay: [0, 10],
  });

  // Generar círculos suaves
  createMultipleElements("soft-circle", 8, container, {
    size: [80, 200],
    animationDuration: [15, 25],
    delay: [0, 5],
  });
}

// Crear múltiples elementos con propiedades aleatorias
function createMultipleElements(className, count, container, options) {
  for (let i = 0; i < count; i++) {
    const element = document.createElement("div");
    element.className = `${className} parallax-element`;

    // Tamaño aleatorio
    const size = getRandomNumber(options.size[0], options.size[1]);
    element.style.width = `${size}px`;
    element.style.height = `${size}px`;

    // Posición aleatoria
    element.style.left = `${getRandomNumber(5, 95)}%`;
    element.style.top = `${getRandomNumber(5, 95)}%`;

    // Retraso aleatorio
    const delay = getRandomNumber(options.delay[0], options.delay[1]);
    element.style.animationDelay = `${delay}s`;

    // Duración aleatoria
    const duration = getRandomNumber(
      options.animationDuration[0],
      options.animationDuration[1]
    );
    element.style.animationDuration = `${duration}s`;

    // Para confeti y burbujas, añadir colores aleatorios
    if (className === "confetti") {
      const colors = ["#ff7b9c", "#7bc9ff", "#ffda7b", "#7bff9a", "#c97bff"];
      element.style.backgroundColor =
        colors[Math.floor(Math.random() * colors.length)];
      element.style.transform = `rotate(${getRandomNumber(0, 360)}deg)`;
    }

    // Añadir la animación correspondiente
    if (className === "floating-heart") {
      element.style.animation = `floatHeart ${duration}s ease-in-out infinite ${delay}s`;
    }

    // Cambiar la profundidad para efecto parallax
    const zIndex = getRandomNumber(-50, -20);
    element.style.zIndex = zIndex;
    element.dataset.depth = (Math.abs(zIndex) / 50).toFixed(2); // Valor entre 0.4 y 1

    container.appendChild(element);
  }
}

// Función para obtener un número aleatorio entre min y max
function getRandomNumber(min, max) {
  return Math.random() * (max - min) + min;
}

// Configurar el efecto parallax en scroll
function setupParallaxEffect() {
  const parallaxElements = document.querySelectorAll(".parallax-element");

  window.addEventListener("scroll", () => {
    const scrollY = window.scrollY;

    parallaxElements.forEach((element) => {
      const depth = element.dataset.depth || 0.5;
      const movement = scrollY * depth * 0.15;

      element.style.transform = `translateY(${movement}px)`;
    });
  });

  // También mover elementos cuando se mueve el ratón
  document.addEventListener("mousemove", (e) => {
    const mouseX = e.clientX / window.innerWidth - 0.5;
    const mouseY = e.clientY / window.innerHeight - 0.5;

    parallaxElements.forEach((element) => {
      const depth = element.dataset.depth || 0.5;
      const moveX = mouseX * depth * 20;
      const moveY = mouseY * depth * 20;

      element.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
  });
}
