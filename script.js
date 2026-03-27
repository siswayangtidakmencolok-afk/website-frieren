
// ============================================================
// FRIEREN WEBSITE — FULL SCRIPT
// Premium Hero Cinematic + All Sections Fixed
// ============================================================

'use strict';

// ──────────────────────────────────────────────────────────────
// 1. CINEMATIC HERO — Parallax + Particle Canvas + Mouse Aura
// ──────────────────────────────────────────────────────────────
(function initCinematicHero() {
    const hero       = document.querySelector('.hero');
    const layerSky   = document.getElementById('heroLayerSky');
    const layerFog   = document.getElementById('heroLayerFog');
    const layerChar  = document.getElementById('heroLayerChar');
    const layerAura  = document.getElementById('heroCharAura');
    const vignette   = document.getElementById('heroVignette');
    const canvas     = document.getElementById('heroCanvas');

    if (!hero) return;

    // ── Mouse parallax ──
    let mouseX = 0.5, mouseY = 0.5;
    let targetX = 0.5, targetY = 0.5;
    let rafId;

    hero.addEventListener('mousemove', (e) => {
        const rect = hero.getBoundingClientRect();
        targetX = (e.clientX - rect.left) / rect.width;
        targetY = (e.clientY - rect.top)  / rect.height;

        // Vignette follow
        if (vignette) {
            vignette.style.setProperty('--mx', (targetX * 100) + '%');
            vignette.style.setProperty('--my', (targetY * 100) + '%');
        }
    });

    hero.addEventListener('mouseleave', () => {
        targetX = 0.5;
        targetY = 0.5;
    });

    function tickParallax() {
        // Lerp smooth
        mouseX += (targetX - mouseX) * 0.06;
        mouseY += (targetY - mouseY) * 0.06;

        const dx = (mouseX - 0.5);
        const dy = (mouseY - 0.5);

        // Sky — slowest, subtle movement
        if (layerSky) {
            layerSky.style.transform = `translate(${dx * -18}px, ${dy * -12}px) scale(1.08)`;
        }

        // Fog — slightly faster
        if (layerFog) {
            layerFog.style.transform = `translate(${dx * -10}px, ${dy * -7}px)`;
        }

        // Character — medium speed, plus subtle scale breathe
        if (layerChar) {
            layerChar.style.transform = `translate(${dx * 14}px, ${dy * 8}px)`;
        }

        // Aura — follows char but with more spread
        if (layerAura) {
            layerAura.style.transform = `translate(${dx * 20}px, ${dy * 14}px)`;
        }

        rafId = requestAnimationFrame(tickParallax);
    }
    rafId = requestAnimationFrame(tickParallax);

    // ── Scroll parallax on top of mouse parallax ──
    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;
        const heroH   = hero.offsetHeight;
        if (scrollY > heroH) return;

        const progress = scrollY / heroH;

        if (layerSky)  layerSky.style.marginTop  = (scrollY * 0.3) + 'px';
        if (layerChar) {
            const charImg = layerChar.querySelector('img');
            if (charImg) charImg.style.marginTop = (scrollY * 0.15) + 'px';
        }
    }, { passive: true });

    // ── Particle canvas ──
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H;
    const particles = [];

    function resizeCanvas() {
        W = canvas.width  = hero.offsetWidth;
        H = canvas.height = hero.offsetHeight;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    // Spawn floating mana particles
    function spawnParticle() {
        return {
            x    : Math.random() * W,
            y    : H + 20,
            vx   : (Math.random() - 0.5) * 0.6,
            vy   : -(0.4 + Math.random() * 1.2),
            r    : 0.6 + Math.random() * 2,
            life : 0,
            maxL : 120 + Math.random() * 180,
            hue  : Math.random() > 0.5 ? 195 : (Math.random() > 0.5 ? 270 : 320),
            sat  : 70 + Math.random() * 30,
        };
    }

    function drawParticles() {
        ctx.clearRect(0, 0, W, H);

        if (particles.length < 60 && Math.random() < 0.4) {
            particles.push(spawnParticle());
        }

        for (let i = particles.length - 1; i >= 0; i--) {
            const p = particles[i];
            p.x   += p.vx;
            p.y   += p.vy;
            p.life++;

            const progress = p.life / p.maxL;
            const alpha    = Math.sin(progress * Math.PI) * 0.55;

            // Glowing circle
            const gradient = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.r * 3);
            gradient.addColorStop(0, `hsla(${p.hue}, ${p.sat}%, 75%, ${alpha})`);
            gradient.addColorStop(1, `hsla(${p.hue}, ${p.sat}%, 75%, 0)`);

            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r * 3, 0, Math.PI * 2);
            ctx.fillStyle = gradient;
            ctx.fill();

            if (p.life >= p.maxL) particles.splice(i, 1);
        }

        requestAnimationFrame(drawParticles);
    }

    drawParticles();

    // ── Breathing aura on character ──
    const charImg = layerChar?.querySelector('img');
    if (charImg) {
        let breatheT = 0;
        function breathe() {
            breatheT += 0.008;
            const scale   = 1 + Math.sin(breatheT) * 0.008;
            const bright  = 0.85 + Math.sin(breatheT * 1.3) * 0.05;
            charImg.style.filter    = `brightness(${bright}) saturate(1.1)`;
            charImg.style.transform = `scale(${scale})`;
            requestAnimationFrame(breathe);
        }
        breathe();
    }

    console.log('[Hero] Cinematic parallax aktif');
})();


