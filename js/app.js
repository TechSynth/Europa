// ─────────────────────────────────────────────
// CAROUSEL con async/await
// ─────────────────────────────────────────────

const carouselInner = document.querySelector('.carousel-inner');

if (carouselInner) {
    let currentSlide = 0;
    const slides = document.querySelectorAll('.carousel-item');
    const totalSlides = slides.length;
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const dotsContainer = document.querySelector('.carousel-dots');
    const scrollHint = document.querySelector('.scroll-hint');
    let autoPlayInterval;

    function buildDots() {
        if (!dotsContainer) return;
        slides.forEach((_, i) => {
            const dot = document.createElement('button');
            dot.classList.add('dot');
            dot.setAttribute('aria-label', `Slide ${i + 1}`);
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        });
    }

    function updateDots() {
        if (!dotsContainer) return;
        dotsContainer.querySelectorAll('.dot').forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function updateCarousel() {
        const offset = -currentSlide * 100;
        carouselInner.style.transform = `translateX(${offset}%)`;
        updateDots();
    }

    function goToSlide(index) {
        currentSlide = ((index % totalSlides) + totalSlides) % totalSlides;
        updateCarousel();
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

    if (scrollHint) {
        scrollHint.addEventListener('click', () => {
            const footer = document.querySelector('.main-footer');
            if (footer) footer.scrollIntoView({ behavior: 'smooth' });
        });
    }

    if (nextBtn) nextBtn.addEventListener('click', () => { nextSlide(); resetAutoPlay(); });
    if (prevBtn) prevBtn.addEventListener('click', () => { prevSlide(); resetAutoPlay(); });

    // Swipe táctil
    let touchStartX = 0;
    carouselInner.addEventListener('touchstart', e => {
        touchStartX = e.changedTouches[0].screenX;
    }, { passive: true });
    carouselInner.addEventListener('touchend', e => {
        const diff = touchStartX - e.changedTouches[0].screenX;
        if (Math.abs(diff) > 40) { diff > 0 ? nextSlide() : prevSlide(); resetAutoPlay(); }
    }, { passive: true });

    buildDots();
    updateCarousel();
    startAutoPlay();
}

// ─────────────────────────────────────────────
// MENÚ OVERLAY
// ─────────────────────────────────────────────

const menuOverlay = document.getElementById('menu-overlay');
const closeMenuBtn = document.getElementById('close-menu');

const links = {
    director:     document.querySelector('a[href="#director"]'),
    photographers: document.querySelector('a[href="#photographers"]'),
    work:         document.querySelector('a[href="#work"]')
};

const lists = {
    director:     document.getElementById('list-director'),
    photographers: document.getElementById('list-photographers'),
    work:         document.getElementById('list-work')
};

const menuColors = [
    '#FF3B30','#FF9500','#FFCC00','#4CD964',
    '#5AC8FA','#007AFF','#5856D6','#AF52DE',
    '#FF2D55','#A2845E'
];
let lastColorIndex = -1;
let currentCategory = null;

function changeColor() {
    let newIndex;
    do { newIndex = Math.floor(Math.random() * menuColors.length); }
    while (newIndex === lastColorIndex);
    lastColorIndex = newIndex;
    if (menuOverlay) menuOverlay.style.backgroundColor = menuColors[newIndex];
}

function handleMenuClick(e, category) {
    if (e) e.preventDefault();
    if (menuOverlay && menuOverlay.classList.contains('open') && currentCategory === category) {
        closeMenu(); return;
    }
    Object.values(lists).forEach(l => { if (l) l.style.display = 'none'; });
    if (lists[category]) lists[category].style.display = 'block';
    changeColor();
    if (menuOverlay) menuOverlay.classList.add('open');
    currentCategory = category;
}

function closeMenu() {
    if (menuOverlay) {
        menuOverlay.classList.remove('open');
        currentCategory = null;
    }
    const hamburger = document.querySelector('.hamburger');
    if (hamburger) {
        hamburger.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
    }
}

Object.entries(links).forEach(([key, el]) => {
    if (el) el.addEventListener('click', e => handleMenuClick(e, key));
});

if (closeMenuBtn) closeMenuBtn.addEventListener('click', closeMenu);

document.addEventListener('click', e => {
    if (!menuOverlay || !menuOverlay.classList.contains('open')) return;
    const clickedLink = Object.values(links).includes(e.target);
    const hamburger = document.querySelector('.hamburger');
    if (!menuOverlay.contains(e.target) && !clickedLink && e.target !== hamburger) closeMenu();
});


// ─────────────────────────────────────────────
// HAMBURGER (móvil)
// ─────────────────────────────────────────────

const hamburger = document.querySelector('.hamburger');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        const isOpen = menuOverlay && menuOverlay.classList.contains('open');
        if (isOpen) {
            closeMenu();
        } else {
            Object.values(lists).forEach(l => { if (l) l.style.display = 'block'; });
            changeColor();
            if (menuOverlay) menuOverlay.classList.add('open');
            hamburger.classList.add('open');
            hamburger.setAttribute('aria-expanded', 'true');
            currentCategory = 'all';
        }
    });
}

// Escape cierra menú
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeMenu();
});