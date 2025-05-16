// Importación de los datos desde el archivo externo
import { timelineData, typeColors } from "./timeline-data.js";

// Elementos DOM
let timelineEvents,
  eventModal,
  closeModal,
  modalTitle,
  modalDate,
  modalBody,
  prevBtn,
  nextBtn,
  progressBar;
let currentAudio = null; // Variable para mantener referencia al audio actual
let currentEventImages = []; // Variable para mantener las imágenes del evento actual

// Inicializamos elementos DOM cuando la página carga
document.addEventListener("DOMContentLoaded", () => {
  timelineEvents = document.getElementById("timelineEvents");
  eventModal = document.getElementById("eventModal");
  closeModal = document.getElementById("closeModal");
  modalTitle = document.getElementById("modalTitle");
  modalDate = document.getElementById("modalDate");
  modalBody = document.getElementById("modalBody");
  prevBtn = document.getElementById("prevBtn");
  nextBtn = document.getElementById("nextBtn");
  progressBar = document.getElementById("progressBar");

  // Inicializamos la generación de eventos
  generateTimelineEvents();

  // Configuramos event listeners
  setupEventListeners();
});

// Generar los eventos en la línea del tiempo
function generateTimelineEvents() {
  timelineEvents.innerHTML = "";

  timelineEvents.addEventListener("scroll", handleScroll);

  timelineData.forEach((event) => {
    const eventElement = document.createElement("div");
    eventElement.className = "timeline-event";
    eventElement.dataset.id = event.id;

    // Añadimos la cinta de color según el tipo de evento
    const ribbonColor = typeColors[event.type] || "#ff7b9c";

    // Estructura minimalista para los eventos
    eventElement.innerHTML = `
            <div class="event-ribbon" style="background: ${ribbonColor};"></div>
            <div class="event-date">${event.date}</div>
            <i class="${event.icon} event-icon"></i>
            <div class="pulse-dot"></div>
        `;

    eventElement.addEventListener("click", () => openModal(event));
    timelineEvents.appendChild(eventElement);
  });

  // Añadimos la animación de pulso a un punto en cada tarjeta
  const events = document.querySelectorAll(".timeline-event");
  events.forEach((event) => {
    const icon = event.querySelector(".event-icon");
    icon.classList.add("pulse");
  });

  updateNavButtons();
  updateProgressBar();
}

// Detener cualquier audio que esté reproduciéndose
function stopCurrentAudio() {
  if (currentAudio) {
    currentAudio.pause();
    currentAudio.currentTime = 0;
    currentAudio = null;
  }
}

// Generar el contenido de la galería de imágenes
function generateImageGallery(images, mainImageIndex = 0) {
  let galleryHTML = "";

  // Imagen principal
  if (images.length > 0) {
    galleryHTML += `<img src="${images[mainImageIndex]}" alt="" class="modal-image" id="mainImage">`;

    // Miniaturas solo si hay más de una imagen
    if (images.length > 1) {
      galleryHTML += '<div class="image-gallery">';
      images.forEach((img, index) => {
        // Añadir clase 'active' a la miniatura seleccionada
        const activeClass = index === mainImageIndex ? "active-thumbnail" : "";
        galleryHTML += `<img src="${img}" alt="" class="gallery-thumbnail ${activeClass}" onclick="expandImage(${index})">`;
      });
      galleryHTML += "</div>";
    }
  }

  return galleryHTML;
}

// Abrir el modal con el contenido del evento
function openModal(event) {
  // Detener cualquier audio reproduciéndose de un modal anterior
  stopCurrentAudio();

  // Guardar las imágenes del evento actual
  currentEventImages = event.content.images || [];

  modalTitle.textContent = event.title;
  modalDate.textContent = event.date;

  let modalContent = "";

  // Contenido de imágenes con galería
  if (currentEventImages.length > 0) {
    modalContent += `<div class="gallery-container">${generateImageGallery(
      currentEventImages
    )}</div>`;
  }

  // Contenido de texto
  if (event.content.text) {
    modalContent += `<p class="modal-text">${event.content.text}</p>`;
  }

  // Emoji
  if (event.content.emoji) {
    modalContent += `<div class="modal-emoji">${event.content.emoji}</div>`;
  }

  // Audio (aún incluimos el elemento de audio visible para control manual)
  if (event.content.audio) {
    modalContent += `
            <div class="modal-audio-container">
                <h4>Radio 'Hola' <i class="fa-solid fa-angles-right"></i></h4>
                <audio controls id="modalAudio" class="modal-audio">
                    <source src="${event.content.audio}" type="audio/mpeg">
                    Tu navegador no soporta el elemento de audio.
                </audio>
            </div>
        `;
  }

  modalBody.innerHTML = modalContent;
  // Añadir clase especial basada en el ID del evento
  eventModal.className = "modal"; // Resetear clases
  eventModal.classList.add(`event-${event.id}`); // Añadir clase específica para el ID
  eventModal.classList.add("active");

  // Bloquear el scroll del body
  document.body.style.overflow = "hidden";

  // Iniciar reproducción automática del audio si existe
  if (event.content.audio) {
    // Obtenemos referencia al elemento de audio
    const audioElement = document.getElementById("modalAudio");

    // Establecemos el volumen al 50%
    audioElement.volume = 0.5;

    // Guardamos referencia al audio actual
    currentAudio = audioElement;

    // Iniciamos la reproducción
    audioElement.play().catch((e) => {
      console.log(
        "Reproducción automática bloqueada por el navegador. El usuario debe interactuar primero."
      );
      // No mostramos error al usuario ya que es una limitación del navegador
    });
  }
}

