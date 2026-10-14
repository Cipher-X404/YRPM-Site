// ─────────────────────────────────────────────────────────────
//  ABOUT SECTION — Entrance Animations & Cursor Interaction
//  Depends on: GSAP, ScrollTrigger, CustomEase (loaded in index.html)
// ─────────────────────────────────────────────────────────────

(function () {
  if (typeof gsap === 'undefined') return;

  // ── PLUGIN REGISTRATION ──────────────────────────────────────
  if (typeof ScrollTrigger !== 'undefined') gsap.registerPlugin(ScrollTrigger);
  if (typeof CustomEase    !== 'undefined') {
    gsap.registerPlugin(CustomEase);
    CustomEase.create('reveal',   'M0,0 C0.25,0 0.25,1 1,1');
    CustomEase.create('entrance', 'M0,0 C0.16,1 0.3,1 1,1');
  }

  // ── DEVICE DETECTION ─────────────────────────────────────────
  const isDesktop = !window.matchMedia('(hover: none) and (pointer: coarse)').matches &&
                    !('ontouchstart' in window);

  // ── ELEMENT REFS ─────────────────────────────────────────────
  const section      = document.getElementById('about-section');
  if (!section) return;

  const accentLine   = document.getElementById('aboutAccentLine');
  const eyebrowLine  = document.getElementById('aboutEyebrowLine');
  const eyebrowText  = document.getElementById('aboutEyebrowText');
  const headlineSpans = [
    document.querySelector('#aboutHl0 span'),
    document.querySelector('#aboutHl1 span'),
    document.querySelector('#aboutHl2 span'),
    document.querySelector('#aboutHl3 span'),
  ];
  const divider      = document.getElementById('aboutDivider');
  const bodyCopy     = document.getElementById('aboutBodyCopy');
  const mobileCta    = document.getElementById('aboutMobileCta');
  const scrollInd    = document.getElementById('aboutScrollIndicator');
  const cornerLabel  = document.getElementById('aboutCornerLabel');
  const cursorBtn    = document.getElementById('about-cursor-btn');

  // ── VIDEO POSTER FALLBACK ─────────────────────────────────────
  const bgVideo = section.querySelector('.about-bg-video');
  if (bgVideo) {
    bgVideo.setAttribute(
      'poster',
      'https://images.pexels.com/photos/36425622/pexels-photo-36425622.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=1080&w=1920'
    );
  }

  // ── ENTRANCE ANIMATION TIMELINE ───────────────────────────────
  function runEntrance() {
    const ease = typeof CustomEase !== 'undefined' ? 'entrance' : 'power3.out';
    const reveal = typeof CustomEase !== 'undefined' ? 'reveal' : 'power3.out';

    const tl = gsap.timeline({ defaults: { ease } });

    // Accent line grows down
    tl.to(accentLine, {
      height: '100%',
      duration: 1.4,
      ease: 'power3.inOut',
    }, 0.2);

    // Eyebrow line scaleX
    tl.fromTo(eyebrowLine,
      { scaleX: 0, transformOrigin: 'left' },
      { scaleX: 1, duration: 0.8, ease: 'power3.out' },
      0.55
    );

    // Eyebrow text
    tl.to(eyebrowText, {
      opacity: 1,
      y: 0,
      duration: 0.7,
      ease: 'power3.out',
    }, 0.75);

    // Headline lines — staggered reveal
    headlineSpans.forEach((span, i) => {
      if (!span) return;
      tl.to(span, {
        y: '0%',
        duration: 1.1,
        ease: reveal,
      }, 0.60 + i * 0.11);
    });

    // Divider width
    tl.to(divider, {
      width: 180,
      duration: 0.9,
      ease: 'power3.out',
    }, 1.10);

    // Body copy
    tl.to(bodyCopy, {
      opacity: 1,
      y: 0,
      duration: 0.9,
      ease: 'power3.out',
    }, 1.25);

    // Mobile CTA
    if (mobileCta) {
      tl.to(mobileCta, {
        opacity: 1,
        y: 0,
        duration: 0.7,
        ease: 'power3.out',
      }, 1.40);
    }

    // Scroll indicator
    if (scrollInd) {
      tl.to(scrollInd, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, 1.55);
    }

    // Corner label
    if (cornerLabel) {
      tl.to(cornerLabel, {
        opacity: 1,
        duration: 0.7,
        ease: 'power2.out',
      }, 1.60);
    }

    return tl;
  }

  // ── AMBIENT HEADLINE FLOAT ────────────────────────────────────
  function startAmbientFloat() {
    headlineSpans.forEach((span, i) => {
      if (!span) return;
      gsap.to(span.parentElement, {
        y: i % 2 === 0 ? '-5px' : '5px',
        duration: 3.5 + i * 0.4,
        ease: 'sine.inOut',
        repeat: -1,
        yoyo: true,
        delay: i * 0.3,
      });
    });
  }

  // ── VIDEO BRIGHTNESS PULSE ────────────────────────────────────
  function startVideoPulse() {
    if (!bgVideo) return;
    gsap.to(bgVideo, {
      filter: 'brightness(1.08)',
      duration: 4.5,
      ease: 'sine.inOut',
      repeat: -1,
      yoyo: true,
    });
  }

  // ── FLOATING CURSOR BUTTON (Desktop only) ─────────────────────
  if (isDesktop && cursorBtn) {
    let isInSection = false;

    const xTo = gsap.quickTo(cursorBtn, 'x', { duration: 0.65, ease: 'power3.out' });
    const yTo = gsap.quickTo(cursorBtn, 'y', { duration: 0.65, ease: 'power3.out' });

    // Initialise position to centre
    gsap.set(cursorBtn, {
      x: window.innerWidth  / 2,
      y: window.innerHeight / 2,
    });

    // Track mouse globally
    document.addEventListener('mousemove', (e) => {
      xTo(e.clientX);
      yTo(e.clientY);
    }, { passive: true });

    // Show on section enter
    section.addEventListener('mouseenter', () => {
      isInSection = true;
      gsap.to(cursorBtn, { opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(1.7)' });
    });

    // Hide on section leave
    section.addEventListener('mouseleave', () => {
      isInSection = false;
      gsap.to(cursorBtn, { opacity: 0, scale: 0.7, duration: 0.35, ease: 'power3.in' });
    });

    // Press feedback
    section.addEventListener('mousedown', () => {
      gsap.to(cursorBtn, { scale: 0.88, duration: 0.15, ease: 'power2.in' });
    });
    section.addEventListener('mouseup', () => {
      gsap.to(cursorBtn, { scale: 1, duration: 0.30, ease: 'back.out(2)' });
    });

    // Parallax content shift
    const textBlock = section.querySelector('.about-text-block');
    if (textBlock) {
      const xParallax = gsap.quickTo(textBlock, 'x', { duration: 1.2, ease: 'power3.out' });
      const yParallax = gsap.quickTo(textBlock, 'y', { duration: 1.2, ease: 'power3.out' });

      document.addEventListener('mousemove', (e) => {
        if (!isInSection) return;
        const dx = (e.clientX - window.innerWidth  / 2) / (window.innerWidth  / 2);
        const dy = (e.clientY - window.innerHeight / 2) / (window.innerHeight / 2);
        xParallax(dx * -10);
        yParallax(dy * -6);
      }, { passive: true });
    }

    // Snap cursor on resize
    window.addEventListener('resize', () => {
      gsap.set(cursorBtn, {
        x: window.innerWidth  / 2,
        y: window.innerHeight / 2,
      });
    }, { passive: true });
  }

  // ── RESET HELPERS (return all animated els to pre-entrance state) ──
  function resetElements() {
    gsap.killTweensOf([
      accentLine, eyebrowLine, eyebrowText,
      divider, bodyCopy, mobileCta, scrollInd, cornerLabel,
      ...headlineSpans.filter(Boolean),
      ...headlineSpans.filter(Boolean).map(s => s.parentElement),
    ]);

    gsap.set(accentLine,  { height: '0%' });
    gsap.set(eyebrowLine, { scaleX: 0, transformOrigin: 'left' });
    gsap.set(eyebrowText, { opacity: 0, y: 12 });
    headlineSpans.forEach(span => { if (span) gsap.set(span, { y: '110%' }); });
    gsap.set(divider,     { width: 0 });
    gsap.set(bodyCopy,    { opacity: 0, y: 22 });
    if (mobileCta)   gsap.set(mobileCta,   { opacity: 0, y: 18 });
    if (scrollInd)   gsap.set(scrollInd,   { opacity: 0 });
    if (cornerLabel) gsap.set(cornerLabel, { opacity: 0 });
  }

  // ── INIT ──────────────────────────────────────────────────────
  // Start video pulse immediately (background ambient effect)
  startVideoPulse();

  let ambientFloatStarted = false;

  // Re-play entrance every time the section enters the viewport
  ScrollTrigger.create({
    trigger: section,
    start: 'top 75%',
    end: 'bottom top',
    onEnter: () => {
      resetElements();
      const entranceTl = runEntrance();
      if (!ambientFloatStarted) {
        entranceTl.then(() => {
          startAmbientFloat();
          ambientFloatStarted = true;
        });
      }
    },
    onLeave: () => resetElements(),
    onEnterBack: () => {
      resetElements();
      runEntrance();
    },
    onLeaveBack: () => resetElements(),
  });

})();
