import { useEffect } from 'react';

export default function Main() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const $ = window.jQuery;
    if ($) {
      const spinner = function () {
        setTimeout(function () { if ($('#spinner').length > 0) { $('#spinner').removeClass('show'); } }, 1);
      };
      spinner();
      if (window.WOW) new window.WOW().init();
      $(window).scroll(function () {
        if ($(this).scrollTop() > 300) { $('.sticky-top').css('top', '0px'); } else { $('.sticky-top').css('top', '-100px'); }
      });
      const $dropdown = $(".dropdown"), $dropdownToggle = $(".dropdown-toggle"), $dropdownMenu = $(".dropdown-menu"), showClass = "show";
      $(window).on('load resize', function () {
        if (this.matchMedia('(min-width: 992px)').matches) {
          $dropdown.hover(function () { const $this = $(this); $this.addClass(showClass); $this.find($dropdownToggle).attr('aria-expanded', 'true'); $this.find($dropdownMenu).addClass(showClass); }, function () { const $this = $(this); $this.removeClass(showClass); $this.find($dropdownToggle).attr('aria-expanded', 'false'); $this.find($dropdownMenu).removeClass(showClass); });
        } else { $dropdown.off('mouseenter mouseleave'); }
      });
      if ($.fn && $.fn.owlCarousel) {
        $(".header-carousel").owlCarousel({ autoplay: true, smartSpeed: 1500, items: 1, dots: false, loop: true, nav: true, navText: ['<i class="bi bi-chevron-left"></i>', '<i class="bi bi-chevron-right"></i>'] });
        $(".testimonial-carousel").owlCarousel({ autoplay: true, smartSpeed: 1000, center: true, margin: 24, dots: true, loop: true, nav: false, responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } } });
      }
    }

    window.onbeforeunload = function () { window.location.reload(true); const s = document.getElementById('spinner'); if (s) s.classList.add('show'); };

    document.addEventListener('DOMContentLoaded', function () {
      if (typeof window.LazyLoader !== 'undefined') { window.LazyLoader.init(); }
      document.querySelectorAll('img:not([loading])').forEach(function (img) { if (!img.hasAttribute('loading')) img.setAttribute('loading', 'lazy'); });
      window.applyLazyLoading = function (container) {
        if (typeof window.LazyLoader !== 'undefined') { window.LazyLoader.apply(container); } else {
          if (container) { container.querySelectorAll('img:not([loading])').forEach(function (img) { img.setAttribute('loading', 'lazy'); }); }
        }
      };
    });
  }, []);
  return null;
}
