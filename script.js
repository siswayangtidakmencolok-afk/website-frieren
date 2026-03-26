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
// SPELL COLLECTION — FIXED VERSION
// Ganti seluruh blok spell di script.js dengan ini
// ============================================================

(function initSpells() {
    const cards       = document.querySelectorAll('.spell-card');
    const filterBtns  = document.querySelectorAll('.sf-btn');
    const unlockedEl  = document.getElementById('unlockedCount');
    const totalEl     = document.getElementById('totalCount');
    const fillEl      = document.getElementById('counterFill');

    if (!cards.length) {
        console.warn('[Spells] Tidak ada .spell-card ditemukan di DOM');
        return;
    }

    console.log('[Spells] Ditemukan', cards.length, 'kartu mantra');

    const total = cards.length;
    if (totalEl) totalEl.textContent = total;

    // ── Flip on click ──
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('unlocked');
            card.dataset.unlocked = card.classList.contains('unlocked') ? 'true' : 'false';

            if (card.classList.contains('unlocked')) {
                spawnBurst(card);
            }
            updateCounter();
        });
    });

    function updateCounter() {
        const count = document.querySelectorAll('.spell-card.unlocked:not([style*="display: none"])').length;
        if (unlockedEl) unlockedEl.textContent = document.querySelectorAll('.spell-card.unlocked').length;
        const all = document.querySelectorAll('.spell-card').length;
        if (fillEl) fillEl.style.width = (document.querySelectorAll('.spell-card.unlocked').length / all * 100) + '%';
    }

    // ── Filter — FIXED: hanya pakai display none/block, tidak ada class hidden ──
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filter = btn.dataset.filter;
            cards.forEach(card => {
                const match = filter === 'all' || card.dataset.rarity === filter;
                card.style.display = match ? '' : 'none';
            });
        });
    });

    // ── Burst effect on unlock ──
    function spawnBurst(card) {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width / 2;
        const cy    = rect.top  + rect.height / 2;

        // Ambil warna dari CSS variable
        const backEl = card.querySelector('.sc-back');
        const raw    = backEl ? backEl.style.getPropertyValue('--spell-color') : '';
        const color  = raw.trim() || '#5eecff';

        for (let i = 0; i < 12; i++) {
            const dot    = document.createElement('div');
            const angle  = (i / 12) * Math.PI * 2;
            const radius = 60 + Math.random() * 40;
            const dx     = Math.cos(angle) * radius;
            const dy     = Math.sin(angle) * radius;

            dot.style.cssText = `
                position:fixed;
                left:${cx}px;top:${cy}px;
                width:6px;height:6px;
                border-radius:50%;
                background:${color};
                pointer-events:none;
                z-index:9999;
                transform:translate(-50%,-50%);
                transition:transform 0.6s ease,opacity 0.6s ease;
                box-shadow:0 0 8px ${color};
            `;
            document.body.appendChild(dot);

            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    dot.style.transform = `translate(calc(-50% + ${dx}px),calc(-50% + ${dy}px)) scale(0)`;
                    dot.style.opacity   = '0';
                });
            });
            setTimeout(() => dot.remove(), 700);
        }
    }

    // ── Scroll reveal — FIXED: pakai class bukan inline opacity ──
    const spellObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('spell-visible');
                spellObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08 });

    cards.forEach((card, i) => {
        card.style.transitionDelay = (i * 0.07) + 's';
        spellObserver.observe(card);
    });

})();

// ============================================================
// ELECTRIC BORDER — Vanilla JS Port dari React component
// Credit: @BalintFerenczy | codepen.io/BalintFerenczy/pen/KwdoyEN
// Tambah di paling bawah script.js
// ============================================================

// ──────────────────────────────────────────────────────────────
// CONFIG — ISI URL KARAKTER DI SINI
// Kalau karakter belum punya halaman, isi '#' atau biarkan ''
// ──────────────────────────────────────────────────────────────
const CHAR_URLS = {
    frieren : '#',          // ganti dengan URL halaman Frieren
    himmel  : '#',          // ganti dengan URL halaman Himmel
    fern    : '#',          // ganti dengan URL halaman Fern
    ubel    : '#',          // ganti dengan URL halaman Ubel
};

// Warna electric per karakter (hex)
const CHAR_ELECTRIC_COLORS = {
    frieren : '#5eecff',
    himmel  : '#fbbf24',
    fern    : '#a78bfa',
    ubel    : '#f87171',
};

// ──────────────────────────────────────────────────────────────
// ELECTRIC BORDER CLASS — konversi langsung dari React
// ──────────────────────────────────────────────────────────────
class ElectricBorder {
    constructor(element, options = {}) {
        this.el       = element;
        this.color    = options.color      || '#5eecff';
        this.speed    = options.speed      || 1;
        this.chaos    = options.chaos      || 0.12;
        this.radius   = options.radius     || 18;
        this.raf      = null;
        this.time     = 0;
        this.lastTime = 0;

        // Canvas config constants (sama persis dengan React versi)
        this.octaves      = 10;
        this.lacunarity   = 1.6;
        this.gain         = 0.7;
        this.frequency    = 10;
        this.displacement = 60;
        this.borderOffset = 60;

        this._build();
        this._observe();
        this._start();
    }