// ──────────────────────────────────────────────────────────────
// 2. AUTO SCROLL IMAGE SLIDER (top section)
// ──────────────────────────────────────────────────────────────
(function initImageSlider() {
    const imageSlider = document.getElementById('imageSlider');
    if (!imageSlider) return;

    const slides = Array.from(imageSlider.children);
    const total  = slides.length;

    // Clone for seamless infinite scroll
    for (let i = 0; i < total; i++) {
        const clone = slides[i].cloneNode(true);
        imageSlider.appendChild(clone);
    }
})();


// ──────────────────────────────────────────────────────────────
// 3. CHARACTER CARDS SLIDER (old-style horizontal scroll)
// ──────────────────────────────────────────────────────────────
(function initCharactersSlider() {
    const slider       = document.getElementById('charactersSlider');
    const prevBtn      = document.getElementById('prevBtn');
    const nextBtn      = document.getElementById('nextBtn');
    const dotsContainer= document.getElementById('sliderDots');

    if (!slider) return;

    const cards       = slider.querySelectorAll('.character-card');
    const totalSlides = cards.length;
    let currentSlide  = 0;
    let autoSlide;

    // Create dots
    if (dotsContainer) {
        for (let i = 0; i < totalSlides; i++) {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (i === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(i));
            dotsContainer.appendChild(dot);
        }
    }

    function updateDots() {
        const dots = dotsContainer?.querySelectorAll('.dot') || [];
        dots.forEach((d, i) => d.classList.toggle('active', i === currentSlide));
    }

    function goToSlide(idx) {
        if (!cards.length) return;
        currentSlide = idx;
        const cardWidth = cards[0].offsetWidth + 32;
        slider.scrollTo({ left: cardWidth * idx, behavior: 'smooth' });
        updateDots();
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        goToSlide(currentSlide);
    });

    if (nextBtn) nextBtn.addEventListener('click', () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    });

    autoSlide = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        goToSlide(currentSlide);
    }, 5000);

    slider.addEventListener('mouseenter', () => clearInterval(autoSlide));
    slider.addEventListener('mouseleave', () => {
        autoSlide = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            goToSlide(currentSlide);
        }, 5000);
    });

    // Sync dots on manual scroll
    let scrollTimer;
    slider.addEventListener('scroll', () => {
        clearTimeout(scrollTimer);
        scrollTimer = setTimeout(() => {
            if (!cards.length) return;
            const cardWidth  = cards[0].offsetWidth + 32;
            currentSlide = Math.round(slider.scrollLeft / cardWidth);
            updateDots();
        }, 100);
    });

    // Touch swipe
    let touchStartX = 0;
    slider.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    slider.addEventListener('touchend', (e) => {
        const diff = e.changedTouches[0].screenX - touchStartX;
        if (diff < -50) { currentSlide = (currentSlide + 1) % totalSlides; goToSlide(currentSlide); }
        if (diff >  50) { currentSlide = (currentSlide - 1 + totalSlides) % totalSlides; goToSlide(currentSlide); }
    });
})();


// ──────────────────────────────────────────────────────────────
// 4. SCROLL FADE-IN — global observer
// ──────────────────────────────────────────────────────────────
(function initScrollFade() {
    const targets = document.querySelectorAll('.gallery-item, .gallery-section, .characters-section');

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity   = '1';
                entry.target.style.transform = 'translateY(0) scale(1)';
                obs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.08, rootMargin: '0px 0px -50px 0px' });

    targets.forEach((el, i) => {
        el.style.opacity    = '0';
        el.style.transform  = el.classList.contains('gallery-item') ? 'scale(0.92)' : 'translateY(40px)';
        el.style.transition = `opacity 0.7s ease ${i * 0.06}s, transform 0.7s ease ${i * 0.06}s`;
        obs.observe(el);
    });
})();


// ──────────────────────────────────────────────────────────────
// 5. SMOOTH SCROLL for anchor links
// ──────────────────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
});


// ──────────────────────────────────────────────────────────────
// 6. CURSOR TRAIL (premium sparkle)
// ──────────────────────────────────────────────────────────────
(function initCursorTrail() {
    const TRAIL_COUNT = 8;
    const trails = [];

    for (let i = 0; i < TRAIL_COUNT; i++) {
        const el = document.createElement('div');
        el.style.cssText = `
            position:fixed; pointer-events:none; z-index:9999;
            border-radius:50%; mix-blend-mode:screen;
            background: radial-gradient(circle, rgba(94,236,255,${0.7 - i*0.08}), transparent);
            width:${12 - i}px; height:${12 - i}px;
            transform:translate(-50%,-50%);
            transition: left ${i*55}ms ease, top ${i*55}ms ease;
            will-change: left, top;
        `;
        document.body.appendChild(el);
        trails.push(el);
    }

    document.addEventListener('mousemove', (e) => {
        trails.forEach((el, i) => {
            setTimeout(() => {
                el.style.left = e.clientX + 'px';
                el.style.top  = e.clientY + 'px';
                el.style.opacity = (1 - i / TRAIL_COUNT) * 0.7;
            }, i * 30);
        });
    });
})();


