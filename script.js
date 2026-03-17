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

// ===== JIKAN API - ANIME INFO MODAL =====
const MAL_ID = 52991; // Frieren: Beyond Journey's End
const JIKAN_URL = `https://api.jikan.moe/v4/anime/${MAL_ID}/full`;

const btnInfoDetail    = document.getElementById('btnInfoDetail');
const animeInfoModal   = document.getElementById('animeInfoModal');
const closeAnimeModal  = document.getElementById('closeAnimeModal');
const animeLoading     = document.getElementById('animeLoading');
const animeModalContent= document.getElementById('animeModalContent');
const animeError       = document.getElementById('animeError');
const animeRetry       = document.getElementById('animeRetry');

let animeDataCache = null;

async function fetchAnimeData() {
    // Pakai cache supaya tidak hit API berulang kali
    if (animeDataCache) {
        renderAnimeModal(animeDataCache);
        return;
    }

    // Reset state
    animeLoading.style.display      = 'flex';
    animeModalContent.style.display = 'none';
    animeError.style.display        = 'none';

    try {
        const res = await fetch(JIKAN_URL);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const json = await res.json();
        animeDataCache = json.data;
        renderAnimeModal(animeDataCache);
    } catch (err) {
        console.error('Jikan API error:', err);
        animeLoading.style.display = 'none';
        animeError.style.display   = 'block';
    }
}

function renderAnimeModal(data) {
    // Poster
    document.getElementById('animeModalImg').src = data.images?.jpg?.large_image_url || '';

    // Badges
    const badges = document.getElementById('animeBadges');
    badges.innerHTML = `
        <span class="badge-status badge-tag">${data.status || 'N/A'}</span>
        <span class="badge-type badge-tag">${data.type || 'N/A'}</span>
        <span class="badge-year badge-tag">${data.year || data.aired?.prop?.from?.year || 'N/A'}</span>
    `;

    // Title
    document.getElementById('animeModalTitle').textContent    = data.title_japanese || data.title;
    document.getElementById('animeModalTitleEn').textContent  = data.title_english || data.title;

    // Stats
    const stats = document.getElementById('animeStats');
    stats.innerHTML = `
        <div class="anime-stat">
            <span class="anime-stat-label">⭐ Score</span>
            <span class="anime-stat-value">${data.score ?? 'N/A'}</span>
        </div>
        <div class="anime-stat">
            <span class="anime-stat-label">📺 Episode</span>
            <span class="anime-stat-value">${data.episodes ?? '?'}</span>
        </div>
        <div class="anime-stat">
            <span class="anime-stat-label">📊 Rank</span>
            <span class="anime-stat-value">#${data.rank ?? 'N/A'}</span>
        </div>
        <div class="anime-stat">
            <span class="anime-stat-label">⏱ Durasi</span>
            <span class="anime-stat-value">${data.duration?.replace(' per ep','') ?? 'N/A'}</span>
        </div>
        <div class="anime-stat">
            <span class="anime-stat-label">🔞 Rating</span>
            <span class="anime-stat-value">${data.rating?.split(' -')[0] ?? 'N/A'}</span>
        </div>
    `;

    // Synopsis — potong kalau terlalu panjang
    const rawSynopsis = data.synopsis || 'Tidak ada sinopsis.';
    const synopsis = rawSynopsis.replace(/\[Written by MAL Rewrite\]/g, '').trim();
    document.getElementById('animeModalSynopsis').textContent = synopsis;

    // Genres
    const genreWrap = document.getElementById('animeGenres');
    const allTags = [
        ...(data.genres || []),
        ...(data.themes || []),
        ...(data.demographics || [])
    ];
    genreWrap.innerHTML = allTags
        .map(g => `<span class="genre-tag">${g.name}</span>`)
        .join('');

    // MAL Link
    document.getElementById('animeMALLink').href = data.url || `https://myanimelist.net/anime/${MAL_ID}`;

    // Show content
    animeLoading.style.display      = 'none';
    animeModalContent.style.display = 'block';
}

// Open modal
function openAnimeModal() {
    animeInfoModal.classList.add('open');
    document.body.style.overflow = 'hidden';
    fetchAnimeData();
}

// Close modal
function closeModal() {
    animeInfoModal.classList.remove('open');
    document.body.style.overflow = '';
}

if (btnInfoDetail)  btnInfoDetail.addEventListener('click', openAnimeModal);
if (closeAnimeModal) closeAnimeModal.addEventListener('click', closeModal);
if (animeRetry)     animeRetry.addEventListener('click', () => {
    animeDataCache = null;
    fetchAnimeData();
});

// Close on overlay click
animeInfoModal?.addEventListener('click', (e) => {
    if (e.target === animeInfoModal) closeModal();
});

