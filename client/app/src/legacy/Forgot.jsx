import { useEffect } from 'react';

export default function Forgot() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    function onClickNext(cb) { if (typeof cb === 'function') cb(); }
    const form = document.getElementById('loginForm');
    if (!form) return;
    form.setAttribute('method', 'POST');
    form.setAttribute('action', '/home');
    const validPass = document.getElementById('error_box_pass');
    const errorMsg = document.getElementById('error_box_otp');
    if (errorMsg) errorMsg.innerText = '';
    if (validPass) validPass.innerText = '';
    const problem = document.getElementById('problem')?.value;
    if (problem === 'InvalidOTP') {
      if (errorMsg) errorMsg.innerText = 'Invalid OTP';
      setTimeout(function () { if (errorMsg) errorMsg.innerText = ''; }, 3000);
    } else if (problem === 'WeakPassword') {
      if (validPass) validPass.innerText = 'Choose a stronger blend of characters and numbers!';
      setTimeout(function () { if (validPass) validPass.innerText = ''; }, 3000);
    }
    const next = document.getElementById('next');
    if (next) next.onclick = () => onClickNext(() => { form.submit(); return false; });
  }, []);
  return null;
}