// ──────────────────────────────────────────────────────────────
// 7. PROFIL IDENTITAS TOGGLE
// ──────────────────────────────────────────────────────────────
(function initIdentityToggle() {
    const toggle = document.getElementById('identityToggle');
    const cards  = document.getElementById('identityCards');
    const block  = toggle?.closest('.identity-block');

    if (!toggle || !cards) return;

    toggle.addEventListener('click', () => {
        const isOpen = cards.classList.contains('open');
        cards.classList.toggle('open');
        toggle.classList.toggle('active');
        toggle.setAttribute('aria-expanded', String(!isOpen));
        block?.classList.toggle('revealed');
    });

    // Ripple effect
    toggle.addEventListener('mousemove', (e) => {
        const rect = toggle.getBoundingClientRect();
        toggle.style.setProperty('--x', ((e.clientX - rect.left) / rect.width * 100) + '%');
        toggle.style.setProperty('--y', ((e.clientY - rect.top) / rect.height * 100) + '%');
    });
})();


// ──────────────────────────────────────────────────────────────
// 8. JIKAN API — Anime Info Modal
// ──────────────────────────────────────────────────────────────
(function initAnimeModal() {
    const MAL_ID   = 52991;
    const JIKAN_URL = `https://api.jikan.moe/v4/anime/${MAL_ID}/full`;

    const btnOpen   = document.getElementById('btnInfoDetail');
    const modal     = document.getElementById('animeInfoModal');
    const btnClose  = document.getElementById('closeAnimeModal');
    const loadingEl = document.getElementById('animeLoading');
    const contentEl = document.getElementById('animeModalContent');
    const errorEl   = document.getElementById('animeError');
    const retryBtn  = document.getElementById('animeRetry');

    if (!modal) return;

    let cache = null;

    async function fetchData() {
        if (cache) { render(cache); return; }

        loadingEl.style.display = 'flex';
        contentEl.style.display = 'none';
        errorEl.style.display   = 'none';

        try {
            const res  = await fetch(JIKAN_URL);
            if (!res.ok) throw new Error(`HTTP ${res.status}`);
            const json = await res.json();
            cache      = json.data;
            render(cache);
        } catch (err) {
            console.error('[Jikan]', err);
            loadingEl.style.display = 'none';
            errorEl.style.display   = 'block';
        }
    }

    function render(data) {
        document.getElementById('animeModalImg').src = data.images?.jpg?.large_image_url || '';

        document.getElementById('animeBadges').innerHTML = `
            <span class="badge-status badge-tag">${data.status || 'N/A'}</span>
            <span class="badge-type badge-tag">${data.type || 'N/A'}</span>
            <span class="badge-year badge-tag">${data.year || data.aired?.prop?.from?.year || 'N/A'}</span>
        `;

        document.getElementById('animeModalTitle').textContent   = data.title_japanese || data.title;
        document.getElementById('animeModalTitleEn').textContent = data.title_english  || data.title;

        document.getElementById('animeStats').innerHTML = `
            <div class="anime-stat"><span class="anime-stat-label">⭐ Score</span><span class="anime-stat-value">${data.score ?? 'N/A'}</span></div>
            <div class="anime-stat"><span class="anime-stat-label">📺 Episode</span><span class="anime-stat-value">${data.episodes ?? '?'}</span></div>
            <div class="anime-stat"><span class="anime-stat-label">📊 Rank</span><span class="anime-stat-value">#${data.rank ?? 'N/A'}</span></div>
            <div class="anime-stat"><span class="anime-stat-label">⏱ Durasi</span><span class="anime-stat-value">${data.duration?.replace(' per ep','') ?? 'N/A'}</span></div>
            <div class="anime-stat"><span class="anime-stat-label">🔞 Rating</span><span class="anime-stat-value">${data.rating?.split(' -')[0] ?? 'N/A'}</span></div>
        `;

        const synopsis = (data.synopsis || 'Tidak ada sinopsis.').replace(/\[Written by MAL Rewrite\]/g, '').trim();
        document.getElementById('animeModalSynopsis').textContent = synopsis;

        const allTags = [...(data.genres||[]), ...(data.themes||[]), ...(data.demographics||[])];
        document.getElementById('animeGenres').innerHTML = allTags.map(g => `<span class="genre-tag">${g.name}</span>`).join('');

        document.getElementById('animeMALLink').href = data.url || `https://myanimelist.net/anime/${MAL_ID}`;

        loadingEl.style.display = 'none';
        contentEl.style.display = 'block';
    }

    function openModal() {
        modal.classList.add('open');
        document.body.style.overflow = 'hidden';
        fetchData();
    }

    function closeModal() {
        modal.classList.remove('open');
        document.body.style.overflow = '';
    }

    btnOpen?.addEventListener('click', openModal);
    btnClose?.addEventListener('click', closeModal);
    retryBtn?.addEventListener('click', () => { cache = null; fetchData(); });
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
})();


// ──────────────────────────────────────────────────────────────
// 9. CHARACTER TABS — new premium character showcase
// ──────────────────────────────────────────────────────────────
(function initCharTabs() {
    const tabs   = document.querySelectorAll('.char-tab');
    const panels = document.querySelectorAll('.char-panel');
    if (!tabs.length) return;

    function activateTab(key) {
        tabs.forEach(t  => t.classList.toggle('active', t.dataset.char === key));
        panels.forEach(p => {
            const active = p.dataset.panel === key;
            p.classList.toggle('active', active);
            if (active) {
                // Slight delay to let CSS transition settle
                setTimeout(() => animatePowerBars(p), 80);
            }
        });
    }

    tabs.forEach(tab => tab.addEventListener('click', () => activateTab(tab.dataset.char)));

    // Animate bars on first active panel
    const firstPanel = document.querySelector('.char-panel.active');
    if (firstPanel) setTimeout(() => animatePowerBars(firstPanel), 300);
})();

