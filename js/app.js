// carousel logic
const carouselInner = document.querySelector('.carousel-inner');

if (carouselInner) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    let autoPlayInterval;

    function updateCarousel() {
        const offset = -currentSlide * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
    }

    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, 10000);
    }

    function resetAutoPlay() {
        clearInterval(autoPlayInterval);
        startAutoPlay();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            nextSlide();
            resetAutoPlay();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            prevSlide();
            resetAutoPlay();
        });
    }

    updateCarousel();
    startAutoPlay();
}

// menu logic
const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');

const links = {
    director: document.querySelector('a[href="#director"]'),
    photographers: document.querySelector('a[href="#photographers"]'),
    work: document.querySelector('a[href="#work"]')
};

const lists = {
    director: document.getElementById('list-director'),
    photographers: document.getElementById('list-photographers'),
    work: document.getElementById('list-work')
};

const menuColors = [
    '#FF3B30','#FF9500',
    '#FFCC00','#4CD964',
    '#5AC8FA','#007AFF',
    '#5856D6','#AF52DE',
    '#FF2D55','#A2845E'  
];
let lastColorIndex = -1;
let currentCategory = null;

function changeColor() { // randomizer
    let newIndex;
    do {
        newIndex = Math.floor(Math.random() * menuColors.length);
    } while (newIndex === lastColorIndex);
    lastColorIndex = newIndex;
    menuOverlay.style.backgroundColor = menuColors[newIndex];
}

function handleMenuClick(e, category) {
    if(e) e.preventDefault();

    if (menuOverlay.classList.contains('open') && currentCategory === category) {
        closeMenu();
        return;
    }

    if (lists.director) lists.director.style.display = 'none';
    if (lists.photographers) lists.photographers.style.display = 'none';
    if (lists.work) lists.work.style.display = 'none';
    
    if (lists[category]) {
        lists[category].style.display = 'block';
    }

    changeColor();
    menuOverlay.classList.add('open');
    currentCategory = category;
}

function closeMenu() {
    if (menuOverlay) {
        menuOverlay.classList.remove('open');
        currentCategory = null;
    }
}

if (links.director) {
    links.director.addEventListener('click', (e) => handleMenuClick(e, 'director'));
}
if (links.photographers) {
    links.photographers.addEventListener('click', (e) => handleMenuClick(e, 'photographers'));
}
if (links.work) {
    links.work.addEventListener('click', (e) => handleMenuClick(e, 'work'));
}

if (closeMenuBtn) {
    closeMenuBtn.addEventListener('click', closeMenu);
}

document.addEventListener('click', (e) => {
    if (menuOverlay && menuOverlay.classList.contains('open') && 
        !menuOverlay.contains(e.target) && 
        e.target !== links.director && 
        e.target !== links.photographers && 
        e.target !== links.work) {
        closeMenu();
    }
});
