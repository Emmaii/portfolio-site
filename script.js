// script.js — typed headline, smooth scroll, demo modal, keyboard & copy helpers

document.addEventListener('DOMContentLoaded', () => {
  // typed headline (rotating phrases)
  const typedEl = document.getElementById('typed');
  const cursorEl = document.querySelector('.cursor');
  const phrases = ["hi, i'm Emmanuel", "Prompt Engineer", "Data Analyst", "AI Prototyper"];
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
    setTimeout(tick, deleting ? 45 : 75);
  }
  tick();

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
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.title = 'Project demo';
    videoFrame.innerHTML = '';
    videoFrame.appendChild(iframe);
    modal.setAttribute('aria-hidden', 'false');
    document.documentElement.style.overflow = 'hidden';
    if (closeBtn) closeBtn.focus();
  }

  function closeModal() {
    if (!modal || !videoFrame) return;
    modal.setAttribute('aria-hidden', 'true');
    videoFrame.innerHTML = ''; // remove iframe to stop playback
    document.documentElement.style.overflow = '';
  }

  document.querySelectorAll('.demo-btn').forEach(btn => {
    btn.addEventListener('click', (ev) => {
      // If it's a button with data-video-src, open modal
      const src = btn.getAttribute('data-video-src');
      if (src && btn.tagName.toLowerCase() === 'button') {
        ev.preventDefault();
        openModal(src);
        return;
      }
      // For anchor links (<a>), let default behavior happen (they open in new tab).
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // keyboard support: Enter on project row opens project (data-url)
  document.querySelectorAll('.proj').forEach(proj => {
    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
    // also support click to open the main repo page if user clicks the card but not the internal buttons/links
    proj.addEventListener('click', (e) => {
      // don't trigger when clicking on interactive elements inside card
      const interactiveTags = ['A', 'BUTTON', 'SVG', 'PATH'];
      if (interactiveTags.includes(e.target.tagName)) return;
      const url = proj.getAttribute('data-url');
      if (url) window.open(url, '_blank', 'noopener');
    });
  });

  // contact email: copy to clipboard helper + feedback
  const contactEmail = document.getElementById('contact-email');
  const copyFeedback = document.getElementById('copy-feedback');
  if (contactEmail) {
    contactEmail.addEventListener('click', (e) => {
      // if it's a mailto link, both copy and allow mail client if user holds modifier
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(() => {
          showCopyFeedback('Email copied to clipboard');
        }).catch(() => {
          // fallback: open mailto if clipboard fails
          window.location.href = 'mailto:' + mail;
        });
      } else {
        // fallback using a temporary textarea
        const ta = document.createElement('textarea');
        ta.value = mail;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showCopyFeedback('Email copied to clipboard');
        } catch (err) {
          window.location.href = 'mailto:' + mail;
        }
        document.body.removeChild(ta);
      }
    });

    contactEmail.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        contactEmail.click();
      }
    });
  }

  function showCopyFeedback(text = 'Copied') {
    if (!copyFeedback) return;
    copyFeedback.textContent = text;
    copyFeedback.classList.add('show');
    setTimeout(() => { copyFeedback.classList.remove('show'); }, 2000);
  }

  // small performance helper: debounce window resize (placeholder)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeTimer = null; }, 120);
  });
});