function animatePowerBars(panel) {
    if (!panel) return;
    const fills = panel.querySelectorAll('.cpb-fill');
    fills.forEach(f => f.classList.remove('animated'));
    requestAnimationFrame(() => {
        requestAnimationFrame(() => {
            fills.forEach((f, i) => setTimeout(() => f.classList.add('animated'), i * 80));
        });
    });
}


// ──────────────────────────────────────────────────────────────
// 10. TIMELINE SCROLL REVEAL
// ──────────────────────────────────────────────────────────────
(function initTimeline() {
    const items = document.querySelectorAll('.tl-item');
    if (!items.length) return;

    const obs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                obs.unobserve(e.target);
            }
        });
    }, { threshold: 0.2, rootMargin: '0px 0px -60px 0px' });

    items.forEach(item => obs.observe(item));
})();


// ──────────────────────────────────────────────────────────────
// 11. SPELL COLLECTION
// ──────────────────────────────────────────────────────────────
(function initSpells() {
    const cards      = document.querySelectorAll('.spell-card');
    const filterBtns = document.querySelectorAll('.sf-btn');
    const unlockedEl = document.getElementById('unlockedCount');
    const totalEl    = document.getElementById('totalCount');
    const fillEl     = document.getElementById('counterFill');

    if (!cards.length) { console.warn('[Spells] No .spell-card found'); return; }

    if (totalEl) totalEl.textContent = cards.length;

    // Flip on click
    cards.forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('unlocked');
            if (card.classList.contains('unlocked')) spawnBurst(card);
            updateCounter();
        });
    });

    function updateCounter() {
        const count = document.querySelectorAll('.spell-card.unlocked').length;
        if (unlockedEl) unlockedEl.textContent = count;
        if (fillEl)     fillEl.style.width = (count / cards.length * 100) + '%';
    }

    // Filter
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            const filter = btn.dataset.filter;
            cards.forEach(card => {
                card.style.display = (filter === 'all' || card.dataset.rarity === filter) ? '' : 'none';
            });
        });
    });

    // Burst particles on unlock
    function spawnBurst(card) {
        const rect  = card.getBoundingClientRect();
        const cx    = rect.left + rect.width  / 2;
        const cy    = rect.top  + rect.height / 2;
        const back  = card.querySelector('.sc-back');
        const color = (back?.style.getPropertyValue('--spell-color') || '#5eecff').trim();

        for (let i = 0; i < 14; i++) {
            const dot    = document.createElement('div');
            const angle  = (i / 14) * Math.PI * 2;
            const radius = 55 + Math.random() * 45;
            const dx     = Math.cos(angle) * radius;
            const dy     = Math.sin(angle) * radius;

            Object.assign(dot.style, {
                position      : 'fixed',
                left          : cx + 'px',
                top           : cy + 'px',
                width         : '6px',
                height        : '6px',
                borderRadius  : '50%',
                background    : color,
                pointerEvents : 'none',
                zIndex        : '9999',
                transform     : 'translate(-50%,-50%)',
                transition    : 'transform 0.65s ease, opacity 0.65s ease',
                boxShadow     : `0 0 10px ${color}`,
            });
            document.body.appendChild(dot);

            requestAnimationFrame(() => requestAnimationFrame(() => {
                dot.style.transform = `translate(calc(-50% + ${dx}px), calc(-50% + ${dy}px)) scale(0)`;
                dot.style.opacity   = '0';
            }));

            setTimeout(() => dot.remove(), 700);
        }
    }

    // Scroll reveal
    const spellObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('spell-visible');
                spellObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.08 });

    cards.forEach((card, i) => {
        card.style.transitionDelay = (i * 0.07) + 's';
        spellObs.observe(card);
    });

    console.log('[Spells] Initialized —', cards.length, 'cards');
})();


// ──────────────────────────────────────────────────────────────
// 12. ELECTRIC BORDER on Identity Cards
// ──────────────────────────────────────────────────────────────
const CHAR_URLS = {
    frieren : '#',
    himmel  : '#',
    fern    : '#',
    ubel    : '#',
};

const CHAR_ELECTRIC_COLORS = {
    frieren : '#5eecff',
    himmel  : '#fbbf24',
    fern    : '#a78bfa',
    ubel    : '#f87171',
};

class ElectricBorder {
    constructor(element, options = {}) {
        this.el       = element;
        this.color    = options.color  || '#5eecff';
        this.speed    = options.speed  || 1;
        this.chaos    = options.chaos  || 0.12;
        this.radius   = options.radius || 18;
        this.time     = 0;
        this.lastTime = 0;
        this.raf      = null;

        // Constants
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

    _random(x) { return ((Math.sin(x * 12.9898) * 43758.5453) % 1 + 1) % 1; }

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
            const a = i === 0 ? 0 : amp;
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
        this.el.style.position  = 'relative';
        this.el.style.isolation = 'isolate';
        this.el.style.overflow  = 'visible';

        this.canvas = document.createElement('canvas');
        this.canvas.style.cssText = `
            position:absolute; top:50%; left:50%;
            transform:translate(-50%,-50%);
            pointer-events:none; z-index:2; display:block;
        `;
        this.el.appendChild(this.canvas);

        this.glowWrap = document.createElement('div');
        this.glowWrap.style.cssText = `position:absolute;inset:0;border-radius:inherit;pointer-events:none;z-index:0;`;

        const g1 = document.createElement('div');
        g1.style.cssText = `position:absolute;inset:0;border-radius:inherit;border:2px solid ${this.color}99;filter:blur(1px);`;
        const g2 = document.createElement('div');
        g2.style.cssText = `position:absolute;inset:0;border-radius:inherit;border:2px solid ${this.color};filter:blur(4px);`;
        const bg = document.createElement('div');
        bg.style.cssText = `position:absolute;inset:0;border-radius:inherit;z-index:-1;transform:scale(1.1);filter:blur(32px);opacity:0.25;background:linear-gradient(-30deg,${this.color},transparent,${this.color}88);`;

        this.glowWrap.append(g1, g2, bg);
        this.el.appendChild(this.glowWrap);
        this.ctx = this.canvas.getContext('2d');
        this._resize();
    }

