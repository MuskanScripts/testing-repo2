import { useEffect } from 'react';

export default function Subject() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const subject_name = document.getElementById('subName')?.value || '';
    const subject_id = document.getElementById('subID')?.value || '';
    const subjectNameEl = document.getElementById('subject_name'); if (subjectNameEl) subjectNameEl.innerHTML = `${subject_name}`;

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
      const t = event.target; if (!(t instanceof HTMLElement)) return;
      if (t.classList.contains('show-file-details')) {
        const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        set('subjectTitle', t.getAttribute('data-title') || '');
        set('subjectAuther', `<b>Uploaded By: </b>${t.getAttribute('data-author') || ''}`);
        set('subjectTopics', `<b>Topics Covered: </b>${t.getAttribute('data-topics') || ''}`);
        const img = document.getElementById('subjectThumbnail'); if (img) img.setAttribute('src', t.getAttribute('data-thumbnail') || '');
        set('subjectDesc', `<b>Description: </b>${t.getAttribute('data-description') || ''}`);
        document.getElementById('subjectID')?.setAttribute('value', t.getAttribute('data-fileId') || '');
        document.getElementById('subjectFullName')?.setAttribute('value', t.getAttribute('data-fullName') || '');
        set('subjectUpvotes', `<b>Upvotes: </b>${t.getAttribute('data-upvotesCount') || ''}`);
        set('subjectDownvotes', `<b>Downvotes: </b>${t.getAttribute('data-downvotesCount') || ''}`);
        const idx = t.getAttribute('data-index') || '0'; const colorUp = t.getAttribute('data-colorUp') || '#ffffff'; const colorDown = t.getAttribute('data-colorDown') || '#ffffff'; const userStatus = t.getAttribute('data-userStatus') || 'none'; const type = t.getAttribute('data-type') || 'Notes'; const fileId = t.getAttribute('data-fileId') || ''; const fullName = t.getAttribute('data-fullName') || '';
        const buttons = document.getElementById('modal-buttons-subject'); if (buttons) { buttons.innerHTML = `
          <button type="button" id='up_${type}${idx}' class="btn btn-sm-square btn-primary mx-1 upvote-file-btn" data-userStatus="${userStatus}" data-type="${type}" data-fileId="${fileId}" style="color: ${colorUp};"><i class="fa fa-thumbs-up upvote-file-btn" data-type="${type}" style="color: ${colorUp};" id='upv${type}${idx}' data-fileId="${fileId}" data-userStatus="${userStatus}"></i></button>
          <button data-type="${type}" id='down_${type}${idx}' class="btn btn-sm-square btn-primary mx-1 downvote-file-btn" data-fileId="${fileId}" data-userStatus="${userStatus}" style="color: ${colorDown};"><i data-type="${type}" class="fa fa-thumbs-down downvote-file-btn" id='downv${type}${idx}' style="color: ${colorDown};" data-fileId="${fileId}" data-userStatus="${userStatus}"></i></button>
          <button type="button" id="openFileBtn" onclick="openBlobInNewTab('${fileId}')" class="btn btn-primary">Open File</button>
          <button type="button" id="downloadFileBtn" onclick="downloadBlob('${fileId}', '${fullName}')" class="btn btn-primary">Download File</button>
          <button type="button" class="btn btn-secondary" data-bs-dismiss="modal" data-bs-target="#showFileModal" aria-label="Close" id="showFileModalClose">Close</button>`; }
      } else if (t.classList.contains('show-url-details')) {
        const set = (id, html) => { const el = document.getElementById(id); if (el) el.innerHTML = html; };
        set('urlTitle', t.getAttribute('data-title') || ''); set('urlAuther', `<b>Uploaded By: </b>${t.getAttribute('data-author') || ''}`); set('urlTopics', `<b>Topics Covered: </b>${t.getAttribute('data-topics') || ''}`); set('urlUpvotes', `<b>Upvotes: </b>${t.getAttribute('data-upvotesCount') || ''}`); set('urlDownvotes', `<b>Downvotes: </b>${t.getAttribute('data-downvotesCount') || ''}`); set('urlDesc', `<b>Description: </b>${t.getAttribute('data-description') || ''}`);
        const url = t.getAttribute('data-url') || '#'; const type = t.getAttribute('data-type') || 'Others'; const idx = t.getAttribute('data-index') || '0'; const colorUp = t.getAttribute('data-colorUp') || '#ffffff'; const colorDown = t.getAttribute('data-colorDown') || '#ffffff'; const userStatus = t.getAttribute('data-userStatus') || 'none'; const fileId = t.getAttribute('data-fileId') || '';
        const buttons = document.getElementById('modal-buttons-url'); if (buttons) { buttons.innerHTML = `
        <button type=\"button\" data-type=\"${type}\" id='up_${type}${idx}' class=\"btn btn-sm-square btn-primary mx-1 upvote-file-btn\" data-userStatus=\"${userStatus}\" data-fileId=\"${fileId}\" style=\"color: ${colorUp};\"><i data-type=\"${type}\" class=\"fa fa-thumbs-up upvote-file-btn\" style=\"color: ${colorUp};\" id='upv${type}${idx}' data-fileId=\"${fileId}\" data-userStatus=\"${userStatus}\"></i></button>
        <button data-type=\"${type}\" id='down_${type}${idx}' class=\"btn btn-sm-square btn-primary mx-1 downvote-file-btn\" data-fileId=\"${fileId}\" data-userStatus=\"${userStatus}\" style=\"color: ${colorDown};\"><i data-type=\"${type}\" class=\"fa fa-thumbs-down downvote-file-btn\" id='downv${type}${idx}' style=\"color: ${colorDown};\" data-fileId=\"${fileId}\" data-userStatus=\"${userStatus}\"></i></button>
        <a id=\"visitURLBtn\" target=\"_blank\" class=\"btn btn-primary\" href=\"${url}\">Visit</a>
        <button type=\"button\" class=\"btn btn-secondary\" data-bs-dismiss=\"modal\" data-bs-target=\"#showURLModal\" aria-label=\"Close\" id=\"showURLModalClose\">Close</button>`; }
      }
    });

    function dynamicCreate(Files, type) {
      for (let i = 0; i < Files.length; i++) {
        const name = Files[i].name; const id = Files[i].id; const fullName = Files[i].originalFilename; const thumbnail = Files[i].thumbnailLink ? Files[i].thumbnailLink : 'img/preview_thumbnail.png';
        let colorUp = '#ffffff', colorDown = '#ffffff'; if (Files[i].userStatus === 'upvoted') colorUp = '#673AB7'; if (Files[i].userStatus === 'downvoted') colorDown = '#673AB7';
        const fileDiv = document.createElement('div'); fileDiv.className = 'col-lg-2_5 col-md-6 wow fadeInUp'; fileDiv.setAttribute('data-wow-delay', '0.1s');
        fileDiv.innerHTML = `<div class=\"team-item bg-light\"><div class=\"overflow-hidden text-center\"><img class=\"img-fluid click_cursor show-file-details\" id=\"${type}${i}\" data-bs-toggle=\"modal\" data-bs-target=\"#showFileModal\" data-title=\"${name}\" data-thumbnail=\"${thumbnail}\" data-userStatus=\"${Files[i].userStatus}\" data-fileId=\"${Files[i].id}\" data-author=\"${Files[i].properties.fileAuthor}\" data-description=\"${Files[i].description}\" data-topics=\"${Files[i].properties.fileTopics}\" data-upvotesCount=\"${Files[i].upvotesCount}\" data-downvotesCount=\"${Files[i].downvotesCount}\" data-colorUp=\"${colorUp}\" data-colorDown=\"${colorDown}\" data-index=\"${i}\" data-type=\"${type}\" data-extension=\"${Files[i].fileExtension ? Files[i].fileExtension : ''}\" data-fullName=\"${fullName}\" src='${thumbnail}' style=\"margin-top: 5%;\" alt=\"Thumbnail\"></div><div class=\"position-relative d-flex justify-content-center\" style=\"margin-top: -23px;\"><div class=\"bg-light d-flex justify-content-center pt-2 px-1\"><button id='up-${type}${i}' class=\"btn btn-sm-square btn-primary mx-1 upvote-file-btn\" data-type=\"${type}\" data-userStatus=\"${Files[i].userStatus}\" data-fileId=\"${Files[i].id}\" style=\"color: ${colorUp};\"><i class=\"fa fa-thumbs-up upvote-file-btn\" style=\"color: ${colorUp};\" id='upi${type}${i}' data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\"></i></button><button id='down-${type}${i}' class=\"btn btn-sm-square btn-primary mx-1 downvote-file-btn\" data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\" style=\"color: ${colorDown};\"><i class=\"fa fa-thumbs-down downvote-file-btn\" id='downi${type}${i}' style=\"color: ${colorDown};\" data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\"></i></button><button class=\"btn btn-sm-square btn-primary mx-1\" onclick=\"downloadBlob('${id}', '${fullName}')\" target=\"_blank\"><i class=\"fa fa-download \"\"></i></button></div></div><div class=\"text-center p-4\"><hr style=\"margin: 0em\"><small class=\"mb-0\"><b>${name}</b></small></div></div>`;
        const holder = document.getElementById(type); if (holder) { holder.appendChild(fileDiv); holder.appendChild(document.createElement('br')); }
      }
    }

    async function convertYoutubeUrlToEmbed(url) {
      try { const apiUrl = 'https://www.youtube.com/oembed?url=' + url + '&format=json'; const code = await fetch(apiUrl).then((r) => r.json()).then((d) => d.html); return code; } catch (err) { throw err; }
    }
    async function createYTElements(Files) {
      for (let i = 0; i < Files.length; i++) {
        const name = Files[i].name; const url = Files[i].properties.URL; const type = 'YTPlaylist'; let ytlink = await convertYoutubeUrlToEmbed(url); ytlink = ytlink.substring(0, 8) + 'width="500" height="300"' + ytlink.substring(32);
        let colorUp = '#ffffff', colorDown = '#ffffff'; if (Files[i].userStatus === 'upvoted') colorUp = '#673AB7'; if (Files[i].userStatus === 'downvoted') colorDown = '#673AB7';
        const fileDiv = document.createElement('div'); fileDiv.className = 'col-lg-6 col-md-6 wow fadeInUp'; fileDiv.setAttribute('data-wow-delay', '0.1s');
        fileDiv.innerHTML = `<div class=\"team-item bg-light\" style=\"padding-top: 5%\"><div class=\"overflow-hidden text-center\">'${ytlink}'</div><div class=\"position-relative d-flex justify-content-center\" style=\"margin-top: -23px;\"><div class=\"bg-light d-flex justify-content-center pt-2 px-1\"><button id='up-${type}${i}' class=\"btn btn-sm-square btn-primary mx-1 upvote-file-btn\" data-type=\"${type}\" data-userStatus=\"${Files[i].userStatus}\" data-fileId=\"${Files[i].id}\" style=\"color: ${colorUp};\"><i class=\"fa fa-thumbs-up upvote-file-btn\" style=\"color: ${colorUp};\" id='upi${type}${i}' data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\"></i></button><button id='down-${type}${i}' class=\"btn btn-sm-square btn-primary mx-1 downvote-file-btn\" data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\" style=\"color: ${colorDown};\"><i class=\"fa fa-thumbs-down downvote-file-btn\" id='downi${type}${i}' style=\"color: ${colorDown};\" data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\"></i></button><button class=\"btn btn-square btn-primary mx-1 show-url-details\" data-bs-toggle=\"modal\" data-bs-target=\"#showURLModal\" data-title=\"${name}\" data-url=\"${url}\" data-userStatus=\"${Files[i].userStatus}\" data-fileId=\"${Files[i].id}\" data-author=\"${Files[i].properties.fileAuthor}\" data-description=\"${Files[i].description}\" data-topics=\"${Files[i].properties.fileTopics}\" data-upvotesCount=\"${Files[i].upvotesCount}\" data-downvotesCount=\"${Files[i].downvotesCount}\" data-colorUp=\"${colorUp}\" data-colorDown=\"${colorDown}\" data-type=\"${type}\" data-index=\"${i}\"><i class=\"fa fa-info-circle\"></i></button></div></div><div class=\"text-center p-4\"><hr style=\"margin: 0em\"><h2 class=\"mb-0\">${name}</h2></div></div>`;
        const holder = document.getElementById('YTPlaylist'); if (holder) { holder.appendChild(fileDiv); holder.appendChild(document.createElement('br')); }
      }
    }
    async function createOthersElements(Files) {
      for (let i = 0; i < Files.length; i++) {
        const name = Files[i].name; const url = Files[i].properties.URL; const type = 'Others'; let colorUp = '#ffffff', colorDown = '#ffffff'; if (Files[i].userStatus === 'upvoted') colorUp = '#673AB7'; if (Files[i].userStatus === 'downvoted') colorDown = '#673AB7';
        const fileDiv = document.createElement('div'); fileDiv.className = 'row g-4 service-item justify-content-lg-center'; fileDiv.setAttribute('data-wow-delay', '0.1s');
        fileDiv.innerHTML = `<div class=\"col-lg-8 col-sm-8 col-md-8 wow fadeInUp click_cursor\" data-wow-delay=\"0.3s\"><a href=${url} target=\"_blank\"><div class=\" text-left\"><div class=\"p-1\"><h5 class=\"mb-3 ms-5\">${name}</h5></div></div></a></div><div class=\"col-lg-3 col-sm-3 col-md-3 wow fadeInUp\" data-wow-delay=\"0.3s\"><div class=\"d-flex justify-content-center px-1\"><button id='up-${type}${i}' class=\"btn btn-sm-square btn-primary mx-1 upvote-file-btn\" data-type=\"${type}\" data-userStatus=\"${Files[i].userStatus}\" data-fileId=\"${Files[i].id}\" style=\"color: ${colorUp};\"><i class=\"fa fa-thumbs-up upvote-file-btn\" style=\"color: ${colorUp};\" id='upi${type}${i}' data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\"></i></button><button id='down-${type}${i}' class=\"btn btn-sm-square btn-primary mx-1 downvote-file-btn\" data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\" style=\"color: ${colorDown};\"><i class=\"fa fa-thumbs-down downvote-file-btn\" id='downi${type}${i}' style=\"color: ${colorDown};\" data-type=\"${type}\" data-fileId=\"${Files[i].id}\" data-userStatus=\"${Files[i].userStatus}\"></i></button><button class=\"btn btn-square btn-secondary mx-1 show-url-details\" data-bs-toggle=\"modal\" data-bs-target=\"#showURLModal\" data-title=\"${name}\" data-url=\"${url}\" data-userStatus=\"${Files[i].userStatus}\" data-fileId=\"${Files[i].id}\" data-author=\"${Files[i].properties.fileAuthor}\" data-description=\"${Files[i].description}\" data-topics=\"${Files[i].properties.fileTopics}\" data-upvotesCount=\"${Files[i].upvotesCount}\" data-downvotesCount=\"${Files[i].downvotesCount}\" data-colorUp=\"${colorUp}\" data-colorDown=\"${colorDown}\" data-type=\"${type}\" data-index=\"${i}\"><i class=\"fa fa-info-circle\"></i></button></div></div>`;
        const holder = document.getElementById('Others'); if (holder) { holder.appendChild(fileDiv); holder.appendChild(document.createElement('br')); }
      }
    }

    function fetchFiles(subID, type) { fetch(`/get-subFiles?subject=${subID}&type=${type}`, { method: 'GET' }).then((r) => r.json()).then((data) => { const el = document.getElementById(type); if (el) el.innerHTML = ``; dynamicCreate(data, type); }).catch((e) => console.error('Error fetching files:', e)); }
    function fetchYTLinks(subID, type) { fetch(`/get-subFiles?subject=${subID}&type=${type}`, { method: 'GET' }).then((r) => r.json()).then((data) => { const el = document.getElementById('YTPlaylist'); if (el) el.innerHTML = ``; createYTElements(data); }).catch((e) => console.error('Error fetching files:', e)); }
    function fetchOtherLinks(subID, type) { fetch(`/get-subFiles?subject=${subID}&type=${type}`, { method: 'GET' }).then((r) => r.json()).then((data) => { const el = document.getElementById('Others'); if (el) el.innerHTML = ``; createOthersElements(data); }).catch((e) => console.error('Error fetching files:', e)); }

    const openFileBtn = document.getElementById('openFileBtn'); if (openFileBtn) openFileBtn.addEventListener('click', () => { const fileId = document.getElementById('subjectID')?.value; if (fileId) window.openBlobInNewTab(fileId); });
    const downloadFileBtn = document.getElementById('downloadFileBtn'); if (downloadFileBtn) downloadFileBtn.addEventListener('click', () => { const fileId = document.getElementById('subjectID')?.value; const fileName = `${document.getElementById('subjectFullName')?.value}`; if (fileId && fileName) window.downloadBlob(fileId, fileName); });

    fetchFiles(subject_id, 'Notes');
    fetchFiles(subject_id, 'PPT');
    fetchFiles(subject_id, 'BOOKS');
    fetchYTLinks(subject_id, 'YTPlaylist');
    fetchOtherLinks(subject_id, 'Others');
  }, []);
  return null;
}