// Expandir imagen de la galería (ahora recibe el índice en lugar de la URL)
window.expandImage = function (imageIndex) {
  // Verificamos que el índice sea válido
  if (imageIndex >= 0 && imageIndex < currentEventImages.length) {
    // Obtenemos solo el contenedor de la galería
    const galleryContainer = document.querySelector(".gallery-container");

    if (galleryContainer) {
      // Solo reemplazamos el contenido de la galería, no todo el modalBody
      galleryContainer.innerHTML = generateImageGallery(
        currentEventImages,
        imageIndex
      );

      // Desplazarse suavemente a la imagen principal
      document
        .getElementById("mainImage")
        .scrollIntoView({ behavior: "smooth" });
    }
  }
};

// Cerrar el modal
function closeModalFunc() {
  // Detener cualquier audio que esté reproduciéndose
  stopCurrentAudio();

  // Limpiar la variable de imágenes actuales
  currentEventImages = [];

  eventModal.classList.remove("active");
  // Restaurar el scroll del body
  document.body.style.overflow = "auto";
}

// Navegación en la línea del tiempo
function scrollTimeline(direction) {
  const isHorizontal = window.innerWidth >= 768;
  const scrollAmount = isHorizontal ? 350 : 200; // Ajustar según el diseño

  if (isHorizontal) {
    timelineEvents.scrollBy({
      left: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  } else {
    timelineEvents.scrollBy({
      top: direction === "next" ? scrollAmount : -scrollAmount,
      behavior: "smooth",
    });
  }
}

// Manejar el scroll para actualizar botones y barra de progreso
function handleScroll() {
  updateNavButtons();
  updateProgressBar();
}

// Actualizar el estado de los botones de navegación
function updateNavButtons() {
  const isHorizontal = window.innerWidth >= 768;

  if (isHorizontal) {
    prevBtn.disabled = timelineEvents.scrollLeft <= 10;
    nextBtn.disabled =
      timelineEvents.scrollLeft + timelineEvents.clientWidth >=
      timelineEvents.scrollWidth - 10;
  } else {
    prevBtn.disabled = timelineEvents.scrollTop <= 10;
    nextBtn.disabled =
      timelineEvents.scrollTop + timelineEvents.clientHeight >=
      timelineEvents.scrollHeight - 10;
  }
}

// Actualizar la barra de progreso
function updateProgressBar() {
  const isHorizontal = window.innerWidth >= 768;

  if (isHorizontal) {
    const scrollPercentage =
      (timelineEvents.scrollLeft /
        (timelineEvents.scrollWidth - timelineEvents.clientWidth)) *
      100;
    progressBar.style.width = `${scrollPercentage}%`;
  } else {
    const scrollPercentage =
      (timelineEvents.scrollTop /
        (timelineEvents.scrollHeight - timelineEvents.clientHeight)) *
      100;
    progressBar.style.width = `${scrollPercentage}%`;
  }
}

// Configurar event listeners
function setupEventListeners() {
  closeModal.addEventListener("click", closeModalFunc);
  prevBtn.addEventListener("click", () => scrollTimeline("prev"));
  nextBtn.addEventListener("click", () => scrollTimeline("next"));

  // Cerrar modal al hacer clic fuera del contenido
  eventModal.addEventListener("click", (e) => {
    if (e.target === eventModal) {
      closeModalFunc();
    }
  });

  // Escuchar eventos de redimensionamiento
  window.addEventListener("resize", () => {
    updateNavButtons();
    updateProgressBar();
  });

  // Teclas de navegación
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && eventModal.classList.contains("active")) {
      closeModalFunc();
    }
    if (e.key === "ArrowLeft" && !prevBtn.disabled) {
      scrollTimeline("prev");
    }
    if (e.key === "ArrowRight" && !nextBtn.disabled) {
      scrollTimeline("next");
    }
  });
}
