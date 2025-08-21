// script.js - small UI helpers: typed headline, smooth scroll, demo modal
// Replace your current script.js with this exact file.

document.addEventListener('DOMContentLoaded', () => {
  // typed headline (simple, non-looping)
  const typedEl = document.getElementById('typed');
  const cursorEl = document.querySelector('.cursor');
  const text = "hi, i'm Emmanuel";
  let i = 0;
  function type() {
    if (!typedEl) return;
    if (i <= text.length) {
      typedEl.textContent = text.slice(0, i);
      i++;
      setTimeout(type, 55);
    } else {
      if (cursorEl) cursorEl.style.opacity = '0.6';
    }
  }
  type();

  // smooth scroll for "View projects"
  const viewProjects = document.getElementById('view-projects');
  if (viewProjects) {
    viewProjects.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#projects');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  }

  // video modal
  const modal = document.getElementById('video-modal');
  const videoFrame = document.getElementById('video-frame');
  const closeBtn = document.querySelector('.video-close');

  function openModal(src) {
    if (!modal || !videoFrame) return;
    // create iframe only when user clicks (good for perf)
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.title = 'Project demo';
    // clear previous & add
    videoFrame.innerHTML = '';
    videoFrame.appendChild(iframe);
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    closeBtn && closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !videoFrame) return;
    modal.setAttribute('aria-hidden', 'true');
    videoFrame.innerHTML = ''; // remove iframe to stop playback
    document.documentElement.style.overflow = '';
  }

  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const src = btn.getAttribute('data-video-src');
      if (src) openModal(src);
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // small performance helper: debounce window resize (prevents thrash)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // placeholder: if you need to run layout code on resize, do it here.
      resizeTimer = null;
    }, 120);
  });
});
