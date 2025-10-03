// script.js - refined interactions for hire-focused portfolio
document.addEventListener('DOMContentLoaded', () => {
  // Typed headline
  const typedEl = document.getElementById('typed');
  const phrases = [
    "Mathematics Educator — Grade 1-12",
    "GCSE & A-Level Specialist",
    "Curriculum Developer & Tutor",
    "Exam-Focused Lesson Creator"
  ];
  let pIndex = 0, ch = 0, deleting = false, paused = false;

  function tick(){
    if (!typedEl || paused) return;
    const full = phrases[pIndex];
    if (!deleting){
      typedEl.textContent = full.slice(0, ch + 1);
      ch++;
      if (ch === full.length){ deleting = true; setTimeout(tick, 1200); return; }
    } else {
      typedEl.textContent = full.slice(0, ch - 1);
      ch--;
      if (ch === 0){ deleting = false; pIndex = (pIndex + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 70);
  }
  // Pause typing when user clicks anywhere (keeps UX stable)
  document.addEventListener('click', () => { if (!paused){ paused = true; typedEl.textContent = "Mathematics Educator — Grade 1-12"; }});
  tick();

  // Copy plain CV to clipboard
  const copyCvBtn = document.getElementById('copy-cv');
  if (copyCvBtn){
    copyCvBtn.addEventListener('click', async () => {
      const pre = document.getElementById('plain-cv');
      if (!pre) return;
      const text = pre.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showCopyFeedback('✅ CV text copied — paste into application forms');
      } catch (err) {
        // fallback
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try { document.execCommand('copy'); showCopyFeedback('✅ CV text copied (fallback)'); }
        catch { showCopyFeedback('❌ Copy failed — select & copy manually'); }
        document.body.removeChild(ta);
      }
    });
  }

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

  // Copy feedback UI & SR announcement
  const copyFeedback = document.getElementById('copy-feedback');
  function showCopyFeedback(msg = 'Copied to clipboard'){
    if (!copyFeedback) return;
    copyFeedback.textContent = msg;
    copyFeedback.classList.add('show');
    copyFeedback.style.display = 'flex';
    // screen reader announcement
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

  // Project card interactions (open data-url)
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

  // IntersectionObserver: subtle reveal
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) { en.target.style.opacity = '1'; en.target.style.transform = 'translateY(0)'; obs.unobserve(en.target); }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('.proj').forEach(el => {
      el.style.opacity = '0'; el.style.transform = 'translateY(14px)'; el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      io.observe(el);
    });
  }

  // Outbound link click log (placeholder for analytics)
  document.querySelectorAll('a[target="_blank"]').forEach(a => {
    a.addEventListener('click', () => { console.log('Outbound link:', a.href); });
  });

  // Minimal loading state for buttons (prevents double-click confusion)
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e){
      if (this.href && !this.href.startsWith('#') && !this.classList.contains('btn-download')) {
        const original = this.innerHTML;
        this.innerHTML = '⏳ Loading...';
        setTimeout(() => { this.innerHTML = original; }, 1200);
      }
    });
  });

  // simple resize debounce placeholder
  let resizeTimer;
  window.addEventListener('resize', () => { clearTimeout(resizeTimer); resizeTimer = setTimeout(()=>{}, 250); });
});

// SR utility CSS injection
const style = document.createElement('style');
style.textContent = `
  .sr-only{position:absolute;width:1px;height:1px;padding:0;margin:-1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap;border:0}
`;
document.head.appendChild(style);
