import { useEffect } from 'react';

export default function Lazyload() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    (function () {
      'use strict';
      const lazyElements = [];
      const observerOptions = { root: null, rootMargin: '50px 0px', threshold: 0.01 };
      function handleIntersection(entries, observer) {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const element = entry.target;
            if (element.tagName.toLowerCase() === 'img') loadImage(element);
            else if (element.tagName.toLowerCase() === 'video') loadVideo(element);
            else if (element.tagName.toLowerCase() === 'iframe') loadIframe(element);
            else if (element.classList.contains('pdf-preview')) loadPdfPreview(element);
            observer.unobserve(element);
            const index = lazyElements.indexOf(element);
            if (index !== -1) lazyElements.splice(index, 1);
          }
        });
      }
      function loadImage(img) { const src = img.dataset.src; if (src) { img.src = src; img.removeAttribute('data-src'); img.classList.add('loaded'); } }
      function loadVideo(video) {
        const src = video.dataset.src; if (src) {
          if (video.dataset.poster) { video.poster = video.dataset.poster; video.removeAttribute('data-poster'); }
          const sources = video.querySelectorAll('source[data-src]');
          sources.forEach((source) => { source.src = source.dataset.src; source.removeAttribute('data-src'); });
          if (sources.length === 0 && src) { video.src = src; video.removeAttribute('data-src'); }
          video.load(); video.classList.add('loaded');
        }
      }
      function loadIframe(iframe) { const src = iframe.dataset.src; if (src) { iframe.src = src; iframe.removeAttribute('data-src'); iframe.classList.add('loaded'); } }
      function loadPdfPreview(element) { const src = element.dataset.pdfSrc; if (src) { const iframe = document.createElement('iframe'); iframe.src = src; iframe.className = 'pdf-iframe'; element.appendChild(iframe); element.removeAttribute('data-pdf-src'); element.classList.add('loaded'); } }
      function initLazyLoading() {
        if ('IntersectionObserver' in window) {
          const observer = new IntersectionObserver(handleIntersection, observerOptions);
          const candidates = document.querySelectorAll('img[data-src], video[data-src], iframe[data-src], .pdf-preview[data-pdf-src], .lazy-load');
          candidates.forEach((element) => { observer.observe(element); lazyElements.push(element); });
        } else { loadAllLazyElements(); }
      }
      function loadAllLazyElements() {
        document.querySelectorAll('img[data-src]').forEach(loadImage);
        document.querySelectorAll('video[data-src]').forEach(loadVideo);
        document.querySelectorAll('iframe[data-src]').forEach(loadIframe);
        document.querySelectorAll('.pdf-preview[data-pdf-src]').forEach(loadPdfPreview);
      }
      function applyLazyLoading(element) {
        if (!element) return;
        if (element.nodeType === 1) { addLazyElementToObserver(element); }
        else if (element.querySelectorAll) {
          const candidates = element.querySelectorAll('img[data-src], video[data-src], iframe[data-src], .pdf-preview[data-pdf-src], .lazy-load');
          candidates.forEach(addLazyElementToObserver);
        }
      }
      function addLazyElementToObserver(element) {
        if ('IntersectionObserver' in window && !element.classList.contains('loaded')) {
          const observer = new IntersectionObserver(handleIntersection, observerOptions);
          observer.observe(element); lazyElements.push(element);
        } else {
          if (element.tagName.toLowerCase() === 'img') loadImage(element);
          else if (element.tagName.toLowerCase() === 'video') loadVideo(element);
          else if (element.tagName.toLowerCase() === 'iframe') loadIframe(element);
          else if (element.classList.contains('pdf-preview')) loadPdfPreview(element);
        }
      }
      document.addEventListener('DOMContentLoaded', initLazyLoading);
      window.LazyLoader = { init: initLazyLoading, apply: applyLazyLoading };
    })();
  }, []);
  return null;
}
