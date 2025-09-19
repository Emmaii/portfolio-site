// script.js — typed headline, smooth scroll, demo modal, keyboard & copy helpers
// All original behaviour preserved; added modal focus-trap + aria announcements + robust cleanup.

document.addEventListener('DOMContentLoaded', () => {
  // typed headline (rotating phrases)
  const typedEl = document.getElementById('typed');
  const cursorEl = document.querySelector('.cursor');
  const phrases = [
    "hi I'm Emmanuel,",
    "A Prompt Engineer",
    "AI Prototyper",
    "LLM Integration Specialist"
  ];

  let pIndex = 0, ch = 0, deleting = false;
  // Slightly refined timing: type slower, delete a bit quicker
  function tick() {
    if (!typedEl) return;
    const full = phrases[pIndex];
    if (!deleting) {
      typedEl.textContent = full.slice(0, ch + 1);
      ch++;
      if (ch === full.length) { 
        deleting = true; 
        setTimeout(tick, 1300); 
        return; 
      }
    } else {
      typedEl.textContent = full.slice(0, ch - 1);
      ch--;
      if (ch === 0) { 
        deleting = false; 
        pIndex = (pIndex + 1) % phrases.length; 
      }
    }
    setTimeout(tick, deleting ? 45 : 85);
  }
  setTimeout(tick, 500);

  // smooth scroll for "View projects"
  const viewProjects = document.getElementById('view-projects');
  if (viewProjects) {
    viewProjects.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#projects');
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      // announce for screen reader
      target && target.setAttribute('tabindex', '-1') && target.focus();
    });
  }

  // video modal: improved focus trap and robust cleanup
  const modal = document.getElementById('video-modal');
  const videoFrame = document.getElementById('video-frame');
  const closeBtn = document.querySelector('.video-close');

  let lastFocused = null;

  function openModal(src) {
    if (!modal || !videoFrame) return;
    lastFocused = document.activeElement;
    // create iframe safely
    const iframe = document.createElement('iframe');
    iframe.src = src;
    iframe.setAttribute('allow', 'autoplay; encrypted-media; picture-in-picture');
    iframe.setAttribute('allowfullscreen', '');
    iframe.title = 'Project demo';
    iframe.setAttribute('loading', 'lazy');
    videoFrame.innerHTML = '';
    videoFrame.appendChild(iframe);
    modal.setAttribute('aria-hidden', 'false');
    modal.style.display = 'flex';
    document.documentElement.style.overflow = 'hidden';
    // trap focus
    disablePageTabbing();
    if (closeBtn) closeBtn.focus();
    // announce
    modal.setAttribute('aria-live', 'polite');
  }

  function closeModal() {
    if (!modal || !videoFrame) return;
    modal.setAttribute('aria-hidden', 'true');
    modal.style.display = 'none';
    // remove iframe to stop playback
    videoFrame.innerHTML = '';
    document.documentElement.style.overflow = '';
    restorePageTabbing();
    // return focus
    try { lastFocused && lastFocused.focus(); } catch (e) {}
  }

  // disable tabbing outside modal
  const pageTabbables = [];
  function disablePageTabbing() {
    const nodes = document.querySelectorAll('a, button, input, textarea, select, [tabindex]');
    nodes.forEach(n => {
      if (modal && modal.contains(n)) return;
      const prev = n.getAttribute('tabindex');
      pageTabbables.push({ node: n, prev });
      n.setAttribute('tabindex', '-1');
    });
  }
  function restorePageTabbing() {
    pageTabbables.forEach(({ node, prev }) => {
      if (prev === null) node.removeAttribute('tabindex');
      else node.setAttribute('tabindex', prev);
    });
    pageTabbables.length = 0;
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
      // For anchor links (<a>), default behaviour (open in new tab) remains.
    });
  });

  if (closeBtn) closeBtn.addEventListener('click', closeModal);
  if (modal) modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // ensure Enter/Space on project rows triggers repo open
  document.querySelectorAll('.proj').forEach(proj => {
    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
    proj.addEventListener('click', (e) => {
      // don't trigger when clicking on interactive elements inside card
      const interactiveTags = ['A', 'BUTTON', 'SVG', 'PATH'];
      if (interactiveTags.includes(e.target.tagName)) return;
      const url = proj.getAttribute('data-url');
      if (url) window.open(url, '_blank', 'noopener');
    });
  });

  // contact email: copy to clipboard helper + feedback (improved)
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
      // prefer to copy; still allow mail client fallback if copy fails
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      function fallbackMail() { window.location.href = 'mailto:' + mail; }
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(() => {
          showCopyFeedback('Email copied to clipboard');
        }).catch(() => {
          fallbackMail();
        });
      } else {
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
          fallbackMail();
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
    copyFeedback.setAttribute('role', 'status');
    setTimeout(() => { 
      copyFeedback.classList.remove('show'); 
    }, 2000);
  }

  // small performance helper: debounce window resize (placeholder)
  let resizeTimer = null;
  window.addEventListener('resize', () => {
    if (resizeTimer) clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => { resizeTimer = null; }, 120);
  });
});

// Certificate interaction — keep original behaviour but safer checks
document.querySelectorAll('.certification').forEach(cert => {
  cert.addEventListener('click', (e) => {
    const interactiveTags = ['A', 'BUTTON', 'SVG', 'PATH'];
    if (interactiveTags.includes(e.target.tagName)) return;
    const anchor = cert.querySelector('a');
    if (anchor && anchor.href) window.open(anchor.href, '_blank', 'noopener');
  });
  
  cert.addEventListener('keydown', (e) => {
    if ((e.key === 'Enter' || e.key === ' ') && cert.querySelector('a')) {
      e.preventDefault();
      const anchor = cert.querySelector('a');
      if (anchor && anchor.href) window.open(anchor.href, '_blank', 'noopener');
    }
  });
});

// Smooth scrolling for certificate button
const viewCertificates = document.getElementById('view-certificates');
if (viewCertificates) {
  viewCertificates.addEventListener('click', (e) => {
    e.preventDefault();
    const target = document.querySelector('#certifications-heading');
    if (target) {
      target.scrollIntoView({ 
        behavior: 'smooth',
        block: 'start'
      });
      target.setAttribute('tabindex', '-1');
      target.focus();
    }
  });
}

