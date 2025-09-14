import { useEffect } from 'react';

export default function AnimationEffects() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    function initPageLoadAnimations() {
      const header = document.querySelector('.navbar');
      if (header) {
        header.classList.add('animated', 'fade-in');
      }
      const heroTitle = document.querySelector('.hero-title, .heading, h1');
      const heroSubtitle = document.querySelector('.hero-subtitle, h2');
      if (heroTitle) heroTitle.classList.add('animated', 'fade-in-up');
      if (heroSubtitle) heroSubtitle.classList.add('animated', 'fade-in-up', 'delay-1');
      const navItems = document.querySelectorAll('.navbar-nav .nav-item, .navbar-nav a');
      navItems.forEach((item, index) => {
        item.classList.add('animated', 'fade-in');
        item.style.animationDelay = `${0.1 + index * 0.1}s`;
      });
    }

    function initScrollAnimations() {
      if (!('IntersectionObserver' in window)) {
        document.querySelectorAll('.reveal').forEach((item) => item.classList.add('visible'));
        return;
      }
      const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            revealObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -50px 0px' });
      document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

      const staggerObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const items = entry.target.querySelectorAll('.stagger-item');
            items.forEach((item) => item.classList.add('animated', 'fade-in-up'));
            staggerObserver.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15 });
      document.querySelectorAll('.stagger-container').forEach((c) => staggerObserver.observe(c));
    }

    function initHoverEffects() {
      document.querySelectorAll('.card').forEach((card) => card.classList.add('hover-lift'));
      document.querySelectorAll('.navbar-nav .nav-link').forEach((l) => l.classList.add('hover-highlight'));
      document.querySelectorAll('.btn').forEach((btn) => {
        if (!btn.classList.contains('btn-social')) btn.classList.add('hover-grow');
      });
    }

    function showLoadingAnimationIfNeeded() {
      if (!sessionStorage.getItem('visited')) {
        const loadingContainer = document.createElement('div');
        loadingContainer.className = 'loading-ball-container';
        const ball = document.createElement('div');
        ball.className = 'loading-ball';
        const loadingText = document.createElement('div');
        loadingText.className = 'loading-text';
        loadingText.textContent = 'Welcome to Resource Bank';
        loadingContainer.appendChild(ball);
        loadingContainer.appendChild(loadingText);
        document.body.appendChild(loadingContainer);
        document.body.style.overflow = 'hidden';
        setTimeout(() => {
          loadingContainer.style.opacity = '0';
          loadingContainer.style.transition = 'opacity 0.5s ease';
          setTimeout(() => {
            loadingContainer.remove();
            document.body.style.overflow = '';
            sessionStorage.setItem('visited', 'true');
          }, 500);
        }, 2000);
      }
    }

    function addRevealAnimation(selector) {
      const elements = document.querySelectorAll(selector);
      elements.forEach((element) => {
        element.classList.add('reveal');
      });
    }

    function setupStaggeredContainer(containerSelector, itemSelector) {
      const container = document.querySelector(containerSelector);
      if (container) {
        container.classList.add('stagger-container');
        const items = container.querySelectorAll(itemSelector);
        items.forEach((item) => item.classList.add('stagger-item'));
      }
    }

    initPageLoadAnimations();
    initScrollAnimations();
    initHoverEffects();
    showLoadingAnimationIfNeeded();

    window.addRevealAnimation = addRevealAnimation;
    window.setupStaggeredContainer = setupStaggeredContainer;
  }, []);
  return null;
}