    _resize() {
        const rect = this.el.getBoundingClientRect();
        const dpr  = Math.min(window.devicePixelRatio || 1, 2);
        const bo   = this.borderOffset;
        const w    = rect.width  + bo * 2;
        const h    = rect.height + bo * 2;
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
        const bo   = this.borderOffset;
        const w = this._w, h = this._h;

        ctx.setTransform(1, 0, 0, 1, 0, 0);
        ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        ctx.scale(dpr, dpr);

        ctx.strokeStyle = this.color;
        ctx.lineWidth   = 1.5;
        ctx.lineCap     = 'round';
        ctx.lineJoin    = 'round';

        const left = bo, top = bo;
        const bw   = w - 2*bo, bh = h - 2*bo;
        const maxR = Math.min(bw, bh) / 2;
        const r    = Math.min(this.radius, maxR);
        const perim = 2*(bw+bh) + 2*Math.PI*r;
        const count = Math.floor(perim / 2);
        const scale = this.displacement;

        ctx.beginPath();
        for (let i = 0; i <= count; i++) {
            const prog = i / count;
            const pt   = this._rectPoint(prog, left, top, bw, bh, r);
            const xN   = this._octavedNoise(prog * 8, this.time, 0);
            const yN   = this._octavedNoise(prog * 8, this.time, 1);
            i === 0 ? ctx.moveTo(pt.x + xN*scale, pt.y + yN*scale)
                    : ctx.lineTo(pt.x + xN*scale, pt.y + yN*scale);
        }
        ctx.closePath();
        ctx.stroke();

        this.raf = requestAnimationFrame(t => this._draw(t));
    }

    _start() {
        this.raf = requestAnimationFrame(t => { this.lastTime = t; this._draw(t); });
    }

    destroy() {
        cancelAnimationFrame(this.raf);
        this._ro.disconnect();
        this.canvas.remove();
        this.glowWrap.remove();
    }

    setColor(c) {
        this.color = c;
        const divs = this.glowWrap.children;
        if (divs[0]) divs[0].style.border     = `2px solid ${c}99`;
        if (divs[1]) divs[1].style.border     = `2px solid ${c}`;
        if (divs[2]) divs[2].style.background = `linear-gradient(-30deg,${c},transparent,${c}88)`;
    }
}

(function applyElectricBorders() {
    const cards = document.querySelectorAll('.identity-card');
    if (!cards.length) return;

    cards.forEach(card => {
        const charKey = card.dataset.char?.toLowerCase();
        const color   = CHAR_ELECTRIC_COLORS[charKey] || '#5eecff';
        let eb = null;

        // Lazy init via IntersectionObserver
        const io = new IntersectionObserver((entries) => {
            entries.forEach(e => {
                if (e.isIntersecting && !eb) {
                    eb = new ElectricBorder(card, { color, speed: 0.6, chaos: 0.12, radius: 18 });
                    io.unobserve(card);
                }
            });
        }, { threshold: 0.2 });
        io.observe(card);

        // Name as link
        const nameEl = card.querySelector('.icard-name');
        if (nameEl && charKey && CHAR_URLS[charKey] !== undefined) {
            const txt = nameEl.textContent;
            const url = CHAR_URLS[charKey];
            nameEl.innerHTML = `
                <a href="${url || '#'}" class="icard-name-link"
                   target="${url && url !== '#' ? '_blank' : '_self'}"
                   rel="noopener noreferrer" data-char="${charKey}"
                   title="Halaman ${txt}">
                    ${txt}<span class="icard-name-arrow">↗</span>
                </a>`;
            nameEl.querySelector('a')?.addEventListener('click', e => {
                e.stopPropagation();
                if (!url || url === '#') e.preventDefault();
            });
        }
    });

    console.log('[Electric] Applied to', cards.length, 'identity cards');
})();

// Helper — callable from console
function setCharUrl(key, url) {
    CHAR_URLS[key] = url;
    const link = document.querySelector(`.icard-name-link[data-char="${key}"]`);
    if (link) { link.href = url; link.target = url && url !== '#' ? '_blank' : '_self'; }
}


