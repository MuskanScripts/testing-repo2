import { useEffect } from 'react';

export default function PageTransitions() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    function forceLoadImages() {
      document.querySelectorAll('img').forEach((img) => {
        img.style.visibility = 'visible'; img.style.opacity = '1'; img.style.display = '';
        if (img.loading === 'lazy') { const src = img.getAttribute('src'); if (src) { const newImg = new Image(); newImg.src = src; newImg.onload = function () { img.src = src; }; } }
      });
      const aboutImage = document.querySelector('.position-relative.h-100 img');
      if (aboutImage) { aboutImage.style.visibility = 'visible'; aboutImage.style.opacity = '1'; aboutImage.style.position = 'absolute'; aboutImage.style.width = '100%'; aboutImage.style.height = '100%'; aboutImage.style.objectFit = 'cover'; }
    }
    function initScrollProgress() {
      const scrollProgress = document.querySelector('.scroll-progress');
      if (!scrollProgress) return;
      window.addEventListener('scroll', () => {
        const scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
        const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = (scrollTop / scrollHeight) * 100;
        scrollProgress.style.width = scrollPercent + '%';
      });
    }
    function ensureContentVisibility() {
      document.querySelectorAll('main, .container, .container-fluid, section').forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.display = ''; });
      const aboutSection = document.querySelector('.position-relative.h-100');
      if (aboutSection) { aboutSection.style.visibility = 'visible'; aboutSection.style.opacity = '1'; aboutSection.style.minHeight = '400px'; aboutSection.style.display = 'block'; }
      const spinner = document.getElementById('spinner'); if (spinner) spinner.classList.remove('show');
      document.body.style.overflow = ''; document.body.style.visibility = 'visible'; document.body.style.opacity = '1';
    }
    function setupScrollAnimations() {
      const animatedElements = document.querySelectorAll('.text-reveal, .image-reveal, .stagger-list-item, .section-entrance');
      const observer = new IntersectionObserver((entries) => { entries.forEach((entry) => { if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); } }); }, { threshold: 0.1, rootMargin: '0px 0px -10% 0px' });
      animatedElements.forEach((element) => observer.observe(element));
      addAnimationClasses();
    }
    function addAnimationClasses() {
      document.querySelectorAll('h1, h2, h3, .carousel-caption h5, .carousel-caption h1, .carousel-caption p').forEach((el) => { if (!el.classList.contains('text-reveal')) el.classList.add('text-reveal'); });
      document.querySelectorAll('.container img:not(.navbar img):not(.position-absolute)').forEach((el) => { if (!el.classList.contains('image-reveal')) el.classList.add('image-reveal'); });
      document.querySelectorAll('section, .container:not(.navbar-container)').forEach((el) => { if (!el.classList.contains('section-entrance')) el.classList.add('section-entrance'); });
      document.querySelectorAll('.dropdown-menu .dropdown-item').forEach((el) => { if (!el.classList.contains('stagger-list-item')) el.classList.add('stagger-list-item'); });
      document.querySelectorAll('.owl-carousel-item').forEach((el) => { if (!el.classList.contains('carousel-zoom')) el.classList.add('carousel-zoom'); });
    }
    function setupPageTransitions() {
      const pageTransition = document.querySelector('.page-transition');
      if (!pageTransition) return;
      document.querySelectorAll('a[href^="/"]:not([target="_blank"])').forEach((link) => {
        link.addEventListener('click', function (e) {
          const href = this.getAttribute('href'); if (href.startsWith('/#')) return; e.preventDefault(); pageTransition.style.transition = 'transform 0.5s ease'; pageTransition.style.transform = 'translateY(0)'; setTimeout(() => { window.location.href = href; }, 500);
        });
      });
      window.addEventListener('pageshow', function () { pageTransition.style.transition = 'transform 0.5s ease 0.5s'; pageTransition.style.transform = 'translateY(100%)'; ensureContentVisibility(); forceLoadImages(); });
    }

    initScrollProgress(); setupPageTransitions(); setupScrollAnimations(); ensureContentVisibility(); forceLoadImages();
  }, []);
  return null;
}
