import { useEffect } from 'react';

export default function Dsa() {
  useEffect(() => {
    if (typeof document === 'undefined') return;
    window.show_answer = function (element_id) {
      const el = document.getElementById(element_id);
      if (!el) return;
      el.style.display = el.style.display === 'block' ? 'none' : 'block';
    };
  }, []);
  return null;
}