// ──────────────────────────────────────────────────────────────
// 13. TYPING QUOTE SECTION
// ──────────────────────────────────────────────────────────────
const QUOTES = [
    {
        char: 'frieren', name: 'Frieren', role: 'Penyihir Elf · Kelompok Pahlawan',
        img: 'images/character-frieren.png', color: '#5eecff',
        text: 'Aku baru menyadari... aku tidak pernah benar-benar mengenalnya. Dan sekarang sudah terlambat untuk itu.',
        context: 'Episode 1 · Pemakaman Himmel',
        reflect: 'Satu kalimat yang menggambarkan seluruh inti cerita Frieren — tentang waktu yang berlalu dan penyesalan yang datang terlambat. Bagi elf yang sudah ribuan tahun hidup, sepuluh tahun bersama terasa seperti sekejap. Tapi kematian Himmel membuktikan: panjangnya waktu tidak ada artinya kalau tidak pernah diisi dengan sungguh-sungguh.',
    },
    {
        char: 'himmel', name: 'Himmel', role: 'Pahlawan · Pemimpin Kelompok',
        img: 'images/character-himmel.png', color: '#fbbf24',
        text: 'Apakah perlu alasan untuk menolong seseorang? Aku hanya melakukan apa yang memang harus dilakukan.',
        context: 'Sepanjang perjalanan · Filosofi Himmel',
        reflect: 'Himmel tidak pernah menolong karena ingin dikenang. Ia menolong karena menurutnya itu yang benar. Patungnya ada di seluruh dunia bukan karena ia minta, melainkan karena orang-orang yang ia selamatkan tidak punya cara lain untuk berterima kasih.',
    },
    {
        char: 'frieren', name: 'Frieren', role: 'Penyihir Elf · Kelompok Pahlawan',
        img: 'images/character-frieren.png', color: '#5eecff',
        text: 'Manusia memang makhluk yang aneh. Hanya hidup sebentar, tapi bisa meninggalkan kenangan yang bertahan berabad-abad.',
        context: 'Sepanjang seri · Refleksi Frieren',
        reflect: 'Di sinilah ironi terbesar Frieren — ia yang abadi justru belajar tentang makna hidup dari mereka yang hidupnya paling singkat. Himmel, Heiter, Eisen... mereka sudah tiada, tapi jejak mereka masih membawa Frieren berjalan.',
    },
    {
        char: 'heiter', name: 'Heiter', role: 'Pendeta Agung · Kelompok Pahlawan',
        img: 'images/character-heiter.png', color: '#facc15',
        text: 'Frieren... tolong jaga Fern. Itu satu-satunya permintaanku.',
        context: 'Pertemuan terakhir · Permintaan Heiter',
        reflect: 'Kata-kata terakhir dari seseorang yang tahu dirinya tidak punya banyak waktu lagi. Heiter tidak meminta banyak — hanya satu hal. Dan Frieren menerimanya tanpa ragu, tanpa kata-kata berlebihan. Itulah cara mereka menghormati satu sama lain.',
    },
    {
        char: 'fern', name: 'Fern', role: 'Penyihir · Murid Frieren',
        img: 'images/character-fern.png', color: '#a78bfa',
        text: 'Guru tidak pernah bertanya apakah aku baik-baik saja. Tapi saat aku benar-benar membutuhkan, ia selalu ada.',
        context: 'Refleksi Fern · Tentang Frieren',
        reflect: 'Hubungan Frieren dan Fern tidak dibangun dengan kata-kata hangat atau perhatian yang ditunjukkan secara eksplisit. Ia dibangun lewat kehadiran yang konsisten — dan bagi Fern yang kehilangan segalanya, kehadiran itu lebih dari cukup.',
    },
    {
        char: 'stark', name: 'Stark', role: 'Pejuang · Murid Eisen',
        img: 'images/character-stark.png', color: '#f97316',
        text: 'Aku bukan pemberani. Aku hanya tidak bisa berdiam diri saat orang yang penting bagiku dalam bahaya.',
        context: 'Mid-series · Pengakuan Stark',
        reflect: 'Stark selalu menganggap dirinya penakut. Tapi tubuhnya bergerak duluan setiap kali seseorang yang ia cintai terancam. Mungkin itu definisi keberanian yang sebenarnya — bukan tanpa rasa takut, tapi bertindak meski takut.',
    },
    {
        char: 'serie', name: 'Serie', role: 'Penyihir Terkuat · Guru Frieren',
        img: 'images/character-serie.png', color: '#ec4899',
        text: 'Sihir bukanlah tentang kekuatan. Ia tentang seberapa dalam kamu memahami dunia di sekitarmu.',
        context: 'Filosofi Sihir · Dunia Frieren',
        reflect: 'Serie, penyihir tertua yang masih hidup, memandang sihir bukan sebagai senjata melainkan sebagai pemahaman. Frieren yang telah hidup ribuan tahun pun masih terus belajar — dan itulah yang membuatnya berbeda dari penyihir biasa.',
    },
];

// Quote particles
function initQuoteParticles() {
    const canvas = document.getElementById('quoteParticles');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let W, H, particles = [];

    function resize() {
        const section = canvas.closest('.quote-section');
        if (!section) return;
        const r = section.getBoundingClientRect();
        W = canvas.width  = r.width;
        H = canvas.height = r.height;
    }

    new ResizeObserver(resize).observe(canvas.closest('.quote-section') || document.body);
    resize();

    function spawn() {
        return {
            x: Math.random() * W, y: H + 20,
            vx: (Math.random() - 0.5) * 0.4,
            vy: -(0.3 + Math.random() * 0.6),
            r: 0.8 + Math.random() * 1.8,
            life: 0, maxL: 200 + Math.random() * 200,
            hue: Math.random() > 0.6 ? 195 : (Math.random() > 0.5 ? 270 : 195),
        };
    }

    (function loop() {
        ctx.clearRect(0, 0, W, H);
        if (particles.length < 55 && Math.random() < 0.35) particles.push(spawn());
        particles = particles.filter(p => {
            p.x += p.vx; p.y += p.vy; p.life++;
            const alpha = Math.sin((p.life / p.maxL) * Math.PI) * 0.45;
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
            ctx.fillStyle = `hsla(${p.hue}, 80%, 72%, ${alpha})`;
            ctx.fill();
            return p.life < p.maxL && p.y > -20;
        });
        requestAnimationFrame(loop);
    })();
}

