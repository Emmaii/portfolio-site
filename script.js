// Lightweight interactions + demo modal (lazy-loaded iframe or mp4)
document.addEventListener('DOMContentLoaded', () => {
  // typing using rAF for smoothness
  (function typing() {
    const text = "hi, I'm Emmanuel";
    const el = document.getElementById('typed');
    if (!el) return;
    let i = 0;
    const delay = 55;
    function step() {
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        requestAnimationFrame(() => setTimeout(step, delay));
      }
    }
    setTimeout(() => requestAnimationFrame(step), 180);
  })();

  // Smooth scroll View projects
  const viewBtn = document.getElementById('view-projects');
  if (viewBtn) {
    viewBtn.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.getElementById('projects');
      if (target) target.scrollIntoView({behavior: 'smooth', block: 'center'});
      try { this.style.transform = 'translateY(-3px)'; setTimeout(()=> this.style.transform = '', 220); } catch(e){}
    }, {passive: true});
  }

  // Open project link when clicking card (delegated)
  const projectsContainer = document.querySelector('.projects-list');
  if (projectsContainer) {
    projectsContainer.addEventListener('click', function (e) {
      const card = e.target.closest('.proj');
      if (!card) return;
      if (e.target.closest('a') || e.target.closest('.demo-btn')) return; // allow anchor and demo button default actions
      const url = card.dataset.url;
      if (url) window.open(url, '_blank', 'noopener');
    }, {passive: true});

    projectsContainer.addEventListener('keydown', function (e) {
      const card = e.target.closest('.proj');
      if (!card) return;
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = card.dataset.url;
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
  }

  // Demo modal logic (delegated for .demo-btn)
  const modal = document.getElementById('video-modal');
  const frame = document.getElementById('video-frame');
  const closeBtn = modal && modal.querySelector('.video-close');
  let lastFocused = null;

  function openModal(type, src, title) {
    if (!modal || !frame) return;
    // clear frame
    frame.innerHTML = '';
    modal.setAttribute('aria-hidden', 'false');
    modal.classList.add('open');

    // remember focus
    lastFocused = document.activeElement;

    // create player lazily
    if (type === 'youtube') {
      const iframe = document.createElement('iframe');
      iframe.width = '100%';
      iframe.height = '100%';
      // add privacy-friendly params (you can add &rel=0 or &modestbranding=1)
      iframe.src = src + '?autoplay=1&rel=0';
      iframe.allow = 'autoplay; encrypted-media; picture-in-picture';
      iframe.allowFullscreen = true;
      iframe.title = title || 'Project demo';
      iframe.frameBorder = '0';
      frame.appendChild(iframe);
    } else if (type === 'mp4') {
      const video = document.createElement('video');
      video.src = src;
      video.controls = true;
      video.autoplay = true;
      video.playsInline = true;
      video.style.width = '100%';
      video.style.height = '100%';
      frame.appendChild(video);
      // attempt to play (some browsers require user gesture)
      video.play().catch(()=>{ /* ignore autoplay rejection */ });
    } else {
      // unsupported type
      frame.textContent = 'Unsupported video type';
    }

    // focus the close button for keyboard users
    if (closeBtn) closeBtn.focus();
    // trap focus lightly: add keydown to handle Tab within modal
    document.addEventListener('focus', keepFocusInside, true);
  }

  function closeModal() {
    if (!modal || !frame) return;
    // remove content to stop playback
    frame.innerHTML = '';
    modal.classList.remove('open');
    modal.setAttribute('aria-hidden', 'true');
    // return focus
    if (lastFocused && typeof lastFocused.focus === 'function') lastFocused.focus();
    lastFocused = null;
    document.removeEventListener('focus', keepFocusInside, true);
  }

  function keepFocusInside(e) {
    if (!modal.classList.contains('open')) return;
    if (!modal.contains(e.target)) {
      e.stopPropagation();
      if (closeBtn) closeBtn.focus();
    }
  }

  // delegated click for demo buttons
  document.addEventListener('click', function (e) {
    const btn = e.target.closest('.demo-btn');
    if (!btn) return;
    e.stopPropagation();
    e.preventDefault();
    const type = btn.dataset.videoType || 'youtube';
    const src = btn.dataset.videoSrc;
    const title = btn.getAttribute('aria-label') || 'Project demo';
    if (!src) return;
    openModal(type, src, title);
  }, {passive: false});

  // close interactions: close button, click outside, ESC key
  if (closeBtn) {
    closeBtn.addEventListener('click', function (e) {
      e.preventDefault();
      closeModal();
    });
  }

  if (modal) {
    modal.addEventListener('click', function (e) {
      // close only if clicking directly on backdrop (not the player)
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && modal && modal.classList.contains('open')) {
      closeModal();
    }
  });

  // Resume existence check (non-blocking)
  const resumeBtn = document.getElementById('download-resume');
  if (resumeBtn) {
    setTimeout(()=> {
      fetch('assets/resume.pdf', {method: 'HEAD'}).then(res => {
        if (res && res.ok) resumeBtn.style.display = 'inline-flex';
        else resumeBtn.style.display = 'none';
      }).catch(()=> resumeBtn.style.display = 'none');
    }, 300);
  }

  // small pointer feedback for buttons (global)
  document.addEventListener('pointerdown', function (e) {
    const b = e.target.closest('.btn, .demo-btn');
    if (!b) return;
    b.style.transform = 'translateY(1px) scale(.997)';
  }, {passive: true});
  document.addEventListener('pointerup', function (e) {
    const b = e.target.closest('.btn, .demo-btn');
    if (!b) return;
    b.style.transform = '';
  }, {passive: true});
});
