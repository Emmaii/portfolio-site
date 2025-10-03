// script.js - updated to loop typing indefinitely and simplified interactions
document.addEventListener('DOMContentLoaded', () => {
  // Typing headline — loops indefinitely without pausing on click
  const typedEl = document.getElementById('typed');
  const phrases = [
    "Mathematics Educator — Grade 1-12",
    "GCSE & A-Level Specialist",
    "Curriculum Developer & Tutor",
    "Exam-Focused Lesson Creator"
  ];
  let pIndex = 0, ch = 0, deleting = false;

  function tick(){
    if (!typedEl) return;
    const full = phrases[pIndex];
    if (!deleting){
      typedEl.textContent = full.slice(0, ch + 1);
      ch++;
      if (ch === full.length){
        deleting = true;
        setTimeout(tick, 1000);
        return;
      }
    } else {
      typedEl.textContent = full.slice(0, ch - 1);
      ch--;
      if (ch === 0){
        deleting = false;
        pIndex = (pIndex + 1) % phrases.length;
      }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  tick();

  // Copy email to clipboard
  const copyEmail = document.getElementById('copy-email');
  if (copyEmail){
    copyEmail.addEventListener('click', async (e) => {
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      try {
        await navigator.clipboard.writeText(mail);
        showCopyFeedback('📧 Email copied to clipboard');
      } catch (err) {
        window.location.href = 'mailto:' + mail + '?subject=Mathematics%20Teaching%20Inquiry';
      }
    });
  }

  // Single project interactions (open links)
  document.querySelectorAll('.proj').forEach(proj => {
    proj.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const url = proj.getAttribute('data-url');
      if (url) window.open(url, '_blank', 'noopener');
    });
    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
  });

  // View Live Demo action — opens a small prompt that enables you to email for demo access
  const viewLive = document.getElementById('view-live');
  if (viewLive){
    viewLive.addEventListener('click', (e) => {
      e.preventDefault();
      const ok = confirm('Request access to the live demo? Click OK to open your email client.');
      if (ok) window.location.href = 'mailto:emmaabusinesss@gmail.com?subject=Live%20Demo%20Request';
    });
  }

  // IntersectionObserver: subtle reveal for the lone card
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });

    document.querySelectorAll('.proj').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(14px)';
      el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      io.observe(el);
    });
  }

  // Copy feedback UI
  const copyFeedback = document.getElementById('copy-feedback');
  function showCopyFeedback(msg = 'Copied to clipboard'){
    if (!copyFeedback) return;
    copyFeedback.textContent = msg;
    copyFeedback.classList.add('show');
    copyFeedback.style.display = 'flex';
    const sr = document.createElement('div');
    sr.setAttribute('aria-live','polite');
    sr.className = 'sr-only';
    sr.textContent = msg;
    document.body.appendChild(sr);
    setTimeout(() => {
      copyFeedback.classList.remove('show');
      copyFeedback.style.display = 'none';
      document.body.removeChild(sr);
    }, 2600);
  }

  // Add tiny accessibility helper style for SR only nodes
  const style = document.createElement('style');
  style.textContent = `.sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}`;
  document.head.appendChild(style);
});
