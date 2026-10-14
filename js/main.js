// Register ScrollTrigger with GSAP engine
if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------
// 1. Dual-State Navigation Scroll Animation
// -------------------------------------------------------------
const headerWrapper = document.getElementById('mainHeader');

// -------------------------------------------------------------
// 2. Megamenu Trigger Animations (Open & Close States)
// -------------------------------------------------------------
const menuBtn = document.getElementById('menuBtn');
const megamenuPanel = document.getElementById('megamenuPanel');
let isMenuOpen = false;

if (menuBtn && megamenuPanel && typeof gsap !== 'undefined') {
  const menuTl = gsap.timeline({ paused: true });

  menuTl.to(megamenuPanel, {
    top: 0, opacity: 1, visibility: 'visible', duration: 0.6, ease: 'power4.out'
  });
  menuTl.from('.megamenu-col', {
    y: 20, opacity: 0, stagger: 0.08, duration: 0.4, ease: 'power3.out'
  }, '-=0.3');
  menuTl.from('.megamenu-visual-panel', {
    x: 30, opacity: 0, duration: 0.5, ease: 'power3.out'
  }, '-=0.3');

  menuBtn.addEventListener('click', () => {
    isMenuOpen = !isMenuOpen;
    menuBtn.classList.toggle('is-active', isMenuOpen);
    if (isMenuOpen) {
      menuTl.play();
      if (headerWrapper) headerWrapper.classList.add('is-sticky');
    } else {
      menuTl.reverse();
      if (headerWrapper) headerWrapper.classList.remove('is-sticky');
    }
  });

  document.querySelectorAll('.megamenu-item a').forEach((link) => {
    link.addEventListener('click', () => {
      if (!isMenuOpen) return;
      isMenuOpen = false;
      menuBtn.classList.remove('is-active');
      menuTl.reverse();
      if (headerWrapper) headerWrapper.classList.remove('is-sticky');
    });
  });
}

// -------------------------------------------------------------
// 3. Megamenu Hover Dynamic Image Swapping System
// -------------------------------------------------------------
const interactiveLinks = document.querySelectorAll('[data-visual]');
const visualTaglineText = document.getElementById('megamenuTagline');

const visualDetails = {
  default:    { tagline: 'Faith is always <span>essential</span>. Now it is accessible, too.', imageSelector: '#img-default' },
  divine:     { tagline: 'Encounter the Holy Spirit. Join our <span>sacred sanctuary</span> worship.', imageSelector: '#img-divine' },
  sabbath:    { tagline: 'Deepen your understanding. Interactive <span>Scripture study</span> circles.', imageSelector: '#img-sabbath' },
  children:   { tagline: 'Nurturing faith early. <span>Creative</span> and safe spaces for kids.', imageSelector: '#img-children' },
  women:      { tagline: 'Sisters in grace. Empowering and <span>supportive</span> spiritual community.', imageSelector: '#img-women' },
  youth:      { tagline: 'Igniting modern faith. Passionate, <span>rising generation</span>.', imageSelector: '#img-youth' },
  evangelism: { tagline: 'Spreading light globally. Active <span>mission</span> and community outreach.', imageSelector: '#img-evangelism' }
};

