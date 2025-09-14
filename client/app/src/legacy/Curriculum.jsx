import { useEffect } from 'react';

export default function Curriculum() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const semesterList = document.getElementById('semester-list');
    if (!semesterList) return;
    if (semesterList.children.length === 0) {
      fetch('/get-academics-sem-list', { method: 'GET' })
        .then((r) => r.json())
        .then((data) => {
          data.forEach((item) => {
            const element = document.createElement('div');
            element.classList.add('col-lg-3', 'col-sm-6', 'fadeInUp', 'wow');
            element.setAttribute('data-wow-delay', '0.3s');
            element.innerHTML = `<div class="service-item text-center pt-3 click_cursor" onclick="redirectToSemester('${item.name}')"><div class="p-4"><h5 class="mb-3">${item.name}</h5></div></div>`;
            semesterList.appendChild(element);
          });
        })
        .catch((e) => console.error('Error fetching academics menu:', e));
    }
  }, []);
  return null;
}
