// Auto Scroll Image Slider
// 1. Perbaikan Infinite Scroll (Auto Slider Atas)
const imageSlider = document.getElementById('imageSlider');
if (imageSlider) {
    const slides = imageSlider.children;
    const total = slides.length;
    // Kloning semua elemen untuk memastikan animasi mulus
    for(let i=0; i<total; i++) {
        const clone = slides[i].cloneNode(true);
        imageSlider.appendChild(clone);
    }
}

// Characters Slider dengan Controls
const charactersSlider = document.getElementById('charactersSlider');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const dotsContainer = document.getElementById('sliderDots');

let currentSlide = 0;
const cards = document.querySelectorAll('.character-card');
const totalSlides = cards.length;

// Create dots
function createDots() {
    for (let i = 0; i < totalSlides; i++) {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (i === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(i));
        dotsContainer.appendChild(dot);
    }
}

// Update dots
function updateDots() {
    const dots = document.querySelectorAll('.dot');
    dots.forEach((dot, index) => {
        dot.classList.toggle('active', index === currentSlide);
    });
}

// Go to specific slide
function goToSlide(slideIndex) {
    if(!charactersSlider) return;
    currentSlide = slideIndex;
    const cardWidth = cards[0].offsetWidth + 32; // 32 adalah gap 2rem
    
    charactersSlider.scrollTo({
        left: cardWidth * currentSlide,
        behavior: 'smooth'
    });
    updateDots();
}


// Next slide
function nextSlide() {
    currentSlide = (currentSlide + 1) % totalSlides;
    goToSlide(currentSlide);
}

// Previous slide
function prevSlide() {
    currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
    goToSlide(currentSlide);
}

// Event listeners for buttons
if (prevBtn) prevBtn.addEventListener('click', prevSlide);
if (nextBtn) nextBtn.addEventListener('click', nextSlide);

// Initialize dots
if (dotsContainer) createDots();

// Auto slide every 5 seconds
let autoSlideInterval = setInterval(nextSlide, 5000);

// Pause auto slide on hover
if (charactersSlider) {
    charactersSlider.addEventListener('mouseenter', () => {
        clearInterval(autoSlideInterval);
    });

    charactersSlider.addEventListener('mouseleave', () => {
        autoSlideInterval = setInterval(nextSlide, 5000);
    });
}

// Smooth scroll on scroll event
let isScrolling;
charactersSlider?.addEventListener('scroll', () => {
    window.clearTimeout(isScrolling);
    isScrolling = setTimeout(() => {
        const cardWidth = cards[0].offsetWidth + 32;
        currentSlide = Math.round(charactersSlider.scrollLeft / cardWidth);
        updateDots();
    }, 100);
});

// Parallax Effect on Scroll
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const heroImage = document.querySelector('.hero-image');
    if (heroImage) {
        // Gunakan requestAnimationFrame untuk performa 60fps
        window.requestAnimationFrame(() => {
            heroImage.style.transform = `translateY(${scrolled * 0.15}px)`;
        });
    }
});

// Intersection Observer for Fade In Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('.characters-section, .gallery-section').forEach(section => {
    section.style.opacity = '0';
    section.style.transform = 'translateY(50px)';
    section.style.transition = 'all 0.8s ease';
    observer.observe(section);
});

// Gallery Item Animations
const galleryItems = document.querySelectorAll('.gallery-item');
galleryItems.forEach((item, index) => {
    item.style.opacity = '0';
    item.style.transform = 'scale(0.9)';
    item.style.transition = `all 0.5s ease ${index * 0.1}s`;
    
    const galleryObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'scale(1)';
            }
        });
    }, observerOptions);
    
    galleryObserver.observe(item);
});

// Smooth scroll for all links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Add mouse move effect on hero
const hero = document.querySelector('.hero');
if (hero) {
    hero.addEventListener('mousemove', (e) => {
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        const heroImage = document.querySelector('.hero-image');
        if (heroImage) {
            heroImage.style.transform = `translate(${mouseX * 20}px, ${mouseY * 20}px)`;
        }
    });
}

// Keyboard navigation for character slider
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        prevSlide();
    } else if (e.key === 'ArrowRight') {
        nextSlide();
    }
});

// Touch swipe for mobile
let touchStartX = 0;
let touchEndX = 0;

if (charactersSlider) {
    charactersSlider.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    charactersSlider.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
}

function handleSwipe() {
    if (touchEndX < touchStartX - 50) {
        nextSlide();
    }
    if (touchEndX > touchStartX + 50) {
        prevSlide();
    }
}

// Loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    document.body.style.transition = 'opacity 0.5s ease';
    setTimeout(() => {
        document.body.style.opacity = '1';
    }, 100);
});

// Add cursor trail effect (optional, modern effect)
const createCursorTrail = () => {
    const trail = document.createElement('div');
    trail.className = 'cursor-trail';
    trail.style.cssText = `
        position: fixed;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background: radial-gradient(circle, rgba(94, 236, 255, 0.8), transparent);
        pointer-events: none;
        z-index: 9999;
        transition: transform 0.1s ease;
    `;
    document.body.appendChild(trail);
    return trail;
};

let trails = [];
for (let i = 0; i < 5; i++) {
    trails.push(createCursorTrail());
}

document.addEventListener('mousemove', (e) => {
    trails.forEach((trail, index) => {
        setTimeout(() => {
            trail.style.left = e.clientX - 5 + 'px';
            trail.style.top = e.clientY - 5 + 'px';
            trail.style.transform = `scale(${1 - index * 0.2})`;
            trail.style.opacity = 1 - index * 0.2;
        }, index * 50);
    });
});

console.log('🚀 Website loaded successfully!');
console.log('✨ All animations are active');
console.log('⌨️  Use Arrow Keys to navigate character slider');

// ===== PROFIL IDENTITAS TOGGLE =====
const identityToggle = document.getElementById('identityToggle');
const identityCards  = document.getElementById('identityCards');
const identityBlock  = identityToggle?.closest('.identity-block');

if (identityToggle && identityCards) {
    identityToggle.addEventListener('click', function () {
        const isOpen = identityCards.classList.contains('open');

        identityCards.classList.toggle('open');
        identityToggle.classList.toggle('active');
        identityToggle.setAttribute('aria-expanded', String(!isOpen));
        identityBlock?.classList.toggle('revealed');
    });

    // Ripple effect on toggle button
    identityToggle.addEventListener('mousemove', (e) => {
        const rect = identityToggle.getBoundingClientRect();
        const x = ((e.clientX - rect.left) / rect.width) * 100;
        const y = ((e.clientY - rect.top) / rect.height) * 100;
        identityToggle.style.setProperty('--x', x + '%');
        identityToggle.style.setProperty('--y', y + '%');
    });
}
// ===== END IDENTITY TOGGLE =====