// Close on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeModal();
});
// ===== END JIKAN API =====

// ============================================================
// TAMBAH DI PALING BAWAH script.js
// ============================================================

// ── CHARACTER TABS ──
(function initCharTabs() {
    const tabs  = document.querySelectorAll('.char-tab');
    const panels= document.querySelectorAll('.char-panel');
    if (!tabs.length) return;

    function activateTab(charKey) {
        tabs.forEach(t => t.classList.toggle('active', t.dataset.char === charKey));
        panels.forEach(p => {
            const isTarget = p.dataset.panel === charKey;
            p.classList.toggle('active', isTarget);
            if (isTarget) animateBars(p);
        });
    }

    tabs.forEach(tab => {
        tab.addEventListener('click', () => activateTab(tab.dataset.char));
    });

    // Animate bars on first visible panel
    animateBars(document.querySelector('.char-panel.active'));
})();

// ── ANIMATE POWER BARS ──
function animateBars(panel) {
    if (!panel) return;
    // Reset first
    panel.querySelectorAll('.cpb-fill').forEach(fill => {
        fill.classList.remove('animated');
    });
    // Trigger reflow then animate
    requestAnimationFrame(() => {
        setTimeout(() => {
            panel.querySelectorAll('.cpb-fill').forEach((fill, i) => {
                setTimeout(() => fill.classList.add('animated'), i * 80);
            });
        }, 50);
    });
}

// ── TIMELINE SCROLL REVEAL ──
(function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    items.forEach(item => obs.observe(item));
})();

// ============================================================
// SPELL COLLECTION — Tambah di paling bawah script.js
// ============================================================

(function initSpells() {
    const cards       = document.querySelectorAll('.spell-card');
    const filterBtns  = document.querySelectorAll('.sf-btn');
    const unlockedEl  = document.getElementById('unlockedCount');
    const totalEl     = document.getElementById('totalCount');
    const fillEl      = document.getElementById('counterFill');

    if (!cards.length) return;

    const total = cards.length;
    let unlocked = 0;

    if (totalEl) totalEl.textContent = total;

    // ── Flip on click ──
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const wasLocked = card.dataset.unlocked === 'false';
            card.classList.toggle('unlocked');
            card.dataset.unlocked = card.classList.contains('unlocked') ? 'true' : 'false';

            // Count unlocked
            if (wasLocked && card.classList.contains('unlocked')) {
                unlocked++;
                // Tiny particle burst on unlock
                spawnBurst(card);
            } else if (!card.classList.contains('unlocked')) {
                unlocked = Math.max(0, unlocked - 1);
            }

            updateCounter();
        });
    });

    function updateCounter() {
        unlocked = document.querySelectorAll('.spell-card.unlocked').length;
        if (unlockedEl) unlockedEl.textContent = unlocked;
        if (fillEl) fillEl.style.width = (unlocked / total * 100) + '%';
    }

    // ── Filter ──
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.rarity === filter;
                card.classList.toggle('hidden', !match);
                // hidden cards lose absolute positioning via class, reset layout
                if (!match) {
                    card.style.display = 'none';
                } else {
                    card.style.display = '';
                }
            });
        });
    });

    // ── Burst effect on unlock ──
    function spawnBurst(card) {
        const rect   = card.getBoundingClientRect();
        const cx     = rect.left + rect.width / 2;
        const cy     = rect.top  + rect.height / 2;
        const color  = getComputedStyle(card.querySelector('.sc-back'))
                        .getPropertyValue('--spell-color').trim() || '#5eecff';

        for (let i = 0; i < 12; i++) {
            const dot = document.createElement('div');
            const angle  = (i / 12) * Math.PI * 2;
            const radius = 60 + Math.random() * 40;
            const dx = Math.cos(angle) * radius;
            const dy = Math.sin(angle) * radius;

            dot.style.cssText = `
                position: fixed;
                left: ${cx}px;
                top:  ${cy}px;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: ${color};
                pointer-events: none;
                z-index: 9999;
                transform: translate(-50%, -50%);
                transition: transform 0.6s ease, opacity 0.6s ease;
                box-shadow: 0 0 8px ${color};
            `;
            document.body.appendChild(dot);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    dot.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
                    dot.style.opacity   = '0';
                });
            });

            setTimeout(() => dot.remove(), 700);
        }
    }

    // ── Scroll reveal ──
    const spellObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity  = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });

    cards.forEach((card, i) => {
        card.style.opacity   = '0';
        card.style.transform = 'translateY(40px)';
        card.style.transition = `opacity 0.5s ease ${i * 0.07}s, transform 0.5s ease ${i * 0.07}s`;
        spellObserver.observe(card);
    });
})();