// Typing engine
(function initQuoteTyping() {
    const stage     = document.getElementById('quoteStage');
    const typedEl   = document.getElementById('qtTyped');
    const cursorEl  = document.getElementById('qtCursor');
    const reflectEl = document.getElementById('quoteReflection');
    const charImgEl = document.getElementById('quoteCharImg');
    const fallbackEl= document.getElementById('qcaFallback');
    const charNameEl= document.getElementById('quoteCharName');
    const charRoleEl= document.getElementById('quoteCharRole');
    const contextEl = document.getElementById('quoteContext');
    const dotsEl    = document.getElementById('quoteDots');
    const prevBtn   = document.getElementById('quotePrev');
    const nextBtn   = document.getElementById('quoteNext');
    const replayBtn = document.getElementById('quoteReplay');
    const currNumEl = document.getElementById('quoteCurrentNum');
    const totalNumEl= document.getElementById('quoteTotalNum');

    if (!stage || !typedEl) return;

    let idx = 0;
    let typingTimer = null;

    if (totalNumEl) totalNumEl.textContent = String(QUOTES.length).padStart(2, '0');

    // Build dots
    if (dotsEl) {
        QUOTES.forEach((_, i) => {
            const d = document.createElement('button');
            d.className = 'qdot' + (i === 0 ? ' active' : '');
            d.setAttribute('aria-label', `Quote ${i + 1}`);
            d.addEventListener('click', () => goTo(i));
            dotsEl.appendChild(d);
        });
    }

    function updateDots() {
        document.querySelectorAll('.qdot').forEach((d, i) => d.classList.toggle('active', i === idx));
        if (prevBtn) prevBtn.disabled = idx === 0;
        if (nextBtn) nextBtn.disabled = idx === QUOTES.length - 1;
    }

    function render(q) {
        clearTimeout(typingTimer);

        // Glow class
        const glows = ['glow-frieren','glow-himmel','glow-fern','glow-heiter','glow-stark','glow-eisen','glow-serie'];
        stage.classList.remove(...glows);
        stage.classList.add('glow-' + q.char);

        if (charImgEl) charImgEl.src = q.img;
        if (fallbackEl) fallbackEl.textContent = q.name.charAt(0);
        if (charNameEl) charNameEl.textContent = q.name;
        if (charRoleEl) charRoleEl.textContent = q.role;
        if (contextEl)  contextEl.textContent  = q.context;
        if (currNumEl)  currNumEl.textContent  = String(idx + 1).padStart(2, '0');
        if (cursorEl)   cursorEl.style.color   = q.color;
        if (reflectEl)  { reflectEl.textContent = q.reflect; reflectEl.classList.remove('visible'); }
        if (typedEl)    typedEl.textContent = '';

        typeText(q.text, 0, q);
        updateDots();
    }

    function typeText(text, i, q) {
        if (i > text.length) {
            setTimeout(() => reflectEl?.classList.add('visible'), 600);
            return;
        }
        if (typedEl) typedEl.textContent = text.slice(0, i);
        const ch = text[i - 1] || '';
        let delay = 36 + Math.random() * 20;
        if (ch === ',' || ch === '—') delay = 200;
        if (ch === '.' || ch === '?' || ch === '!') delay = 380;
        typingTimer = setTimeout(() => typeText(text, i + 1, q), delay);
    }

    function goTo(newIdx, animate = true) {
        if (newIdx < 0 || newIdx >= QUOTES.length) return;
        if (animate) {
            stage.style.transition = 'opacity 0.25s ease, transform 0.25s ease';
            stage.style.opacity    = '0';
            stage.style.transform  = 'translateY(12px)';
            setTimeout(() => {
                idx = newIdx;
                render(QUOTES[idx]);
                stage.style.opacity   = '1';
                stage.style.transform = 'translateY(0)';
            }, 260);
        } else {
            idx = newIdx;
            render(QUOTES[idx]);
        }
    }

    if (prevBtn)   prevBtn.addEventListener('click', () => goTo(idx - 1));
    if (nextBtn)   nextBtn.addEventListener('click', () => goTo(idx + 1));
    if (replayBtn) replayBtn.addEventListener('click', () => {
        clearTimeout(typingTimer);
        if (typedEl)    typedEl.textContent = '';
        if (reflectEl)  reflectEl.classList.remove('visible');
        typeText(QUOTES[idx].text, 0, QUOTES[idx]);
    });

    // Auto-advance
    let autoTimer;
    function scheduleAuto() {
        clearTimeout(autoTimer);
        autoTimer = setTimeout(() => {
            if (idx < QUOTES.length - 1) { goTo(idx + 1); scheduleAuto(); }
        }, 12000);
    }

    stage.addEventListener('mouseenter', () => clearTimeout(autoTimer));
    stage.addEventListener('mouseleave', scheduleAuto);

    // Start when in viewport
    const qObs = new IntersectionObserver((entries) => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                goTo(0, false);
                scheduleAuto();
                qObs.unobserve(e.target);
            }
        });
    }, { threshold: 0.3 });

    const qSection = document.getElementById('quotes');
    if (qSection) qObs.observe(qSection);

    // Keyboard nav (only when section is visible)
    document.addEventListener('keydown', e => {
        const sect = document.getElementById('quotes');
        if (!sect) return;
        const r = sect.getBoundingClientRect();
        if (r.top > window.innerHeight || r.bottom < 0) return;
        if (e.key === 'ArrowRight' || e.key === 'ArrowDown') goTo(idx + 1);
        if (e.key === 'ArrowLeft'  || e.key === 'ArrowUp')   goTo(idx - 1);
    });

    initQuoteParticles();
    console.log('[Quote] Engine aktif —', QUOTES.length, 'quotes');
})();


