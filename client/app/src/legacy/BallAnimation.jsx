import { useEffect } from 'react';

export default function BallAnimation() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    function createBallAnimation() {
      const overlay = document.createElement('div');
      Object.assign(overlay.style, {
        position: 'fixed', top: '0', left: '0', width: '100%', height: '100%', backgroundColor: '#fff', zIndex: '9999', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'
      });
      const ball = document.createElement('div');
      Object.assign(ball.style, { width: '50px', height: '50px', borderRadius: '50%', backgroundColor: '#06BBCC', position: 'absolute', boxShadow: '0 4px 8px rgba(0,0,0,0.2)', cursor: 'pointer', transition: 'transform 0.2s ease' });
      if (window.innerWidth <= 768) { ball.style.width = '60px'; ball.style.height = '60px'; }
      const instruction = document.createElement('div');
      instruction.textContent = 'bounce a ball to get to the site';
      Object.assign(instruction.style, { fontFamily: 'Poppins, sans-serif', fontSize: '18px', color: '#333', marginTop: '400px', opacity: '0.8' });
      if (window.innerWidth <= 768) { instruction.style.fontSize = '16px'; instruction.style.marginTop = '300px'; instruction.style.padding = '0 20px'; instruction.style.textAlign = 'center'; }
      const loadingText = document.createElement('div');
      loadingText.textContent = 'loading...';
      Object.assign(loadingText.style, { fontFamily: 'Poppins, sans-serif', fontSize: '16px', color: '#06BBCC', marginTop: '20px', display: 'none' });
      overlay.appendChild(ball);
      overlay.appendChild(instruction);
      overlay.appendChild(loadingText);
      document.body.appendChild(overlay);
      document.body.style.overflow = 'hidden';

      let ballX = window.innerWidth / 2 - 20; let ballY = window.innerHeight / 2 - 20;
      ball.style.left = `${ballX}px`; ball.style.top = `${ballY}px`;
      let mouseX = ballX; let mouseY = ballY; let isBouncing = false;
      document.addEventListener('mousemove', function (e) { if (isBouncing) return; mouseX = e.clientX - 20; mouseY = e.clientY - 20; });
      function animateBall() { if (isBouncing) return; ballX += (mouseX - ballX) * 0.1; ballY += (mouseY - ballY) * 0.1; ball.style.left = `${ballX}px`; ball.style.top = `${ballY}px`; requestAnimationFrame(animateBall); }
      animateBall();

      let facultyData = null; let schedulesData = null; let emergencyTimer = null;
      startLoading();

      ball.addEventListener('click', function () {
        if (isBouncing) return; isBouncing = true; emergencyTimer = setTimeout(() => revealSite(), 20000);
        instruction.style.display = 'none'; loadingText.style.display = 'block';
        ball.style.transition = 'all 0.3s cubic-bezier(0.42, 0, 0.58, 1)'; ball.style.top = `${window.innerHeight - 60}px`;
        setTimeout(function () {
          ball.style.transition = 'all 0.7s cubic-bezier(0.18, 0.89, 0.32, 1.28)'; ball.style.top = '-100px';
          setTimeout(function () { revealSite(); }, 700);
        }, 300);
      });
      ball.addEventListener('mouseenter', function () { if (!isBouncing) ball.style.transform = 'scale(1.1)'; });
      ball.addEventListener('mouseleave', function () { if (!isBouncing) ball.style.transform = 'scale(1)'; });

      function startLoading() {
        preloadCriticalImages();
        fetch('/get-teachers').then((r) => r.json()).then((d) => { facultyData = d; if (facultyData) displayFaculty(facultyData); }).catch(() => { facultyData = []; });
        fetch('/get-schedules').then((r) => r.json()).then((d) => { schedulesData = d; if (schedulesData) displaySchedules(schedulesData); }).catch(() => { schedulesData = []; });
      }
      function preloadCriticalImages() {
        ['/img/carousel_1.jpg','/img/carousel_2.jpg','/img/carousel_4.jpg','/img/about.jpg'].forEach((src) => { const img = new Image(); img.src = src; });
      }
      function revealSite() {
        if (overlay.dataset.revealing === 'true') return; overlay.dataset.revealing = 'true'; sessionStorage.setItem('visited', 'true');
        if (facultyData?.length) displayFaculty(facultyData); if (schedulesData?.length) displaySchedules(schedulesData);
        overlay.style.transition = 'opacity 0.5s ease'; overlay.style.opacity = '0';
        if (emergencyTimer) clearTimeout(emergencyTimer);
        setTimeout(function () { document.body.removeChild(overlay); document.body.style.overflow = ''; fixVisibilityIssues(); const spinner = document.getElementById('spinner'); spinner && spinner.classList.remove('show'); initUI(); }, 500);
      }
    }
    function displayFaculty(data) {
      const container = document.getElementById('teachers'); if (!container) return; container.innerHTML = '';
      data.forEach((item) => {
        const card = document.createElement('div'); card.className = 'col-lg-4 col-md-6 wow fadeInUp'; card.setAttribute('data-wow-delay', '0.1s');
        card.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden"><img class="img-fluid" src="${item.img}" alt="${item.name}"></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><a class="btn btn-sm-square btn-primary mx-1" href="${item.web}"><i class="fas fa-user"></i></a></div></div><div class="text-center p-4"><h5 class="mb-0">${item.name}</h5><small>${item.designation}</small></div></div>`;
        container.appendChild(card);
      });
    }
    function displaySchedules(data) {
      const container = document.getElementById('schedulesList'); if (!container) return; container.innerHTML = '';
      data.forEach((item) => {
        const scheduleItem = document.createElement('div'); scheduleItem.className = 'testimonial-item text-center';
        scheduleItem.innerHTML = `<h5 class="mb-0">${item.name}</h5><p>${item.day}</p><a href="${item.document}" class="btn btn-primary" target="_blank">View</a>`; container.appendChild(scheduleItem);
      });
    }
    function initUI() {
      if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
        try {
          window.jQuery('#schedulesList').owlCarousel({ autoplay: true, smartSpeed: 1000, center: true, margin: 24, dots: true, loop: true, nav: false, responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } } });
        } catch {}
      }
      if (window.WOW) { try { new window.WOW().init(); } catch {} }
    }
    function fixVisibilityIssues() {
      document.body.style.visibility = 'visible'; document.body.style.opacity = '1';
      document.querySelectorAll('.container, .container-fluid, main, section').forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.display = ''; });
      document.querySelectorAll('.owl-carousel, .owl-carousel-item, .owl-carousel .position-absolute').forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.display = el.classList.contains('position-absolute') ? 'flex' : ''; });
      document.querySelectorAll('.owl-carousel h1, .owl-carousel h5, .owl-carousel p, .owl-carousel a').forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.display = 'block'; });
      document.querySelectorAll('.display-3.text-white').forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.style.display = 'block'; if (el.textContent.includes('Developed for the Students of IT Department')) { el.style.fontWeight = 'bold'; el.style.textShadow = '0 2px 4px rgba(0,0,0,0.3)'; } });
      document.querySelectorAll('.animated').forEach((el) => { el.style.visibility = 'visible'; el.style.opacity = '1'; el.classList.add('visible'); });
    }

    if (!sessionStorage.getItem('visited')) createBallAnimation(); else fixVisibilityIssues();
  }, []);
  return null;
}
