import { useEffect } from 'react';

export default function VerifyOTP() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    function onClickNext(cb) { if (typeof cb === 'function') cb(); }
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/home');
    const errorMsg = document.getElementById('error_box_otp');
    if (errorMsg) errorMsg.innerText = '';
    const problem = document.getElementById('problem')?.value;
    if (document.getElementById('registeredIn')?.value === 'Yes') {
      const otp = document.getElementById('receiversOTP');
      if (otp) otp.value = 'Account exists';
      const next = document.getElementById('next'); if (next) next.style = 'Display: None;';
      const inputBox1 = document.getElementById('inputBox1'); if (inputBox1) inputBox1.style = 'Display: None;';
      const verifyMsg = document.getElementById('verifyMsg'); if (verifyMsg) verifyMsg.innerText = 'Verifying Email\nPlease Wait...';
      form.submit();
    } else if (problem === 'InvalidOTP') {
      if (errorMsg) errorMsg.innerText = 'Invalid OTP';
      setTimeout(function () { if (errorMsg) errorMsg.innerText = ''; }, 3000);
    }
    const next = document.getElementById('next');
    if (next) next.onclick = () => onClickNext(() => { form.submit(); return false; });
  }, []);
  return null;
}
