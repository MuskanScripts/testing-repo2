import { useEffect } from 'react';

export default function ThemeToggle() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    function createThemeToggle() {
      const toggleHtml = `
        <div class="theme-toggle-wrapper">
            <div class="theme-toggle" id="theme-toggle" role="button" aria-label="Toggle dark mode">
                <div class="toggle-icons"><i class="fas fa-sun"></i><i class="fas fa-moon"></i></div>
                <div class="toggle-circle"></div>
            </div>
            <div class="bubble-container"></div>
        </div>`;
      document.body.insertAdjacentHTML('beforeend', toggleHtml);
      const toggle = document.getElementById('theme-toggle');
      if (toggle) { toggle.addEventListener('click', toggleTheme); createFloatingBubbles(); }
    }
    function initializeTheme() {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) { document.documentElement.setAttribute('data-theme', savedTheme); document.body.classList.add(`theme-${savedTheme}`); }
      else { const prefersDarkMode = window.matchMedia('(prefers-color-scheme: dark)').matches; const theme = prefersDarkMode ? 'dark' : 'light'; document.documentElement.setAttribute('data-theme', theme); document.body.classList.add(`theme-${theme}`); localStorage.setItem('theme', theme); }
      window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => { if (!localStorage.getItem('theme') || localStorage.getItem('theme') === 'system') { const newTheme = e.matches ? 'dark' : 'light'; setTheme(newTheme); } });
      updateToggleState();
    }
    function toggleTheme() {
      const currentTheme = document.documentElement.getAttribute('data-theme'); const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
      document.querySelectorAll('.theme-toggle').forEach((toggle) => toggle.classList.add('animate'));
      document.body.classList.add('theme-changing');
      setTimeout(() => {
        setTheme(newTheme); showBubbles(); setTimeout(() => { document.querySelectorAll('.theme-toggle').forEach((t) => t.classList.remove('animate')); document.body.classList.remove('theme-changing'); }, 500);
      }, 100);
    }
    function setTheme(theme) {
      document.body.classList.remove('theme-light', 'theme-dark'); document.body.classList.add(`theme-${theme}`);
      document.documentElement.setAttribute('data-theme', theme); localStorage.setItem('theme', theme); updateToggleState();
      document.dispatchEvent(new CustomEvent('themeChanged', { detail: { theme } }));
    }
    function updateToggleState() {
      const currentTheme = document.documentElement.getAttribute('data-theme');
      document.querySelectorAll('.theme-toggle').forEach((toggle) => { toggle.classList.remove('dark-mode', 'light-mode'); if (currentTheme === 'dark') toggle.classList.add('dark-mode'); else toggle.classList.add('light-mode'); });
    }
    function createFloatingBubbles() {
      const bubbleContainer = document.querySelector('.bubble-container'); if (!bubbleContainer) return;
      for (let i = 0; i < 10; i++) { const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.style.left = `${Math.random() * 100}%`; bubble.style.animationDelay = `${Math.random() * 5}s`; bubble.style.animationDuration = `${3 + Math.random() * 7}s`; bubbleContainer.appendChild(bubble); }
    }
    function addBubbleEffectToToggle(toggleElement) {
      if (!toggleElement) return; const bubbleContainer = document.createElement('div'); bubbleContainer.className = 'bubble-container';
      for (let i = 0; i < 6; i++) { const bubble = document.createElement('div'); bubble.className = 'bubble'; bubble.style.left = `${Math.random() * 100}%`; bubble.style.animationDelay = `${Math.random() * 3}s`; bubble.style.animationDuration = `${2 + Math.random() * 4}s`; bubbleContainer.appendChild(bubble); }
      toggleElement.parentNode.insertBefore(bubbleContainer, toggleElement.nextSibling);
    }
    function showBubbles() { document.querySelectorAll('.bubble-container').forEach((c) => { c.classList.add('active'); setTimeout(() => c.classList.remove('active'), 2000); }); }
    function integrateWithBallAnimation() {
      const ball = document.querySelector('.ball-animation'); if (!ball) return;
      document.addEventListener('themeChanged', function (e) { const theme = e.detail.theme; if (theme === 'dark') { ball.style.background = 'radial-gradient(circle at 30% 30%, #4B6BFD, #06ADEF)'; ball.style.boxShadow = '0 0 15px rgba(6, 173, 239, 0.6)'; } else { ball.style.background = 'radial-gradient(circle at 30% 30%, #ffffff, #06ADEF)'; ball.style.boxShadow = '0 0 15px rgba(6, 173, 239, 0.3)'; } });
    }

    createThemeToggle(); initializeTheme(); document.body.classList.add('theme-transition'); const navbarToggle = document.getElementById('navbar-theme-toggle'); if (navbarToggle) { navbarToggle.addEventListener('click', toggleTheme); addBubbleEffectToToggle(navbarToggle); } integrateWithBallAnimation();
  }, []);
  return null;
}
