import { useEffect } from 'react';

export default function Semester() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const semester_no = document.getElementById('semName')?.value || new URLSearchParams(window.location.search).get('sem') || '';
    let sebjectList = [];
    try { sebjectList = JSON.parse(document.getElementById('sebjectList')?.value || '[]'); } catch { sebjectList = []; }
    const semNameEl = document.getElementById('semester_name'); if (semNameEl) semNameEl.innerHTML = String(semester_no);

    window.downloadBlob = function (fileID, fileName) {
      const link = document.createElement('a'); link.href = `/downloadFile?fileId=${fileID}`; link.download = fileName; link.style.display = 'none'; link.setAttribute('target', '_blank'); document.body.appendChild(link); link.click(); document.body.removeChild(link);
      const msg = document.getElementById('download_message'); if (msg) { msg.innerHTML = `<b>Starting Download ...</b>`; setTimeout(() => { msg.innerHTML = ``; }, 3000); }
    };
    window.openBlobInNewTab = function (fileID) { window.open(`/downloadFile?fileId=${fileID}`, '_blank'); };

    async function post(path, body) { return fetch(path, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) }); }
    window.removeUpvote = (fileID) => post('/file/remove-upvote', { fileId: fileID });
    window.removeDownvote = (fileID) => post('/file/remove-downvote', { fileId: fileID });
    window.upvoteFile = (fileID) => post('/file/upvote', { fileId: fileID });
    window.downvoteFile = (fileID) => post('/file/downvote', { fileId: fileID });

    document.addEventListener('click', async function (event) {
      const t = event.target;
      if (!(t instanceof HTMLElement)) return;
      if (t.classList.contains('show-file-details')) {
        const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        set('PYQsTitle', t.getAttribute('data-title') || '');
        set('PYQsAuther', `<b>Uploaded By: </b>${t.getAttribute('data-author') || ''}`);
        set('PYQsTopics', `<b>Topics Covered: </b>${t.getAttribute('data-topics') || ''}`);
        const img = document.getElementById('PYQsThumbnail'); if (img) img.setAttribute('src', t.getAttribute('data-thumbnail') || '');
        set('PYQsDesc', `<b>Description: </b>${t.getAttribute('data-description') || ''}`);
        document.getElementById('PYQsID')?.setAttribute('value', t.getAttribute('data-fileId') || '');
        document.getElementById('PYQsExtension')?.setAttribute('value', t.getAttribute('data-extension') || '');
        set('PYQsUpvotes', `<b>Upvotes: </b>${t.getAttribute('data-upvotesCount') || ''}`);
        set('PYQsDownvotes', `<b>Downvotes: </b>${t.getAttribute('data-downvotesCount') || ''}`);
        const idx = t.getAttribute('data-index') || '0';
        const colorUp = t.getAttribute('data-colorUp') || '#ffffff';
        const colorDown = t.getAttribute('data-colorDown') || '#ffffff';
        const userStatus = t.getAttribute('data-userStatus') || 'none';
        const fileId = t.getAttribute('data-fileId') || '';
        const fullName = t.getAttribute('data-fullName') || '';
        const buttons = document.getElementById('modal-buttons');
        if (buttons) {
          buttons.innerHTML = `
          <button type="button" id='up_${idx}' class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-userStatus="${userStatus}" data-fileId="${fileId}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${colorUp};" id='upv${idx}' data-fileId="${fileId}" data-userStatus="${userStatus}"></i></button>
          <button id='down_${idx}' class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-fileId="${fileId}" data-userStatus="${userStatus}" style="color: ${colorDown};"><i class="fa fa-thumbs-down downvote-file-btn" id='downv${idx}' style="color: ${colorDown};" data-fileId="${fileId}" data-userStatus="${userStatus}"></i></button>
          <button type="button" id="openFileBtn" onclick="openBlobInNewTab('${fileId}')" class="btn btn-primary">Open File</button>
          <button type="button" id="downloadFileBtn" onclick="downloadBlob('${fileId}', '${fullName}')" class="btn btn-primary">Download File</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="#showFileModal" aria-label="Close" id="showFileModalClose">Close</button>`;
        }
      }
    });

    function pyqsCreate(pyqFiles) {
      for (let i = 0; i < pyqFiles.length; i++) {
        const name = pyqFiles[i].name; const id = pyqFiles[i].id; const fullName = `${name}${pyqFiles[i].fileExtension ? pyqFiles[i].fileExtension : ''}`; const thumbnail = pyqFiles[i].thumbnailLink ? pyqFiles[i].thumbnailLink : 'img/preview_thumbnail.png';
        const pyqDiv = document.createElement('div');
        let colorUp = '#ffffff', colorDown = '#ffffff';
        if (pyqFiles[i].userStatus === 'upvoted') colorUp = '#673AB7';
        if (pyqFiles[i].userStatus === 'downvoted') colorDown = '#673AB7';
        pyqDiv.className = 'col-lg-2_5 col-md-6 wow fadeInUp';
        pyqDiv.setAttribute('data-wow-delay', '0.1s');
        pyqDiv.innerHTML = `<div class="team-item bg-light"><div class="overflow-hidden text-center"><img class="img-fluid click_cursor show-file-details" id="pyq_${i}" data-bs-toggle="modal" data-bs-target="#showFileModal" data-title="${name}" data-thumbnail="${thumbnail}" data-userStatus="${pyqFiles[i].userStatus}" data-fileId="${pyqFiles[i].id}" data-author="${pyqFiles[i].properties.fileAuthor}" data-description="${pyqFiles[i].description}" data-topics="${pyqFiles[i].properties.fileTopics}" data-upvotesCount="${pyqFiles[i].upvotesCount}" data-downvotesCount="${pyqFiles[i].downvotesCount}" data-colorUp="${colorUp}" data-colorDown="${colorDown}" data-index="${i}" data-fullName="${fullName}" data-extension="${pyqFiles[i].fileExtension ? pyqFiles[i].fileExtension : ''}" src='${thumbnail}' style="margin-top: 5%;" alt="Thumbnail"></div><div class="position-relative d-flex justify-content-center" style="margin-top: -23px;"><div class="bg-light d-flex justify-content-center pt-2 px-1"><button id='up-${i}' class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-userStatus="${pyqFiles[i].userStatus}" data-fileId="${pyqFiles[i].id}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" style="color: ${colorUp};" id='upi${i}' data-fileId="${pyqFiles[i].id}" data-userStatus="${pyqFiles[i].userStatus}"></i></button><button id='down-${i}' class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-fileId="${pyqFiles[i].id}" data-userStatus="${pyqFiles[i].userStatus}" style="color: ${colorDown};"><i class="fa fa-thumbs-down downvote-file-btn" id='downi${i}' style="color: ${colorDown};" data-fileId="${pyqFiles[i].id}" data-userStatus="${pyqFiles[i].userStatus}"></i></button><button class="btn btn-sm-square btn-primary mx-1" onclick="downloadBlob('${id}', '${fullName}')" target="_blank"><i class="fa fa-download "></i></button></div></div><div class="text-center p-4"><hr style="margin: 0em"><small class="mb-0"><b>${name}</b></small></div></div>`;
        const holder = document.getElementById('pyqs'); if (holder) { holder.appendChild(pyqDiv); holder.appendChild(document.createElement('br')); }
      }
    }

    function DynamicCreatePYQs() {
      fetch(`/get-pyqs?sem=${encodeURIComponent(String(semester_no))}`, { method: 'GET' })
        .then((r) => r.json())
        .then((data) => { const el = document.getElementById('pyqs'); if (el) el.innerHTML = ``; pyqsCreate(data); })
        .catch((e) => console.error('Error fetching academics menu:', e));
    }

    function redirectToSubject(subject, subID) {
      const spin = document.getElementById('spinner'); if (spin && window.jQuery) window.jQuery('#spinner').addClass('show');
      const id = document.getElementById('subIDSend'); const name = document.getElementById('subNameSend'); if (id) id.value = subID; if (name) name.value = subject; const form = document.getElementById('subjectForm'); if (form) { form.setAttribute('action', '/subject'); form.submit(); }
    }
    window.redirectToSubject = redirectToSubject;

    const openFileBtn = document.getElementById('openFileBtn'); if (openFileBtn) openFileBtn.addEventListener('click', () => { const fileId = document.getElementById('PYQsID')?.value; if (fileId) window.openBlobInNewTab(fileId); });
    const downloadFileBtn = document.getElementById('downloadFileBtn'); if (downloadFileBtn) downloadFileBtn.addEventListener('click', () => { const fileId = document.getElementById('PYQsID')?.value; const fileName = `${document.getElementById('PYQsTitle')?.textContent}${document.getElementById('PYQsExtension')?.value}`; if (fileId && fileName) window.downloadBlob(fileId, fileName); });

    const Labs = []; const Subjects = [];
    for (let i = 0; i < sebjectList.length; i++) { const title = sebjectList[i].name; if (title.slice(-3) === 'Lab') Labs.push([title, sebjectList[i].id]); else if (title !== 'Previous Year Exams') Subjects.push([title, sebjectList[i].id]); }
    const subjectsDiv = document.getElementById('subjects'); const labsDiv = document.getElementById('lab_subjects');
    for (let i = 0; i < Subjects.length; i++) { const subject = Subjects[i][0]; const subID = Subjects[i][1]; const subjectDiv = document.createElement('div'); subjectDiv.className = 'row g-4 justify-content-lg-center'; subjectDiv.innerHTML = `<div class="col-lg-10 col-sm-12 wow fadeInUp" data-wow-delay="0.3s"><div class="service-item text-left click_cursor pt-3" onclick="redirectToSubject('${subject}', '${subID}')"><div class="p-1"><h5 class="mb-3 ms-5">${subject}</h5></div></div></div>`; subjectsDiv?.appendChild(subjectDiv); subjectsDiv?.appendChild(document.createElement('br')); }
    for (let i = 0; i < Labs.length; i++) { const subject = Labs[i][0]; const subID = Labs[i][1]; const subjectDiv = document.createElement('div'); subjectDiv.className = 'row g-4 justify-content-lg-center'; subjectDiv.innerHTML = `<div class="col-lg-10 col-sm-12 wow fadeInUp" data-wow-delay="0.3s"><div class="service-item text-left click_cursor pt-3" onclick="redirectToSubject('${subject}', '${subID}')"><div class="p-1"><h5 class="mb-3 ms-5">${subject}</h5></div></div></div>`; labsDiv?.appendChild(subjectDiv); labsDiv?.appendChild(document.createElement('br')); }

    DynamicCreatePYQs();
  }, []);
  return null;
}
