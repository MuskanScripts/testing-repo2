import { useEffect } from 'react';

export default function Faculty() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    window.show_contact = function (id1, id2) {
      const a = document.getElementById(id1);
      const b = document.getElementById(id2);
      if (!a || !b) return;
      const isBlock = a.style.display === 'block';
      a.style.display = isBlock ? 'none' : 'block';
      b.style.display = isBlock ? 'none' : 'block';
    };

    function fetchFacultyAndRender() {
      const teachers = document.getElementById('teachers');
      if (!teachers) return;
      fetch('/get-faculty-list')
        .then((r) => r.json())
        .then((data) => {
          teachers.innerHTML = '';
          for (let i = 0; i < data.length; i++) {
            const facultyDiv = document.createElement('div');
            facultyDiv.className = 'col-lg-3 col-md-6 wow fadeInUp';
            facultyDiv.setAttribute('data-wow-delay', '0.1s');
            facultyDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden"><a target="_blank" href='${data[i].properties.facultyProfile}'><img class="img-fluid-faculty" src='${data[i].thumbnailLink}' alt="No Image Found!"></a></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><span class="btn btn-faculty-wide btn-primary mx-1" onclick="show_contact('${'mail_faculty_' + (i + 1).toString()}','${'phone_faculty_' + (i + 1).toString()}')"><i class="fa fa-envelope">&nbsp;CONTACT</i></span></div></div><div class="contact-info-container"><div class="text-center team-contact" id='${'mail_faculty_' + (i + 1).toString()}'><i class="fa fa-envelope">&nbsp;</i><small>${data[i].name}</small></div><div class="text-center team-contact" id='${'phone_faculty_' + (i + 1).toString()}'><i class="fa fa-phone">&nbsp;</i><small>${data[i].properties.facultyContact}</small></div></div><div class="text-center p-4"><h5 class="mb-0">${data[i].properties.facultyName}</h5><small>${data[i].properties.facultyRole}</small></div></div>`;
            teachers.appendChild(facultyDiv);
            teachers.appendChild(document.createElement('br'));
          }
        })
        .catch((e) => console.error('Error fetching data:', e));
    }

    function fetchScheduleAndRender() {
      const schedulesList = document.getElementById('schedulesList');
      if (!schedulesList) return;
      fetch('/get-schedule-list')
        .then((r) => r.json())
        .then((data) => {
          if (window.jQuery && window.jQuery('.testimonial-carousel').data('owl.carousel')) {
            window.jQuery('.testimonial-carousel').owlCarousel('destroy');
          }
          schedulesList.innerHTML = '';
          data.forEach((file) => {
            const schedule = document.createElement('div');
            schedule.classList.add('testimonial-item', 'text-center', 'zoom_in_cursor');
            schedule.innerHTML = `
                    <img class="border p-2 mx-auto mb-3" src='${file.thumbnailLink}' onclick="model_img('${file.thumbnailLink}')" alt="schedule image">
                    <h5 class="mb-0">${file.name}</h5>`;
            schedulesList.appendChild(schedule);
          });
          if (window.jQuery && window.jQuery.fn && window.jQuery.fn.owlCarousel) {
            window.jQuery('.testimonial-carousel').owlCarousel({ autoplay: true, smartSpeed: 1000, center: true, margin: 24, dots: true, loop: true, nav: false, responsive: { 0: { items: 1 }, 768: { items: 2 }, 992: { items: 3 } } });
          }
        })
        .catch((e) => console.error('Error fetching data:', e));
    }

    window.model_img = function (src) {
      const model = document.getElementById('myModel');
      const modelImg = document.getElementById('img01');
      if (!model || !modelImg) return;
      model.style.display = 'block';
      modelImg.src = src;
    };
    const span = document.getElementsByClassName('close')[0];
    if (span) span.onclick = function () { const model = document.getElementById('myModel'); if (model) model.style.display = 'none'; };
    const model = document.getElementById('myModel');
    if (model) model.onclick = function () { model.style.display = 'none'; };

    fetchScheduleAndRender();
    fetchFacultyAndRender();
  }, []);
  return null;
}
