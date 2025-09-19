// script.js
// Clean, focused JS: typed headline, scroll-autoplay teaching video (muted), modal handling, keyboard support, copy email feedback

document.addEventListener('DOMContentLoaded', () => {
  /* ---------- typed headline (kept short) ---------- */
  const typedEl = document.getElementById('typed');
  const phrases = [
    "hi, I'm Emmanuel",
    "Prompt Engineer",
    "AI Prototyper",
    "LLM Integrator",
    "Teacher"
  ];
  let pIndex = 0, ch = 0, deleting = false;
  function tick() {
    if (!typedEl) return;
    const full = phrases[pIndex];
    if (!deleting) {
      typedEl.textContent = full.slice(0, ch + 1);
      ch++;
      if (ch === full.length) { deleting = true; setTimeout(tick, 900); return; }
    } else {
      typedEl.textContent = full.slice(0, ch - 1);
      ch--;
      if (ch === 0) { deleting = false; pIndex = (pIndex + 1) % phrases.length; }
    }
    setTimeout(tick, deleting ? 40 : 80);
  }
  setTimeout(tick, 400);

  /* ---------- smooth scroll for projects ---------- */
  const viewProjects = document.getElementById('view-projects');
  if (viewProjects) {
    viewProjects.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#projects');
      if (target) { target.scrollIntoView({ behavior: 'smooth', block: 'start' }); target.setAttribute('tabindex','-1'); target.focus(); }
    });
  }

  /* ---------- project card keyboard & click ---------- */
  document.querySelectorAll('.proj').forEach(proj => {
    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
    proj.addEventListener('click', (e) => {
      const interactiveTags = ['A','BUTTON','SVG','PATH'];
      if (interactiveTags.includes(e.target.tagName)) return;
      const url = proj.getAttribute('data-url');
      if (url) window.open(url, '_blank', 'noopener');
    });
  });

  /* ---------- contact email: copy to clipboard + feedback ---------- */
  const contactEmail = document.getElementById('contact-email');
  let copyFeedback = document.getElementById('copy-feedback');
  if (!copyFeedback) {
    copyFeedback = document.createElement('div');
    copyFeedback.className = 'copy-feedback';
    copyFeedback.id = 'copy-feedback';
    document.body.appendChild(copyFeedback);
  }
  if (contactEmail) {
    contactEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(()=> showCopy('Email copied')).catch(()=> window.location.href = 'mailto:' + mail);
      } else {
        const ta = document.createElement('textarea');
        ta.value = mail; ta.style.position = 'fixed'; ta.style.left = '-9999px';
        document.body.appendChild(ta); ta.select();
        try { document.execCommand('copy'); showCopy('Email copied'); } catch { window.location.href = 'mailto:' + mail; }
        document.body.removeChild(ta);
      }
    });
    contactEmail.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); contactEmail.click(); } });
  }
  function showCopy(txt='Copied') {
    copyFeedback.textContent = txt;
    copyFeedback.classList.add('show');
    copyFeedback.setAttribute('role','status');
    setTimeout(()=> copyFeedback.classList.remove('show'), 1800);
  }

  /* ---------- Demo modal (project demo buttons) - preserved behaviour ---------- */
  const modal = document.getElementById('video-modal');
  const videoFrame = document.getElementById('video-frame');
  const closeBtn = document.querySelector('.video-close');
  let lastFocused = null;
  const pageTabbables = [];

  function openModal(src) {
    if (!modal || !videoFrame) return;
    lastFocused = document.activeElement;
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allow','autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen','');
    iframe.title = 'Project demo';
    iframe.loading = 'lazy';
    videoFrame.innerHTML = '';
    videoFrame.appendChild(iframe);
    modal.setAttribute('aria-hidden','false');
    modal.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    // simple focus trap
    disablePageTabbing();
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !videoFrame) return;
    modal.setAttribute('aria-hidden','true');
    modal.style.display = 'none';
    videoFrame.innerHTML = '';
    document.documentElement.style.overflow = '';
    restorePageTabbing();
    try { lastFocused && lastFocused.focus(); } catch {}
  }

  function disablePageTabbing(){
    const nodes = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    nodes.forEach(n=>{
      if (modal && modal.contains(n)) return;
      const prev = n.getAttribute('tabindex');
      pageTabbables.push({node:n, prev});
      n.setAttribute('tabindex','-1');
    });
  }
  function restorePageTabbing(){ pageTabbables.forEach(({node, prev})=>{ if (prev === null) node.removeAttribute('tabindex'); else node.setAttribute('tabindex', prev); }); pageTabbables.length = 0; }

  document.querySelectorAll('.demo-btn').forEach(btn=>{
    btn.addEventListener('click', (ev)=>{
      const src = btn.getAttribute('data-video-src');
      if (src && btn.tagName.toLowerCase() === 'button') { ev.preventDefault(); openModal(src); return; }
    });
  });
  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e)=> { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e)=> { if (e.key === 'Escape') closeModal(); });

  /* ---------- Teaching video: lazy-load & autoplay when in view (muted) ---------- */
  const teachingContainer = document.querySelector('.video-container');
  if (teachingContainer) {
    const videoId = teachingContainer.getAttribute('data-video-id');
    // Build base src WITHOUT autoplay initially
    const buildSrc = (autoplay = false, mute = true) => {
      // autoplay=1 requires mute for most browsers to allow autoplay
      const params = new URLSearchParams({
        rel: 0,
        modestbranding: 1,
        playsinline: 1,
        enablejsapi: 1
      });
      if (autoplay) params.set('autoplay', '1');
      params.set('mute', mute ? '1' : '0');
      // request high-res (YouTube ignores vq param in many cases, but we keep hd1080 for best-effort)
      params.set('vq', 'hd1080');
      return `https://www.youtube.com/embed/${videoId}?${params.toString()}`;
    };

    // IntersectionObserver to autoplay when at least 40% visible
    const io = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting && entry.intersectionRatio >= 0.4) {
          // insert iframe with autoplay=1&mute=1
          if (!teachingContainer.querySelector('iframe')) {
            const iframe = document.createElement('iframe');
            iframe.src = buildSrc(true, true);
            iframe.title = 'Teaching demo by Emmanuel';
            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
            iframe.allowFullscreen = true;
            iframe.loading = 'lazy';
            teachingContainer.appendChild(iframe);
            // show unmute button
            const btn = teachingContainer.querySelector('.video-unmute');
            if (btn) btn.hidden = false;
          }
        } else {
          // remove iframe when out of view to stop playback and keep page light
          const iframe = teachingContainer.querySelector('iframe');
          if (iframe) iframe.remove();
          // hide unmute button until iframe loaded again
          const btn = teachingContainer.querySelector('.video-unmute');
          if (btn) btn.hidden = true;
        }
      });
    }, { threshold: [0, 0.1, 0.4, 0.75] });

    io.observe(teachingContainer);

    // Unmute handler: when user clicks unmute overlay, we replace iframe with muted=false (user gesture)
    const unmuteBtn = teachingContainer.querySelector('.video-unmute');
    if (unmuteBtn) {
      unmuteBtn.addEventListener('click', () => {
        // replace iframe src to unmute (user gesture allows sound)
        const current = teachingContainer.querySelector('iframe');
        if (current) {
          current.remove();
        }
        const iframe = document.createElement('iframe');
        iframe.src = buildSrc(true, false);
        iframe.title = 'Teaching demo by Emmanuel';
        iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
        iframe.allowFullscreen = true;
        teachingContainer.appendChild(iframe);
        unmuteBtn.hidden = true; // hide after unmuting
      });
    }
  }

  /* ---------- minor performance debouncer (placeholder) ---------- */
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(()=> { resizeTimer = null; }, 150);
  });

});