if (interactiveLinks.length && visualTaglineText && typeof gsap !== 'undefined') {
  let activeImage = document.getElementById('img-default');

  interactiveLinks.forEach((link) => {
    link.addEventListener('mouseenter', () => {
      const key = link.getAttribute('data-visual');
      const nextDetail = visualDetails[key];
      if (!nextDetail) return;
      const nextImage = document.querySelector(nextDetail.imageSelector);
      if (!nextImage || nextImage === activeImage) return;
      gsap.to(activeImage, { opacity: 0, scale: 1.1, duration: 0.4, ease: 'power2.inOut' });
      gsap.fromTo(nextImage, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
      activeImage = nextImage;
      gsap.to(visualTaglineText, { opacity: 0, y: -5, duration: 0.2,
        onComplete: () => {
          visualTaglineText.innerHTML = nextDetail.tagline;
          gsap.to(visualTaglineText, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
      });
    });
  });

  const menuGrid = document.querySelector('.megamenu-links-grid');
  if (menuGrid) {
    menuGrid.addEventListener('mouseleave', () => {
      const defaultImg = document.getElementById('img-default');
      if (!defaultImg || activeImage === defaultImg) return;
      gsap.to(activeImage, { opacity: 0, scale: 1.1, duration: 0.4, ease: 'power2.inOut' });
      gsap.fromTo(defaultImg, { opacity: 0, scale: 1.15 }, { opacity: 1, scale: 1, duration: 0.5, ease: 'power3.out' });
      activeImage = defaultImg;
      gsap.to(visualTaglineText, { opacity: 0, y: -5, duration: 0.2,
        onComplete: () => {
          visualTaglineText.innerHTML = visualDetails.default.tagline;
          gsap.to(visualTaglineText, { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' });
        }
      });
    });
  }
}

// -------------------------------------------------------------
// 4. About Section — logic lives in js/about.js
// -------------------------------------------------------------

// -------------------------------------------------------------
// 5. Weekly Rhythm Component — GSAP horizontal track slider & countdowns
// -------------------------------------------------------------
(function() {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

    const section = document.getElementById('weekly-rhythm');
    if (!section) return;

    const header = section.querySelector('.section-header');
    const particlesContainer = header.querySelector('.particles-container');
    const cardTrack = section.querySelector('.card-track');
    const cardTrackWrapper = section.querySelector('.card-track-wrapper');
    const cards = section.querySelectorAll('.rhythm-card');
    const shimmerLine = section.querySelector('.shimmer-connector');
    const ctaStrip = section.querySelector('.cta-strip');
    const navPrev = section.querySelector('.nav-prev');
    const navNext = section.querySelector('.nav-next');

    /* ---------- WORD SPLIT (HEADLINE) ---------- */
    const headline = header.querySelector('.section-headline');
    const words = headline.textContent.trim().split(' ');
    headline.innerHTML = '';
    words.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        headline.appendChild(span);
        if (i < words.length - 1) headline.appendChild(document.createTextNode(' '));
    });
    const wordSpans = headline.querySelectorAll('.word');

    /* ---------- FLOATING PARTICLES (18) ---------- */
    for (let i = 0; i < 18; i++) {
        const dot = document.createElement('div');
        dot.className = 'gold-particle';
        const size = gsap.utils.random(3, 6);
        dot.style.width = size + 'px';
        dot.style.height = size + 'px';
        dot.style.opacity = gsap.utils.random(0.08, 0.25);
        dot.style.left = gsap.utils.random(5, 95) + '%';
        dot.style.top = gsap.utils.random(5, 90) + '%';
        particlesContainer.appendChild(dot);
        gsap.to(dot, {
            y: gsap.utils.random(-35, 35),
            x: gsap.utils.random(-18, 18),
            opacity: gsap.utils.random(0.08, 0.38),
            duration: gsap.utils.random(3, 7),
            ease: 'sine.inOut',
            repeat: -1,
            yoyo: true,
            delay: gsap.utils.random(0, 5)
        });
    }

    /* ---------- COUNTDOWN LOGIC ---------- */
    const dayMap = {
        'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
        'Thursday': 4, 'Friday': 5, 'Saturday': 6
    };

    function getNextOccurrence(dayName) {
        const today = new Date();
        const currentDay = today.getDay();
        const targetDay = dayMap[dayName];
        if (targetDay === undefined) return null;

        let daysUntil = targetDay - currentDay;
        if (daysUntil < 0) daysUntil += 7;
        if (daysUntil === 0) {
            return 0;
        }
        const nextDate = new Date(today);
        nextDate.setDate(today.getDate() + daysUntil);
        nextDate.setHours(0,0,0,0);
        return nextDate;
    }

    function formatCountdown(nextDate) {
        const now = new Date();
        const diffMs = nextDate - now;
        if (diffMs <= 0) return 'Today';
        const totalMinutes = Math.floor(diffMs / 60000);
        const days = Math.floor(totalMinutes / 1440);

        if (days > 30) {
            const months = Math.floor(days / 30.4);
            const remainingDays = Math.round(days % 30.4);
            if (months === 1) {
                return remainingDays > 0 ? `in 1 month ${remainingDays}d` : 'in 1 month';
            }
            return remainingDays > 0 ? `in ${months} months ${remainingDays}d` : `in ${months} months`;
        }

        const hours = Math.floor((totalMinutes % 1440) / 60);
        const minutes = totalMinutes % 60;

        if (days > 1) return `in ${days} days`;
        if (days === 1) return 'tomorrow';
        if (hours > 0 && minutes > 0) return `in ${hours}h ${minutes}m`;
        if (hours > 0) return `in ${hours}h`;
        return `in ${minutes}m`;
    }

    function updateCountdowns() {
        const todayDayName = new Date().toLocaleDateString('en-US', { weekday: 'long' });
        const now = new Date();
        const year = now.getFullYear();
        const month = now.getMonth();
        const day = now.getDate();

        cards.forEach(card => {
            const dayAttr = card.dataset.day;
            const todayBadge = card.querySelector('.today-badge');
            const countdownBadge = card.querySelector('.countdown-badge');
            const covenantDayBadge = card.querySelector('.covenant-day-badge');

            if (dayAttr === "Covenant Prayer") {
                const lastDayOfCurrent = new Date(year, month + 1, 0);
                const lastDayDate = lastDayOfCurrent.getDate();
                let isActive = false;
                let activeLabel = "";
                let targetStartDate = null;

                if (day === lastDayDate) {
                    isActive = true;
                    activeLabel = "Last Day";
                } else if (day === 1) {
                    isActive = true;
                    activeLabel = "Day 1";
                } else if (day === 2) {
                    isActive = true;
                    activeLabel = "Day 2";
                }

                if (isActive) {
                    if (todayBadge) {
                        todayBadge.classList.add('visible');
                        todayBadge.textContent = "Active";
                    }
                    if (covenantDayBadge) {
                        covenantDayBadge.textContent = activeLabel;
                        covenantDayBadge.classList.add('visible');
                        covenantDayBadge.style.display = 'inline-block';
                    }
                    if (countdownBadge) countdownBadge.classList.remove('visible');
                } else {
                    if (day < lastDayDate && day > 2) {
                        targetStartDate = lastDayOfCurrent;
                    } else {
                        targetStartDate = new Date(year, month + 2, 0);
                    }
                    targetStartDate.setHours(0,0,0,0);

                    if (todayBadge) todayBadge.classList.remove('visible');
                    if (covenantDayBadge) {
                        covenantDayBadge.classList.remove('visible');
                        covenantDayBadge.style.display = 'none';
                    }
                    if (countdownBadge) {
                        countdownBadge.textContent = formatCountdown(targetStartDate);
                        countdownBadge.classList.add('visible');
                    }
                }
            } else if (dayAttr === "Thanksgiving") {
                if (month === 1) {
                    if (todayBadge) {
                        todayBadge.classList.add('visible');
                        todayBadge.textContent = "Active";
                    }
                    if (countdownBadge) {
                        countdownBadge.textContent = "This Month";
                        countdownBadge.classList.add('visible');
                    }
                } else {
                    let targetYear = year;
                    if (month > 1) {
                        targetYear += 1;
                    }
                    const nextFeb = new Date(targetYear, 1, 1);
                    nextFeb.setHours(0,0,0,0);

                    if (todayBadge) todayBadge.classList.remove('visible');
                    if (countdownBadge) {
                        countdownBadge.textContent = formatCountdown(nextFeb);
                        countdownBadge.classList.add('visible');
                    }
                }
            } else if (dayAttr === "Passover") {
                const isPassoverActive = (month === 3 && day >= 14 && day <= 20);

                if (isPassoverActive) {
                    const dayIndex = day - 14 + 1;
                    if (todayBadge) {
                        todayBadge.classList.add('visible');
                        todayBadge.textContent = "Active";
                    }
                    if (countdownBadge) {
                        countdownBadge.textContent = `Day ${dayIndex} of 7`;
                        countdownBadge.classList.add('visible');
                    }
                } else {
                    let targetYear = year;
                    if (month > 3 || (month === 3 && day > 20)) {
                        targetYear += 1;
                    }
                    const nextPassover = new Date(targetYear, 3, 14);
                    nextPassover.setHours(0,0,0,0);

                    if (todayBadge) todayBadge.classList.remove('visible');
                    if (countdownBadge) {
                        countdownBadge.textContent = formatCountdown(nextPassover);
                        countdownBadge.classList.add('visible');
                    }
                }
            } else {
                if (dayAttr === todayDayName) {
                    if (todayBadge) todayBadge.classList.add('visible');
                    if (countdownBadge) countdownBadge.classList.remove('visible');
                } else {
                    if (todayBadge) todayBadge.classList.remove('visible');
                    const nextDate = getNextOccurrence(dayAttr);
                    if (nextDate && countdownBadge) {
                        countdownBadge.textContent = formatCountdown(nextDate);
                        countdownBadge.classList.add('visible');
                    } else if (countdownBadge) {
                        countdownBadge.classList.remove('visible');
                    }
                }
            }
        });
    }
    updateCountdowns();
    setInterval(updateCountdowns, 30000);

    /* ---------- CINEMATIC HEADER ---------- */
    const headerTL = gsap.timeline({
        scrollTrigger: {
            trigger: header,
            start: 'top 80%',
            toggleActions: 'play none none reverse',
            scrub: false
        }
    });
    headerTL.from(header.querySelector('.overline'), { y: 20, opacity: 0, duration: 0.6, ease: 'power2.out' })
        .from(header.querySelector('.gold-rule'), { scaleX: 0, transformOrigin: 'center', duration: 0.5, ease: 'power2.out' }, '-=0.2')
        .from(wordSpans, { y: 50, opacity: 0, rotationX: 20, duration: 0.7, stagger: 0.08, ease: 'back.out(1.5)', clearProps: 'transform' }, '-=0.15')
        .from(header.querySelector('.subheading'), { y: 15, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.25');

    /* ---------- CARD VERTICAL ENTRY ---------- */
    const iconFloatTweens = new Map();

    cards.forEach(card => {
        gsap.set(card, { opacity: 0, y: 50, scale: 0.96, clipPath: 'inset(0 100% 0 0)' });

        const icon = card.querySelector('.card-icon-area svg');
        const learnBtn = card.querySelector('.btn-learn');

        const entryTween = gsap.to(card, {
            opacity: 1,
            y: 0,
            scale: 1,
            duration: 0.85,
            ease: 'power3.out',
            paused: true,
            clearProps: 'transform',
            onComplete: () => {
                if (learnBtn) {
                    gsap.from(learnBtn, { y: 10, opacity: 0, duration: 0.4, ease: 'power2.out', clearProps: 'all' });
                }
            }
        });

        ScrollTrigger.create({
            trigger: card,
            start: 'top 88%',
            end: 'top 40%',
            toggleActions: 'play none none reverse',
            scrub: false,
            animation: entryTween,
            onEnter: () => {
                if (icon && !iconFloatTweens.has(card)) {
                    const float = gsap.to(icon, { y: '-=6', duration: 2.2, ease: 'sine.inOut', repeat: -1, yoyo: true, overwrite: 'auto' });
                    iconFloatTweens.set(card, float);
                }
            },
            onLeaveBack: () => {
                if (iconFloatTweens.has(card)) {
                    iconFloatTweens.get(card).kill();
                    iconFloatTweens.delete(card);
                    gsap.set(icon, { y: 0 });
                }
            }
        });
    });

    /* ---------- 3D TILT + ICON HOVER ---------- */
    cards.forEach(card => {
        const icon = card.querySelector('.card-icon-area svg');
        card.addEventListener('mousemove', function(e) {
            const rect = card.getBoundingClientRect();
            const offX = e.clientX - rect.left - rect.width / 2;
            const offY = e.clientY - rect.top - rect.height / 2;
            gsap.to(card, {
                rotationY: offX * 0.014,
                rotationX: -(offY * 0.011),
                transformPerspective: 1000,
                ease: 'power1.out',
                duration: 0.45,
                overwrite: 'auto'
            });
        });
        card.addEventListener('mouseleave', function() {
            gsap.to(card, {
                rotationY: 0,
                rotationX: 0,
                duration: 0.7,
                ease: 'elastic.out(1, 0.45)',
                overwrite: 'auto'
            });
            if (icon) gsap.to(icon, { scale: 1, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' });
        });
        if (icon && icon.parentElement) {
            icon.parentElement.addEventListener('mouseenter', function(e) {
                e.stopPropagation();
                gsap.to(icon, { scale: 1.2, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' });
            });
            icon.parentElement.addEventListener('mouseleave', function(e) {
                e.stopPropagation();
                gsap.to(icon, { scale: 1, duration: 0.35, ease: 'back.out(2)', overwrite: 'auto' });
            });
        }
    });

    /* ---------- HORIZONTAL SCROLL WITH CLIP‑PATH REVEAL ---------- */
    let horizontalST = null;
    let navIndex = 0;

    function getCardData() {
        const first = cards[0];
        if (!first) return null;
        const cardW = first.getBoundingClientRect().width;
        const gap = 20;
        const total = cards.length;
        const trackW = total * cardW + (total - 1) * gap;
        const viewW = cardTrackWrapper.getBoundingClientRect().width;
        const computedStyle = getComputedStyle(cardTrack);
        const leftPad = parseFloat(computedStyle.paddingLeft) || 0;
        const scrollDist = Math.max(0, leftPad + trackW - viewW + 20);
        return { cardW, gap, total, trackW, viewW, scrollDist, leftPad };
    }

    function updateCardClipPaths() {
        const wrapperRect = cardTrackWrapper.getBoundingClientRect();
        cards.forEach(card => {
            const cardRect = card.getBoundingClientRect();
            const cardLeft = cardRect.left;
            const cardRight = cardRect.right;
            const wrapperLeft = wrapperRect.left;
            const wrapperRight = wrapperRect.right;
            const cardWidth = cardRect.width;

            if (cardLeft >= wrapperRight - 1) {
                gsap.set(card, { clipPath: 'inset(0 100% 0 0)' });
            } else if (cardRight <= wrapperLeft + 1) {
                gsap.set(card, { clipPath: 'inset(0 0% 0 0)' });
            } else if (cardWidth > 0) {
                const visibleLeft = Math.max(cardLeft, wrapperLeft);
                const visibleRight = Math.min(cardRight, wrapperRight);
                const visibleWidth = Math.max(0, visibleRight - visibleLeft);
                const revealFraction = visibleWidth / cardWidth;
                const clipRightPercent = Math.round((1 - revealFraction) * 100);
                gsap.set(card, { clipPath: `inset(0 ${clipRightPercent}% 0 0)` });
            }
        });
    }

    /* ---------- BOTTOM CTA ---------- */
    const ctaHeading = ctaStrip.querySelector('.cta-heading');
    const ctaSub = ctaStrip.querySelector('.cta-sub');
    const ctaRule = ctaStrip.querySelector('.cta-gold-rule');

    const ctaWords = ctaHeading.textContent.trim().split(' ');
    ctaHeading.innerHTML = '';
    ctaWords.forEach((word, i) => {
        const span = document.createElement('span');
        span.className = 'word';
        span.textContent = word;
        ctaHeading.appendChild(span);
        if (i < ctaWords.length - 1) ctaHeading.appendChild(document.createTextNode(' '));
    });
    const ctaWordSpans = ctaHeading.querySelectorAll('.word');

    const ctaTimeline = gsap.timeline({ paused: true });

    ctaTimeline.from(ctaRule, { width: 0, opacity: 0, duration: 0.6, ease: 'power2.inOut' })
        .from(ctaWordSpans, { y: 20, opacity: 0, rotationX: 10, stagger: 0.06, duration: 0.65, ease: 'back.out(1.2)', clearProps: 'transform' }, '-=0.3')
        .from(ctaSub, { y: 15, opacity: 0, duration: 0.5, ease: 'power2.out' }, '-=0.2');

    let ctaST = null;

    function setupCTAAnimation() {
        if (ctaST) {
            ctaST.kill();
            ctaST = null;
        }
        if (window.innerWidth < 700) {
            ctaST = ScrollTrigger.create({
                trigger: ctaStrip,
                start: 'top 88%',
                toggleActions: 'play none none reverse',
                animation: ctaTimeline,
                scrub: false
            });
        }
    }

    function setupHorizontal() {
        const data = getCardData();
        if (!data || data.scrollDist <= 0) {
            cards.forEach(card => gsap.set(card, { clipPath: 'inset(0 0% 0 0)' }));
            return;
        }

        cardTrack.style.width = data.trackW + 'px';
        cardTrack.style.flexWrap = 'nowrap';
        cardTrack.style.flexDirection = 'row';

        if (horizontalST) horizontalST.kill();
        horizontalST = ScrollTrigger.create({
            trigger: cardTrackWrapper,
            start: 'top top+=80',
            end: '+=' + (data.scrollDist + 350) + 'px',
            pin: section,
            anticipatePin: 1,
            scrub: 1.2,
            toggleActions: 'play none none reverse',
            onUpdate: function(self) {
                const scrollProgress = Math.min(1, self.progress / 0.85);
                const x = -(scrollProgress * data.scrollDist);
                gsap.set(cardTrack, { x: x });
                updateCardClipPaths();
                shimmerLine.classList.toggle('shimmer-active', self.progress > 0.01 && self.progress < 0.99);
                navIndex = Math.round(scrollProgress * (data.total - 1));
                navIndex = Math.max(0, Math.min(data.total - 1, navIndex));

                if (scrollProgress >= 1) {
                    ctaTimeline.play();
                } else {
                    ctaTimeline.reverse();
                }
            },
            onEnter: () => {
                shimmerLine.classList.add('shimmer-active');
                updateCardClipPaths();
            },
            onLeaveBack: () => {
                shimmerLine.classList.remove('shimmer-active');
                navIndex = 0;
                updateCardClipPaths();
                ctaTimeline.reverse();
            },
            onLeave: () => {
                shimmerLine.classList.remove('shimmer-active');
                navIndex = data.total - 1;
                updateCardClipPaths();
                ctaTimeline.play();
            }
        });
        section._hData = data;
        requestAnimationFrame(() => updateCardClipPaths());
    }

    function teardownHorizontal() {
        if (horizontalST) { horizontalST.kill(); horizontalST = null; }
        cardTrack.style.width = '';
        cardTrack.style.flexWrap = '';
        cardTrack.style.flexDirection = '';
        gsap.set(cardTrack, { x: 0 });
        shimmerLine.classList.remove('shimmer-active');
        navIndex = 0;
        section._hData = null;
        cards.forEach(card => gsap.set(card, { clipPath: 'inset(0 0% 0 0)' }));
        ctaTimeline.reverse();
    }

    ScrollTrigger.matchMedia({
        '(min-width: 700px)': function() {
            ScrollTrigger.refresh();
            setTimeout(() => {
                setupHorizontal();
                setupCTAAnimation();
            }, 200);
            return function() {
                teardownHorizontal();
                if (ctaST) { ctaST.kill(); ctaST = null; }
            };
        },
        '(max-width: 699px)': function() {
            teardownHorizontal();
            setupCTAAnimation();
            return function() {
                if (ctaST) { ctaST.kill(); ctaST = null; }
            };
        }
    });

    /* ---------- NAV ARROWS ---------- */
    function scrollToCard(idx) {
        const data = section._hData;
        if (!data || !horizontalST) return;
        const clamped = Math.max(0, Math.min(data.total - 1, idx));
        const progress = data.total > 1 ? clamped / (data.total - 1) : 0;
        const targetY = horizontalST.start + progress * (horizontalST.end - horizontalST.start);
        gsap.to(window, { scrollTo: { y: targetY, autoKill: false }, duration: 0.9, ease: 'power3.inOut' });
        navIndex = clamped;
    }

    if (navPrev && navNext) {
        navPrev.addEventListener('click', () => scrollToCard(navIndex - 1));
        navNext.addEventListener('click', () => scrollToCard(navIndex + 1));
    }

    ScrollTrigger.refresh();
    console.log('✅ #weekly-rhythm — refined countdowns, icons raised, pin offset, Learn More arrow animation');
})();
