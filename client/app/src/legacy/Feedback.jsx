import { useEffect } from 'react';

export default function Feedback() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    function onClickSendMail() {
      const form = document.getElementById('supportForm') || document.getElementById('sendMailForm') || document.querySelector('form[action="/support"]') || document.querySelector('form#support');
      if (!form) return;
      form.setAttribute('action', '/support');
      form.submit();
    }
    const sendBut = document.getElementById('sendMail');
    if (sendBut) sendBut.onclick = () => onClickSendMail();
  }, []);
  return null;
}
