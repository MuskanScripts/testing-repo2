import { useEffect } from 'react';

export default function Admin() {
  useEffect(() => {
    if (typeof document === 'undefined') return;

    const allUsers = JSON.parse(document.getElementById('allUsersList')?.value || '[]');
    const privilegedUsers = JSON.parse(document.getElementById('privilegedUsersList')?.value || '[]');
    const allUsersTableBody = document.getElementById('allUsersTableBody');
    const privilegedUsersTableBody = document.getElementById('privilegedUsersTableBody');
    const directoryLevel1TableBody = document.getElementById('directoryTreeLevel1');
    const directoryLevel2TableBody = document.getElementById('directoryTreeLevel2');
    const directoryLevel3TableBody = document.getElementById('directoryTreeLevel3');
    const searchInputPrivilegedUsers = document.getElementById('searchInputPrivilegedUsers');
    const searchInputAllUsers = document.getElementById('searchInputAllUsers');
    const addSubjectsToSemester = document.getElementById('addSubjectsToSemester');
    const SubjectsTableHeading = document.getElementById('SubjectsTableHeading');
    const fileUploadForm = document.getElementById('fileUploadForm');
    const facultyUploadForm = document.getElementById('facultyUploadForm');
    const scheduleListForDelete = document.getElementById('scheduleListForDelete');
    const facultyListForDelete = document.getElementById('facultyListForDelete');

    function submitForm(form, formData, type) {
      const xhr = new XMLHttpRequest();
      xhr.open('POST', form.getAttribute('action'));
      xhr.onload = function () {
        if (xhr.status === 200) {
          document.getElementById('ShowalertManagementModal')?.click();
          const body = document.getElementById('alertModalBody');
          if (body) body.innerHTML = `<div class="alert alert-success d-flex align-items-center" role="alert">
            <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:">
                <use xlink:href="#check-circle-fill" />
            </svg>
            <div>File Uploaded Successfully !!!</div>
          </div>`;
          setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
          if (type === 'schedule') {
            resetTimetableOrFacultyView(scheduleListForDelete);
            fetchTimetableAndRender();
          }
          if (type === 'faculty') {
            resetTimetableOrFacultyView(facultyListForDelete);
            fetchFacultyAndRender();
          }
        } else {
          document.getElementById('ShowalertManagementModal')?.click();
          const body = document.getElementById('alertModalBody');
          if (body) body.innerHTML = `<div class="alert alert-warning d-flex align-items-center" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>Upload Failed: ${xhr.statusText}</div>
            </div>`;
          setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
        }
      };
      xhr.onerror = function () {
        document.getElementById('ShowalertManagementModal')?.click();
        const body = document.getElementById('alertModalBody');
        if (body) body.innerHTML = `<div class="alert alert-warning d-flex align-items-center" role="alert">
                <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:">
                    <use xlink:href="#exclamation-triangle-fill" />
                </svg>
                <div>Upload Failed: Network error occurred</div>
            </div>`;
        setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
      };
      xhr.send(formData);
    }

    function submitUploadForm() {
      if (!fileUploadForm) return;
      const form = fileUploadForm;
      const formData = new FormData(form);
      document.getElementById('uploadFileModal')?.click();
      submitForm(form, formData, 'schedule');
    }
    function submitFacultyUploadForm() {
      if (!facultyUploadForm) return;
      const form = facultyUploadForm;
      const formData = new FormData(form);
      document.getElementById('uploadFacultyModal')?.click();
      submitForm(form, formData, 'faculty');
    }

    function fetchShemaAndRender() {
      fetch('/admin/academic_schema')
        .then((r) => r.json())
        .then((data) => {
          renderschemaLevel1(data);
        })
        .catch(console.error);
    }
    function resetSchemaView() {
      if (!directoryLevel1TableBody) return;
      directoryLevel1TableBody.innerHTML = `<tr>
    <td><div class="d-flex justify-content-center"><div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div></div></td>
    <td><div class="d-flex justify-content-center"><div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div></div></td>
    <td><div class="d-flex justify-content-center"><div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div></div></td>
</tr>`;
      if (SubjectsTableHeading) SubjectsTableHeading.innerHTML = 'Manage Subjects';
      if (directoryLevel2TableBody) directoryLevel2TableBody.innerHTML = '';
      if (addSubjectsToSemester) addSubjectsToSemester.innerHTML = '';
    }
    function resetTimetableOrFacultyView(element) {
      if (!element) return;
      element.innerHTML = `<tr>
    <td><div class="d-flex justify-content-center"><div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div></div></td>
    <td><div class="d-flex justify-content-center"><div class="spinner-grow text-primary" role="status"><span class="sr-only">Loading...</span></div></div></td>
</tr>`;
    }
    function fetchTimetableAndRender() {
      if (!scheduleListForDelete) return;
      fetch('/admin/fetch-schedule')
        .then((r) => r.json())
        .then((data) => {
          scheduleListForDelete.innerHTML = '';
          data.forEach((file) => {
            const row = document.createElement('tr');
            row.innerHTML = `<td>${file.name}</td><td style="text-align: center;"><button type="button" class="btn btn-danger delete-schedule-btn" data-directory-id="${file.id}">Delete</button></td>`;
            scheduleListForDelete.appendChild(row);
          });
        })
        .catch(console.error);
    }
    function renderFacultyTable(facultyData) {
      const tbody = document.querySelector('#facultyTable tbody');
      if (!tbody) return;
      tbody.innerHTML = '';
      facultyData.forEach((faculty) => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td><img src="${faculty.thumbnailLink || ''}" alt="${faculty.properties.facultyName}" class="rounded-circle" width="50" height="50"></td>
            <td>${faculty.properties.facultyName}</td>
            <td>${faculty.properties.facultyEmail}</td>
            <td>${faculty.properties.facultyRole}</td>
            <td>
                <button class="btn btn-sm btn-primary update-faculty-btn" data-faculty-id="${faculty.id}" data-faculty-name="${faculty.properties.facultyName}" data-faculty-email="${faculty.properties.facultyEmail}" data-faculty-role="${faculty.properties.facultyRole}" data-faculty-contact="${faculty.properties.facultyContact}" data-faculty-profile="${faculty.properties.facultyProfile || ''}">Update</button>
                <button class="btn btn-sm btn-danger delete-faculty-btn" data-faculty-id="${faculty.id}">Delete</button>
            </td>`;
        tbody.appendChild(tr);
      });
      attachUpdateEventListeners();
    }
    function fetchFacultyAndRender() {
      fetch('/admin/fetch-faculty')
        .then((r) => {
          if (!r.ok) throw new Error('Failed to fetch faculty data');
          return r.json();
        })
        .then((data) => {
          renderFacultyTable(data);
          if (facultyListForDelete) {
            facultyListForDelete.innerHTML = '';
            data.forEach((file) => {
              const row = document.createElement('tr');
              row.innerHTML = `
                    <td>${file.properties?.facultyName || file.name}</td>
                    <td style="text-align: center;"><div class="btn-group" role="group" style="gap: 35px;">
                        <button type="button" class="btn btn-primary update-faculty-btn" data-faculty-id="${file.id}" data-faculty-name="${file.properties?.facultyName || ''}" data-faculty-email="${file.properties?.facultyEmail || file.name}" data-faculty-role="${file.properties?.facultyRole || ''}" data-faculty-contact="${file.properties?.facultyContact || ''}" data-faculty-profile="${file.properties?.facultyProfile || ''}">Update</button>
                        <button type="button" class="btn btn-danger delete-faculty-btn" data-directory-id="${file.id}">Delete</button>
                    </div></td>`;
              facultyListForDelete.appendChild(row);
            });
            attachUpdateEventListeners();
          }
        })
        .catch((error) => {
          console.error('Error fetching faculty data:', error);
          document.getElementById('ShowalertManagementModal')?.click();
          const body = document.getElementById('alertModalBody');
          if (body)
            body.innerHTML = `<div class="alert alert-danger d-flex align-items-center" role="alert">
                    <svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Danger:">
                        <use xlink:href="#exclamation-triangle-fill" />
                    </svg>
                    <div>Error loading faculty data: ${error.message}</div>
                </div>`;
        });
    }
    function renderschemaLevel1(academic_schema) {
      if (!directoryLevel1TableBody) return;
      directoryLevel1TableBody.innerHTML = '';
      academic_schema.forEach((directory) => {
        const row = document.createElement('tr');
        row.style.cursor = 'pointer';
        row.addEventListener('click', function () {
          renderschemaLevel2(directory.name, directory.id, directory.children);
        });
        row.innerHTML = `
            <td>${directory.name}</td>
            <td style="text-align: center;"><button type="button" class="btn btn-primary rename-semsub-btn" data-bs-toggle="modal" data-bs-target="#schemaManagementModal" data-semsub-type="sem" data-semsub-id="${directory.id}">Rename</button></td>
            <td style="text-align: center;"><button type="button" class="btn btn-danger delete-directory-btn" data-directory-id="${directory.id}">Delete</button></td>`;
        directoryLevel1TableBody.appendChild(row);
      });
    }
    function renderschemaLevel2(semesterName, semesterID, subjects) {
      if (!directoryLevel2TableBody || !SubjectsTableHeading || !addSubjectsToSemester) return;
      directoryLevel2TableBody.innerHTML = '';
      SubjectsTableHeading.innerHTML = `Manage Subjects from ${semesterName}`;
      addSubjectsToSemester.innerHTML = `<button type="button" class="btn btn-warning add-subject-btn" data-bs-toggle="modal" data-bs-target="#schemaManagementModal" data-semsub-type="sub" data-semsub-id="${semesterID}">Add Subjects</button>`;
      subjects.forEach((subject) => {
        if (subject.name !== 'Previous Year Exams') {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${subject.name}</td>
            <td style="text-align: center;"><button type="button" class="btn btn-primary rename-semsub-btn" data-bs-toggle="modal" data-bs-target="#schemaManagementModal" data-semsub-type="sub" data-semsub-id="${subject.id}">Rename</button></td>
            <td style="text-align: center;"><button type="button" class="btn btn-danger delete-directory-btn" data-directory-id="${subject.id}">Delete</button></td>`;
          directoryLevel2TableBody.appendChild(row);
        }
      });
    }
    function renderPrivilegedUsers(users) {
      if (!privilegedUsersTableBody) return;
      privilegedUsersTableBody.innerHTML = '';
      users.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${user.username}</td>
                <td style="text-align: center;">
                    <form action="/admin/remove-privileged-access?_method=PUT" method="POST" onsubmit="return confirm('Are you sure you want to remove privileged access from this user?');">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="userToRemoveAccess" value="${user._id}">
                        <button type="submit" class="btn btn-primary">Revoke Access</button>
                    </form>
                </td>
                <td style="text-align: center;">
                    <form action="/admin/remove-user?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to remove this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="userToBeRemoved" value="${user._id}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>`;
        privilegedUsersTableBody.appendChild(row);
      });
    }
    function renderAllUsers(users) {
      if (!allUsersTableBody) return;
      allUsersTableBody.innerHTML = '';
      users.forEach((user) => {
        const row = document.createElement('tr');
        row.innerHTML = `
                <td>${user.username}</td>
                <td style="text-align: center;">
                    <form action="/admin/provide-privileged-access?_method=PUT" method="POST" onsubmit="return confirm('Are you sure you want to provide privileged access to this user?');">
                    <input type="hidden" name="_method" value="PUT">
                    <input type="hidden" name="userToProvideAccess" value="${user._id}">
                    <button type="submit" class="btn btn-primary">Provide Access</button>
                    </form>
                </td>
                <td style="text-align: center;">
                    <form action="/admin/remove-user?_method=DELETE" method="POST" onsubmit="return confirm('Are you sure you want to remove this user?');">
                    <input type="hidden" name="_method" value="DELETE">
                    <input type="hidden" name="userToBeRemoved" value="${user._id}">
                        <button type="submit" class="btn btn-danger">Delete</button>
                    </form>
                </td>`;
        allUsersTableBody.appendChild(row);
      });
    }

    function openUpdateFacultyModal(facultyId, name, email, role, contact, profile) {
      const idField = document.getElementById('update-faculty-id');
      const nameField = document.getElementById('update-faculty-name');
      const emailField = document.getElementById('update-faculty-email');
      const roleField = document.getElementById('update-faculty-role');
      const contactField = document.getElementById('update-faculty-contact');
      const profileField = document.getElementById('update-faculty-profile');
      if (!idField) return;
      idField.value = facultyId;
      if (nameField) nameField.value = name;
      if (emailField) emailField.value = email;
      if (roleField) roleField.value = role;
      if (contactField) contactField.value = contact;
      if (profileField) profileField.value = profile || '';
      const fileInput = document.getElementById('update-faculty-file');
      if (fileInput) fileInput.value = '';
      if (window.bootstrap) {
        const updateModal = new window.bootstrap.Modal(document.getElementById('updateFacultyModal'));
        updateModal.show();
      }
    }
    function showAlert(message, type) {
      document.getElementById('ShowalertManagementModal')?.click();
      const body = document.getElementById('alertModalBody');
      if (body)
        body.innerHTML = `
        <div class="alert alert-${type} d-flex align-items-center" role="alert">
            ${type === 'info' ? `<div class=\"spinner-grow spinner-grow-sm me-2 text-primary\" role=\"status\"><span class=\"visually-hidden\">Loading...</span></div>` : `<svg class=\"bi flex-shrink-0 me-2\" width=\"24\" height=\"24\" role=\"img\" aria-label=\"${type === 'success' ? 'Success' : 'Warning'}:\"><use xlink:href=\"#${type === 'success' ? 'check-circle-fill' : 'exclamation-triangle-fill'}\" /></svg>`}
            <div>${message}</div>
        </div>`;
    }
    function handleUpdateFaculty(event) {
      const button = event.target.closest('.update-faculty-btn');
      if (!button) return;
      const facultyId = button.getAttribute('data-faculty-id');
      const facultyName = button.getAttribute('data-faculty-name');
      const facultyEmail = button.getAttribute('data-faculty-email');
      const facultyRole = button.getAttribute('data-faculty-role');
      const facultyContact = button.getAttribute('data-faculty-contact');
      const facultyProfile = button.getAttribute('data-faculty-profile');
      openUpdateFacultyModal(facultyId, facultyName, facultyEmail, facultyRole, facultyContact, facultyProfile);
    }
    function attachUpdateEventListeners() {
      document.querySelectorAll('.update-faculty-btn').forEach((button) => {
        button.removeEventListener('click', handleUpdateFaculty);
        button.addEventListener('click', handleUpdateFaculty);
      });
    }
    function submitFacultyUpdateForm() {
      const facultyId = document.getElementById('update-faculty-id')?.value;
      if (!facultyId) {
        showAlert('Error: Faculty ID is missing!', 'danger');
        return;
      }
      const formData = new FormData();
      const name = document.getElementById('update-faculty-name')?.value || '';
      const email = document.getElementById('update-faculty-email')?.value || '';
      const role = document.getElementById('update-faculty-role')?.value || '';
      const contact = document.getElementById('update-faculty-contact')?.value || '';
      const profile = document.getElementById('update-faculty-profile')?.value || '';
      formData.append('facultyName', name);
      formData.append('facultyEmail', email);
      formData.append('facultyRole', role);
      formData.append('facultyContact', contact);
      formData.append('facultyProfile', profile);
      const fileInput = document.getElementById('update-faculty-file');
      if (fileInput && fileInput.files.length > 0) {
        formData.append('file', fileInput.files[0]);
      }
      showAlert('Updating faculty information...', 'info');
      fetch(`/admin/update-faculty/${facultyId}`, { method: 'POST', body: formData })
        .then((response) => {
          if (!response.ok) {
            return response.text().then((text) => {
              try {
                const err = JSON.parse(text);
                throw new Error(err.error || 'Failed to update faculty');
              } catch (e) {
                throw new Error(text || 'Failed to update faculty');
              }
            });
          }
          return response.json();
        })
        .then(() => {
          showAlert('Faculty updated successfully!', 'success');
          if (window.bootstrap) {
            const updateModal = window.bootstrap.Modal.getInstance(document.getElementById('updateFacultyModal'));
            updateModal && updateModal.hide();
          }
          setTimeout(() => fetchFacultyAndRender(), 500);
        })
        .catch((error) => {
          showAlert(`Error updating faculty: ${error.message || 'Unknown error'}`, 'danger');
        });
    }

    // Expose necessary functions globally for existing markup
    window.adminSubmitUploadForm = submitUploadForm;
    window.adminSubmitFacultyUploadForm = submitFacultyUploadForm;
    window.downloadLog = function () {
      const link = document.createElement('a');
      link.href = '/admin/download-log';
      link.download = 'app.log';
      link.style.display = 'none';
      link.setAttribute('target', '_blank');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };

    // Initialize
    renderAllUsers(allUsers);
    renderPrivilegedUsers(privilegedUsers);
    fetchShemaAndRender();
    fetchTimetableAndRender();
    fetchFacultyAndRender();

    const schemaForm = document.getElementById('schemaManagementForm');
    schemaForm?.addEventListener('submit', function (event) {
      event.preventDefault();
      const data = new FormData(this);
      let nameToBeSent = data.get('newName');
      if (data.get('subType') === 'Lab') {
        const str = String(nameToBeSent || '');
        if (!str.toLowerCase().endsWith('lab')) {
          nameToBeSent = str + ' Lab';
        }
      }
      const bodyData = { _method: data.get('_method'), directoryToBeModified: data.get('directoryToBeModified'), newName: nameToBeSent };
      fetch(this.getAttribute('action'), { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) })
        .then((response) => {
          if (response.ok) {
            document.getElementById('ShowalertManagementModal')?.click();
            const body = document.getElementById('alertModalBody');
            if (body)
              body.innerHTML = `<div class="alert alert-success d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Success:"><use xlink:href="#check-circle-fill" /></svg><div>Academic Schema Updated Successfully !!!</div></div>`;
            setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
            resetSchemaView();
            fetchShemaAndRender();
          } else {
            document.getElementById('ShowalertManagementModal')?.click();
            const body = document.getElementById('alertModalBody');
            if (body)
              body.innerHTML = `<div class="alert alert-warning d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill" /></svg><div>Failed to update the academic schema, Please retry..</div></div>`;
            setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
          }
        })
        .catch((error) => {
          document.getElementById('ShowalertManagementModal')?.click();
          const body = document.getElementById('alertModalBody');
          if (body)
            body.innerHTML = `<div class="alert alert-warning d-flex align-items-center" role="alert"><svg class="bi flex-shrink-0 me-2" width="24" height="24" role="img" aria-label="Warning:"><use xlink:href="#exclamation-triangle-fill" /></svg><div>${error}</div></div>`;
          setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
        })
        .finally(() => document.getElementById('schemaManagementModalClose')?.click());
    });

    document.addEventListener('click', function (event) {
      if (event.target.classList.contains('rename-semsub-btn')) {
        if (event.target.getAttribute('data-semsub-type') === 'sub') {
          document.getElementById('newName')?.setAttribute('placeholder', 'HMCI-201: Economics for Engineers');
          document.getElementById('subDiv')?.setAttribute('style', 'display: block;');
        } else {
          document.getElementById('newName')?.setAttribute('placeholder', '');
          const sel = document.getElementById('subType');
          sel?.querySelector('option[value="Theory"]')?.setAttribute('selected', 'true');
          document.getElementById('subDiv')?.setAttribute('style', 'display: none;');
        }
        const el = document.getElementById('directoryToBeModified');
        if (el) el.value = event.target.getAttribute('data-semsub-id') || '';
        const newName = document.getElementById('newName');
        if (newName) newName.value = '';
        const method = document.getElementById('schemaManagementFormMethod');
        if (method) method.value = 'PUT';
        const form = document.getElementById('schemaManagementForm');
        form?.setAttribute('action', '/admin/rename-directory?_method=PUT');
        form?.setAttribute('onsubmit', "return confirm('Are you sure you want to rename this directory?');");
      } else if (event.target.classList.contains('add-subject-btn')) {
        if (event.target.getAttribute('data-semsub-type') === 'sub') {
          document.getElementById('newName')?.setAttribute('placeholder', 'HMCI-201: Economics for Engineers');
          document.getElementById('subDiv')?.setAttribute('style', 'display: block;');
        } else {
          document.getElementById('newName')?.setAttribute('placeholder', '');
          const sel = document.getElementById('subType');
          sel?.querySelector('option[value="Theory"]')?.setAttribute('selected', 'true');
          document.getElementById('subDiv')?.setAttribute('style', 'display: none;');
        }
        const el = document.getElementById('directoryToBeModified');
        if (el) el.value = event.target.getAttribute('data-semsub-id') || '';
        const newName = document.getElementById('newName');
        if (newName) newName.value = '';
        const method = document.getElementById('schemaManagementFormMethod');
        if (method) method.value = 'POST';
        const form = document.getElementById('schemaManagementForm');
        form?.setAttribute('action', `/admin/add-subjects?_method=POST`);
        form?.setAttribute('onsubmit', "return confirm('Are you sure you want to add this subject into the semester?');");
      } else if (
        event.target.classList.contains('delete-directory-btn') ||
        event.target.classList.contains('delete-schedule-btn') ||
        event.target.classList.contains('delete-faculty-btn')
      ) {
        const directoryId = event.target.getAttribute('data-directory-id');
        const form = document.getElementById('deleteDirectoryForm');
        const el = document.getElementById('directoryToBeDeleted');
        if (el) el.value = directoryId || '';
        const data = new FormData(form || undefined);
        const bodyData = { _method: data.get('_method'), directoryToBeDeleted: data.get('directoryToBeDeleted') };
        fetch(form?.getAttribute('action') || '', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(bodyData) })
          .then((response) => {
            if (response.ok) {
              document.getElementById('ShowalertManagementModal')?.click();
              const body = document.getElementById('alertModalBody');
              if (body)
                body.innerHTML = `<div class=\"alert alert-success d-flex align-items-center\" role=\"alert\"><svg class=\"bi flex-shrink-0 me-2\" width=\"24\" height=\"24\" role=\"img\" aria-label=\"Success:\"><use xlink:href=\"#check-circle-fill\" /></svg><div>Academic Schema Updated Successfully !!!</div></div>`;
              setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
              if (event.target.classList.contains('delete-directory-btn')) {
                resetSchemaView();
                fetchShemaAndRender();
              } else if (event.target.classList.contains('delete-schedule-btn')) {
                resetTimetableOrFacultyView(scheduleListForDelete);
                fetchTimetableAndRender();
              } else {
                resetTimetableOrFacultyView(facultyListForDelete);
                fetchFacultyAndRender();
              }
            } else {
              document.getElementById('ShowalertManagementModal')?.click();
              const body = document.getElementById('alertModalBody');
              if (body)
                body.innerHTML = `<div class=\"alert alert-warning d-flex align-items-center\" role=\"alert\"><svg class=\"bi flex-shrink-0 me-2\" width=\"24\" height=\"24\" role=\"img\" aria-label=\"Warning:\"><use xlink:href=\"#exclamation-triangle-fill\" /></svg><div>Failed to Delete, Please retry..</div></div>`;
              setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
              throw new Error('Failed to Delete, Please retry..');
            }
          })
          .catch((error) => {
            document.getElementById('ShowalertManagementModal')?.click();
            const body = document.getElementById('alertModalBody');
            if (body)
              body.innerHTML = `<div class=\"alert alert-warning d-flex align-items-center\" role=\"alert\"><svg class=\"bi flex-shrink-0 me-2\" width=\"24\" height=\"24\" role=\"img\" aria-label=\"Warning:\"><use xlink:href=\"#exclamation-triangle-fill\" /></svg><div>${String(error)}</div></div>`;
            setTimeout(() => document.getElementById('closeAlertButton')?.click(), 4000);
          });
      }
    });

    document.addEventListener('submit', function (event) {
      const form = event.target;
      if (form && form.id === 'updateFacultyForm') {
        event.preventDefault();
        submitFacultyUpdateForm();
      }
    });
  }, []);

  return null;
}