    // Noise helpers — port langsung dari JS
    _random(x) {
        return ((Math.sin(x * 12.9898) * 43758.5453) % 1 + 1) % 1;
    }

    _noise2D(x, y) {
        const i  = Math.floor(x), j  = Math.floor(y);
        const fx = x - i,         fy = y - j;
        const a  = this._random(i +     j * 57);
        const b  = this._random(i + 1 + j * 57);
        const c  = this._random(i +     (j + 1) * 57);
        const d  = this._random(i + 1 + (j + 1) * 57);
        const ux = fx * fx * (3 - 2 * fx);
        const uy = fy * fy * (3 - 2 * fy);
        return a*(1-ux)*(1-uy) + b*ux*(1-uy) + c*(1-ux)*uy + d*ux*uy;
    }

    _octavedNoise(x, time, seed) {
        let y = 0, amp = this.chaos, freq = this.frequency;
        for (let i = 0; i < this.octaves; i++) {
            const a = i === 0 ? amp * 0 : amp;   // baseFlatness=0
            y    += a * this._noise2D(freq * x + seed * 100, time * freq * 0.3);
            freq *= this.lacunarity;
            amp  *= this.gain;
        }
        return y;
    }

    _cornerPt(cx, cy, r, startAngle, arcLen, progress) {
        const angle = startAngle + progress * arcLen;
        return { x: cx + r * Math.cos(angle), y: cy + r * Math.sin(angle) };
    }

    _rectPoint(t, left, top, w, h, r) {
        const sw = w - 2*r, sh = h - 2*r;
        const ca = (Math.PI * r) / 2;
        const total = 2*sw + 2*sh + 4*ca;
        let d = t * total, acc = 0;

        if (d <= acc + sw) return { x: left + r + (d/sw)*sw, y: top };
        acc += sw;
        if (d <= acc + ca) return this._cornerPt(left+w-r, top+r,   r, -Math.PI/2, Math.PI/2, (d-acc)/ca);
        acc += ca;
        if (d <= acc + sh) return { x: left+w, y: top+r+((d-acc)/sh)*sh };
        acc += sh;
        if (d <= acc + ca) return this._cornerPt(left+w-r, top+h-r, r, 0,          Math.PI/2, (d-acc)/ca);
        acc += ca;
        if (d <= acc + sw) return { x: left+w-r-((d-acc)/sw)*sw, y: top+h };
        acc += sw;
        if (d <= acc + ca) return this._cornerPt(left+r,   top+h-r, r, Math.PI/2,  Math.PI/2, (d-acc)/ca);
        acc += ca;
        if (d <= acc + sh) return { x: left, y: top+h-r-((d-acc)/sh)*sh };
        acc += sh;
        return this._cornerPt(left+r, top+r, r, Math.PI, Math.PI/2, (d-acc)/ca);
    }

