/**
 * Hero Section Slider & Interactive Logic
 * Handles the custom asymmetrical carousel and pagination dots
 */
document.addEventListener('DOMContentLoaded', () => {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length || !dots.length) return;

  let currentSlide = 0;
  let autoplayTimer = null;
  const AUTOPLAY_INTERVAL = 5500;

  function showSlide(index) {
    if (index === currentSlide) return;
    
    slides.forEach((slide, i) => {
      slide.classList.toggle('active', i === index);
    });

    dots.forEach((dot, i) => {
      const isActive = (i === index);
      dot.classList.toggle('active', isActive);
      dot.setAttribute('aria-selected', isActive ? 'true' : 'false');
    });

    currentSlide = index;
  }

  function nextSlide() {
    const next = (currentSlide + 1) % slides.length;
    showSlide(next);
  }

  function startAutoplay() {
    stopAutoplay();
    autoplayTimer = setInterval(nextSlide, AUTOPLAY_INTERVAL);
  }

  function stopAutoplay() {
    if (autoplayTimer) {
      clearInterval(autoplayTimer);
      autoplayTimer = null;
    }
  }

  dots.forEach((dot, index) => {
    dot.addEventListener('click', () => {
      showSlide(index);
      startAutoplay(); // Reset autoplay timer on manual click
    });
  });

  const heroShapeWrap = document.querySelector('.hero-main-shape-wrap');
  if (heroShapeWrap) {
    heroShapeWrap.addEventListener('mouseenter', stopAutoplay);
    heroShapeWrap.addEventListener('mouseleave', startAutoplay);
  }

  startAutoplay();
});
