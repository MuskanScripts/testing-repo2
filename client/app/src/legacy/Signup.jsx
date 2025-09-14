import { useEffect } from 'react';

export default function Signup() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    const signupForm = document.getElementById('signupForm');
    const emailInput = document.getElementById('signupEmail');
    const newPasswordInput = document.getElementById('newPassword');
    const confirmPasswordInput = document.getElementById('confirmPassword');
    const captchaInput = document.getElementById('captchaInput');
    const captchaText = document.getElementById('captchaText');
    const refreshCaptchaBtn = document.getElementById('refreshCaptcha');
    const newPasswordToggle = document.getElementById('newPasswordToggle');
    const confirmPasswordToggle = document.getElementById('confirmPasswordToggle');
    const agreeTermsCheckbox = document.getElementById('agreeTerms');
    const submitBtn = document.getElementById('signupBtn');
    const problemInput = document.getElementById('problem');
    if (!signupForm) return;

    let currentCaptcha = '';
    function generateCaptcha() {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'; let captcha = '';
      for (let i = 0; i < 6; i++) captcha += chars.charAt(Math.floor(Math.random() * chars.length));
      currentCaptcha = captcha; if (captchaText) captchaText.textContent = captcha;
    }
    generateCaptcha();
    refreshCaptchaBtn?.addEventListener('click', function () { generateCaptcha(); if (captchaInput) captchaInput.value = ''; hideError('error_box_captcha'); });
    newPasswordToggle?.addEventListener('click', function () { if (!newPasswordInput) return; const type = newPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password'; newPasswordInput.setAttribute('type', type); const icon = this.querySelector('i'); if (icon) { icon.classList.toggle('fa-eye'); icon.classList.toggle('fa-eye-slash'); } });
    confirmPasswordToggle?.addEventListener('click', function () { if (!confirmPasswordInput) return; const type = confirmPasswordInput.getAttribute('type') === 'password' ? 'text' : 'password'; confirmPasswordInput.setAttribute('type', type); const icon = this.querySelector('i'); if (icon) { icon.classList.toggle('fa-eye'); icon.classList.toggle('fa-eye-slash'); } });

    function validateEmail(email) { const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/; return emailRegex.test(email); }
    function validateNITJEmail(email) { return email.toLowerCase().endsWith('@nitj.ac.in'); }
    function validatePassword(password) { const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*?&]{6,}$/; return passwordRegex.test(password); }
    function validateCaptcha(input) { return String(input).toUpperCase() === currentCaptcha; }
    function showError(elementId, message) { const el = document.getElementById(elementId); if (el) { el.textContent = message; el.style.display = 'block'; } }
    function hideError(elementId) { const el = document.getElementById(elementId); if (el) { el.textContent = ''; el.style.display = 'none'; } }

    emailInput?.addEventListener('blur', function () { const email = this.value.trim(); if (email && !validateEmail(email)) showError('error_box_email', 'Please enter a valid email address'); else if (email && !validateNITJEmail(email)) showError('error_box_email', 'Please use your NITJ email address'); else hideError('error_box_email'); });
    newPasswordInput?.addEventListener('blur', function () { const password = this.value.trim(); if (password && !validatePassword(password)) showError('error_box_newpass', 'Password must be at least 6 characters with letters and numbers'); else hideError('error_box_newpass'); });
    confirmPasswordInput?.addEventListener('blur', function () { const password = this.value.trim(); const newPassword = newPasswordInput?.value.trim() || ''; if (password && password !== newPassword) showError('error_box_confirmpass', 'Passwords do not match'); else hideError('error_box_confirmpass'); });
    captchaInput?.addEventListener('blur', function () { const captcha = this.value.trim(); if (captcha && !validateCaptcha(captcha)) showError('error_box_captcha', 'Invalid captcha code'); else hideError('error_box_captcha'); });

    signupForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = emailInput?.value.trim() || ''; const newPassword = newPasswordInput?.value.trim() || ''; const confirmPassword = confirmPasswordInput?.value.trim() || ''; const captcha = captchaInput?.value.trim() || ''; const agreeTerms = !!agreeTermsCheckbox?.checked;
      hideError('error_box_email'); hideError('error_box_newpass'); hideError('error_box_confirmpass'); hideError('error_box_captcha');
      let hasErrors = false;
      if (!email) { showError('error_box_email', 'Email is required'); hasErrors = true; } else if (!validateEmail(email)) { showError('error_box_email', 'Please enter a valid email address'); hasErrors = true; } else if (!validateNITJEmail(email)) { showError('error_box_email', 'Please use your NITJ email address'); hasErrors = true; }
      if (!newPassword) { showError('error_box_newpass', 'Password is required'); hasErrors = true; } else if (!validatePassword(newPassword)) { showError('error_box_newpass', 'Password must be at least 6 characters with letters and numbers'); hasErrors = true; }
      if (!confirmPassword) { showError('error_box_confirmpass', 'Please confirm your password'); hasErrors = true; } else if (confirmPassword !== newPassword) { showError('error_box_confirmpass', 'Passwords do not match'); hasErrors = true; }
      if (!captcha) { showError('error_box_captcha', 'Please enter the captcha code'); hasErrors = true; } else if (!validateCaptcha(captcha)) { showError('error_box_captcha', 'Invalid captcha code'); hasErrors = true; }
      if (!agreeTerms) { alert('Please agree to the Terms & Conditions and Privacy Policy'); hasErrors = true; }
      if (hasErrors) return;
      const btnText = submitBtn?.querySelector('.btn-text'); const btnLoader = submitBtn?.querySelector('.btn-loader');
      if (btnText && btnLoader) { btnText.style.display = 'none'; btnLoader.style.display = 'block'; }
      if (problemInput?.value) {
        const problem = problemInput.value;
        if (problem.includes('email')) showError('error_box_email', problem);
        else if (problem.includes('password')) showError('error_box_newpass', problem);
        else if (problem.includes('captcha')) showError('error_box_captcha', problem);
        else showError('error_box_email', problem);
        if (btnText && btnLoader) { btnText.style.display = 'block'; btnLoader.style.display = 'none'; }
        if (submitBtn) submitBtn.disabled = false; return;
      }
      setTimeout(() => { signupForm.submit(); }, 500);
    });

    newPasswordInput?.addEventListener('input', function () { const password = this.value; let strength = 0; if (password.length >= 6) strength++; if (/[a-z]/.test(password)) strength++; if (/[A-Z]/.test(password)) strength++; if (/[0-9]/.test(password)) strength++; if (/[^A-Za-z0-9]/.test(password)) strength++; if (strength >= 4) hideError('error_box_newpass'); });

    if (emailInput && !emailInput.value) emailInput.focus();
  }, []);
  return null;
}