    _build() {
        // Wrapper styling
        this.el.style.position = 'relative';
        this.el.style.isolation = 'isolate';
        this.el.style.overflow = 'visible';

        // Canvas
        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position:absolute;
            top:50%; left:50%;
            transform:translate(-50%,-50%);
            pointer-events:none;
            z-index:2;
            display:block;
        `;
        this.el.appendChild(this.canvas);

        // Glow layers
        this.glowWrap = document.createElement('div');
        this.glowWrap.style.cssText = `
            position:absolute; inset:0;
            border-radius:inherit;
            pointer-events:none; z-index:0;
        `;

        const glow1 = document.createElement('div');
        glow1.style.cssText = `
            position:absolute; inset:0; border-radius:inherit;
            border:2px solid ${this.color}99;
            filter:blur(1px);
        `;

        const glow2 = document.createElement('div');
        glow2.style.cssText = `
            position:absolute; inset:0; border-radius:inherit;
            border:2px solid ${this.color};
            filter:blur(4px);
        `;

        const bgGlow = document.createElement('div');
        bgGlow.style.cssText = `
            position:absolute; inset:0; border-radius:inherit;
            z-index:-1;
            transform:scale(1.1);
            filter:blur(32px);
            opacity:0.25;
            background:linear-gradient(-30deg, ${this.color}, transparent, ${this.color}88);
        `;

        this.glowWrap.append(glow1, glow2, bgGlow);
        this.el.appendChild(this.glowWrap);

        this.ctx = this.canvas.getContext('2d');
        this._resize();
    }

    _resize() {
        const rect = this.el.getBoundingClientRect();
        const dpr  = Math.min(window.devicePixelRatio || 1, 2);
        const boff = this.borderOffset;
        const w    = rect.width  + boff * 2;
        const h    = rect.height + boff * 2;

        this.canvas.width  = w * dpr;
        this.canvas.height = h * dpr;
        this.canvas.style.width  = w + 'px';
        this.canvas.style.height = h + 'px';
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this._w = w; this._h = h;
    }

    _observe() {
        this._ro = new ResizeObserver(() => this._resize());
        this._ro.observe(this.el);
    }

    _draw(now) {
        const dt = (now - this.lastTime) / 1000;
        this.time    += dt * this.speed;
        this.lastTime = now;

        const ctx  = this.ctx;
        const dpr  = Math.min(window.devicePixelRatio || 1, 2);
        const boff = this.borderOffset;
        const w    = this._w, h = this._h;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.scale(dpr, dpr);

        ctx.strokeStyle = this.color;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        const left  = boff, top = boff;
        const bw    = w - 2*boff, bh = h - 2*boff;
        const maxR  = Math.min(bw, bh) / 2;
        const r     = Math.min(this.radius, maxR);
        const perim = 2*(bw+bh) + 2*Math.PI*r;
        const count = Math.floor(perim / 2);
        const scale = this.displacement;

        ctx.beginPath();
        for (let i = 0; i <= count; i++) {
            const progress = i / count;
            const pt = this._rectPoint(progress, left, top, bw, bh, r);
            const xN = this._octavedNoise(progress * 8, this.time, 0);
            const yN = this._octavedNoise(progress * 8, this.time, 1);
            const x  = pt.x + xN * scale;
            const y  = pt.y + yN * scale;
            i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
        }
        ctx.closePath();
        ctx.stroke();

        this.raf = requestAnimationFrame(t => this._draw(t));
    }

    _start() {
        this.raf = requestAnimationFrame(t => {
            this.lastTime = t;
            this._draw(t);
        });
    }

    destroy() {
        cancelAnimationFrame(this.raf);
        this._ro.disconnect();
        this.canvas.remove();
        this.glowWrap.remove();
    }

    // Update color at runtime
    setColor(c) {
        this.color = c;
        // Update glow divs
        const divs = this.glowWrap.children;
        if (divs[0]) divs[0].style.border = `2px solid ${c}99`;
        if (divs[1]) divs[1].style.border = `2px solid ${c}`;
        if (divs[2]) divs[2].style.background = `linear-gradient(-30deg, ${c}, transparent, ${c}88)`;
    }
}

// ──────────────────────────────────────────────────────────────
// TERAPKAN KE IDENTITY CARDS
// ──────────────────────────────────────────────────────────────
(function applyElectricToIdentityCards() {
    const cards = document.querySelectorAll('.identity-card');
    if (!cards.length) {
        console.warn('[Electric] .identity-card tidak ditemukan');
        return;
    }

    cards.forEach(card => {
        const charKey = card.dataset.char?.toLowerCase();
        const color   = CHAR_ELECTRIC_COLORS[charKey] || '#5eecff';

        // 1. Pasang Electric Border — hanya aktif saat hover
        let eb = null;

        card.addEventListener('mouseenter', () => {
            if (!eb) {
                eb = new ElectricBorder(card, {
                    color  : color,
                    speed  : 0.8,
                    chaos  : 0.14,
                    radius : 18,
                });
            }
        });

        // Lazy: buat electric saat halaman sudah siap (bukan hanya hover)
        // agar efeknya sudah ada saat pertama kali visible
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !eb) {
                    eb = new ElectricBorder(card, {
                        color  : color,
                        speed  : 0.6,
                        chaos  : 0.12,
                        radius : 18,
                    });
                    io.unobserve(card);
                }
            });
        }, { threshold: 0.2 });
        io.observe(card);

        // 2. Buat nama karakter jadi link yang bisa diklik
        const nameEl = card.querySelector('.icard-name');
        if (nameEl && charKey && CHAR_URLS[charKey] !== undefined) {
            const originalText = nameEl.textContent;
            const url = CHAR_URLS[charKey];

            // Ganti isi jadi <a> — styling diatur CSS
            nameEl.innerHTML = `
                <a href="${url || '#'}"
                   class="icard-name-link"
                   target="${url && url !== '#' ? '_blank' : '_self'}"
                   rel="noopener noreferrer"
                   data-char="${charKey}"
                   title="Halaman ${originalText}">
                    ${originalText}
                    <span class="icard-name-arrow">↗</span>
                </a>
            `;

            // Prevent card click buka modal saat klik nama
            nameEl.querySelector('a')?.addEventListener('click', e => {
                e.stopPropagation();
                if (!url || url === '#') e.preventDefault();
            });
        }
    });

    console.log('[Electric] Applied to', cards.length, 'identity cards');
})();

// ──────────────────────────────────────────────────────────────
// HELPER — lo bisa panggil ini dari console untuk update URL
// contoh: setCharUrl('frieren', 'https://example.com/frieren')
// ──────────────────────────────────────────────────────────────
function setCharUrl(charKey, url) {
    CHAR_URLS[charKey] = url;
    const link = document.querySelector(`.icard-name-link[data-char="${charKey}"]`);
    if (link) {
        link.href   = url;
        link.target = url && url !== '#' ? '_blank' : '_self';
        console.log(`[Electric] URL ${charKey} diupdate: ${url}`);
    }
}