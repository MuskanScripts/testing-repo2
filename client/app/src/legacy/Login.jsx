import { useEffect } from 'react';

export default function Login() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const loginForm = document.getElementById('loginForm');
    const emailInput = document.getElementById('receiversMail');
    const passwordInput = document.getElementById('receiversPass');
    const passwordToggle = document.getElementById('passwordToggle');
    const rememberMeCheckbox = document.getElementById('rememberMe');
    const submitBtn = document.getElementById('next');
    const problemInput = document.getElementById('problem');
    if (!loginForm || !emailInput || !passwordInput || !passwordToggle || !rememberMeCheckbox || !submitBtn) return;

    passwordToggle.addEventListener('click', function () {
      const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
      passwordInput.setAttribute('type', type);
      const icon = this.querySelector('i');
      if (icon) { icon.classList.toggle('fa-eye'); icon.classList.toggle('fa-eye-slash'); }
    });

    const savedEmail = localStorage.getItem('rememberedEmail');
    if (savedEmail) { emailInput.value = savedEmail; rememberMeCheckbox.checked = true; }

    function validateEmail(email) { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return emailRegex.test(email); }
    function validateNITJEmail(email) { return email.toLowerCase().endsWith('@nitj.ac.in'); }
    function showError(elementId, message) { const el = document.getElementById(elementId); if (el) { el.textContent = message; el.style.display = 'block'; } }
    function hideError(elementId) { const el = document.getElementById(elementId); if (el) { el.textContent = ''; el.style.display = 'none'; } }

    emailInput.addEventListener('blur', function () {
      const email = this.value.trim();
      if (email && !validateEmail(email)) showError('error_box_user', 'Please enter a valid email address');
      else if (email && !validateNITJEmail(email)) showError('error_box_user', 'Please use your NITJ email address');
      else hideError('error_box_user');
    });
    passwordInput.addEventListener('blur', function () {
      const password = this.value.trim();
      if (password && password.length < 6) showError('error_box_pass', 'Password must be at least 6 characters long'); else hideError('error_box_pass');
    });

    loginForm.method = 'POST';
    loginForm.action = '/login';
    loginForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = emailInput.value.trim(); const password = passwordInput.value.trim(); const rememberMe = rememberMeCheckbox.checked;
      hideError('error_box_user'); hideError('error_box_pass');
      let hasErrors = false;
      if (!email) { showError('error_box_user', 'Email is required'); hasErrors = true; }
      else if (!validateEmail(email)) { showError('error_box_user', 'Please enter a valid email address'); hasErrors = true; }
      else if (!validateNITJEmail(email)) { showError('error_box_user', 'Please use your NITJ email address'); hasErrors = true; }
      if (!password) { showError('error_box_pass', 'Password is required'); hasErrors = true; }
      else if (password.length < 6) { showError('error_box_pass', 'Password must be at least 6 characters long'); hasErrors = true; }
      if (hasErrors) return;
      const btnText = submitBtn.querySelector('.btn-text'); const btnLoader = submitBtn.querySelector('.btn-loader');
      if (btnText && btnLoader) { btnText.style.display = 'none'; btnLoader.style.display = 'block'; }
      submitBtn.disabled = true;
      if (rememberMe) localStorage.setItem('rememberedEmail', email); else localStorage.removeItem('rememberedEmail');
      const problem = problemInput?.value;
      if (problem) {
        if (problem.includes('email')) showError('error_box_user', 'Invalid email or password');
        else if (problem.includes('password')) showError('error_box_pass', 'Invalid email or password');
        else showError('error_box_user', problem);
        if (btnText && btnLoader) { btnText.style.display = 'block'; btnLoader.style.display = 'none'; }
        submitBtn.disabled = false; return;
      }
      setTimeout(() => { loginForm.submit(); }, 500);
    });

    const inputs = document.querySelectorAll('.form-input');
    inputs.forEach((input) => {
      input.addEventListener('focus', function () { this.parentElement?.classList.add('focused'); });
      input.addEventListener('blur', function () { if (!this.value) this.parentElement?.classList.remove('focused'); });
    });
    if (emailInput && !emailInput.value) emailInput.focus();
  }, []);
  return null;
}
