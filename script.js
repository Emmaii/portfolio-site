// script.js - refined with continuous typing animation
document.addEventListener('DOMContentLoaded', () => {
  // Continuous typed headline
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
        setTimeout(tick, 1500); // Pause at end
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
    }, 2800);
  }

  // Project card interactions
  document.querySelectorAll('.proj').forEach(proj => {
    proj.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      const url = proj.getAttribute('data-url');
      if (url) window.open(url, '_blank', 'noopener');
    });
  });

  // Mobile responsiveness check
  function checkMobileLayout() {
    const isMobile = window.innerWidth <= 900;
    document.body.classList.toggle('mobile-layout', isMobile);
  }
  
  window.addEventListener('resize', checkMobileLayout);
  checkMobileLayout();
});

// SR utility CSS
const style = document.createElement('style');
style.textContent = `
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
  .mobile-layout .hero-text { text-align: center; }
`;
document.head.appendChild(style);