// ──────────────────────────────────────────────────────────────
// 14. KEYBOARD NAV — hero section arrow keys
// ──────────────────────────────────────────────────────────────
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft')  document.getElementById('prevBtn')?.click();
    if (e.key === 'ArrowRight') document.getElementById('nextBtn')?.click();
});


// ──────────────────────────────────────────────────────────────
// 15. PAGE LOAD — fade in
// ──────────────────────────────────────────────────────────────
window.addEventListener('load', () => {
    document.body.style.transition = 'opacity 0.6s ease';
    document.body.style.opacity    = '1';
});

// Set opacity to 0 instantly before load
document.body.style.opacity = '0';

console.log('🌿 Frieren Website — Loaded');
console.log('✨ All sections initialized');
console.log('⌨  Arrow keys: navigate character slider');

// ──────────────────────────────────────────────────────────────
// 16. THREE.JS PROCEDURAL RELIC (Tongkat Sihir & Mana)
// ──────────────────────────────────────────────────────────────
(function initThreeJSRelic() {
    const container = document.getElementById('threeCanvasContainer');
    if (!container || typeof THREE === 'undefined') return;

    // SCENE SETUP
    const scene = new THREE.Scene();
    
    // CAMERA
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.z = 15;

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // GROUPS & OBJECTS
    const group = new THREE.Group();
    scene.add(group);

    // 1. TONGKAT SIHIR (Staff)
    const handleGeo = new THREE.CylinderGeometry(0.15, 0.1, 8, 16);
    const handleMat = new THREE.MeshStandardMaterial({ 
        color: 0xaa8844, 
        roughness: 0.6,
        metalness: 0.5 
    });
    const handle = new THREE.Mesh(handleGeo, handleMat);
    handle.position.y = -2;
    group.add(handle);

    // Head Ornament
    const ringGeo = new THREE.TorusGeometry(1.2, 0.15, 16, 50, Math.PI * 1.5);
    const ringMat = new THREE.MeshStandardMaterial({ 
        color: 0xffd700, 
        roughness: 0.3,
        metalness: 0.8
    });
    const ring = new THREE.Mesh(ringGeo, ringMat);
    ring.position.y = 2.5;
    ring.rotation.z = -Math.PI * 0.25;
    group.add(ring);

    // Gem / Kristal Pusat
    const gemGeo = new THREE.OctahedronGeometry(0.6, 0);
    const gemMat = new THREE.MeshPhysicalMaterial({
        color: 0xff2244,
        emissive: 0xaa0011,
        emissiveIntensity: 0.5,
        transparent: true,
        opacity: 0.9,
        roughness: 0.1,
        metalness: 0.1
    });
    const gem = new THREE.Mesh(gemGeo, gemMat);
    gem.position.y = 2.5;
    group.add(gem);

    // 2. ENERGI MANA (Floating Particles)
    const particles = new THREE.Group();
    scene.add(particles);

    const particleGeo = new THREE.IcosahedronGeometry(0.15, 0);
    const particleMat = new THREE.MeshBasicMaterial({ 
        color: 0x5eecff, 
        transparent: true,
        opacity: 0.8
    });

    for(let i=0; i<15; i++) {
        const mesh = new THREE.Mesh(particleGeo, particleMat);
        mesh.userData = {
            radius: 2 + Math.random() * 3,
            speed: (Math.random() * 0.02) + 0.01,
            angle: Math.random() * Math.PI * 2,
            yOffset: (Math.random() - 0.5) * 6
        };
        particles.add(mesh);
    }

    // LIGHTS
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 5, 5);
    scene.add(directionalLight);

    const pointLight = new THREE.PointLight(0xff2244, 2, 10);
    pointLight.position.set(0, 2.5, 0);
    scene.add(pointLight);

    // ANIMATION & INTERACTION
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = container.clientWidth / 2;
    const windowHalfY = container.clientHeight / 2;

    container.addEventListener('mousemove', (e) => {
        const rect = container.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) - windowHalfX;
        mouseY = (e.clientY - rect.top) - windowHalfY;
    });

    container.addEventListener('mouseleave', () => {
        mouseX = 0; mouseY = 0;
    });

    let time = 0;

    function animate() {
        requestAnimationFrame(animate);
        time += 0.01;

        // Smooth mouse rotation
        targetX = mouseX * 0.002;
        targetY = mouseY * 0.002;
        group.rotation.y += 0.05 * (targetX - group.rotation.y);
        group.rotation.x += 0.05 * (targetY - group.rotation.x);

        // Hover effect for the staff
        group.position.y = Math.sin(time * 2) * 0.3;
        
        // Spin gem
        gem.rotation.y += 0.02;
        gem.rotation.x += 0.01;

        // Orbit particles
        particles.children.forEach(p => {
            p.userData.angle += p.userData.speed;
            p.position.x = Math.cos(p.userData.angle) * p.userData.radius;
            p.position.z = Math.sin(p.userData.angle) * p.userData.radius;
            p.position.y = p.userData.yOffset + Math.sin(time + p.userData.angle) * 1.5;
            p.rotation.x += 0.01;
            p.rotation.y += 0.02;
        });

        renderer.render(scene, camera);
    }

    animate();

    // RESIZE HANDLER
    window.addEventListener('resize', () => {
        if (!container) return;
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
    });
})();