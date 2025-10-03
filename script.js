// script.js — lightweight, looping typing, lazy-friendly interactions
document.addEventListener('DOMContentLoaded', () => {
  /* Typing animation: loops indefinitely, no pause-on-click */
  const typedEl = document.getElementById('typed');
  if (typedEl) {
    const phrases = [
      "Mathematics Educator — Grade 1-12",
      "GCSE & A-Level Specialist",
      "Curriculum Developer & Tutor",
      "Prompt Engineering & EdTech"
    ];
    let pIndex = 0, ch = 0, deleting = false;

    function tick() {
      const full = phrases[pIndex];
      if (!deleting) {
        typedEl.textContent = full.slice(0, ch + 1);
        ch++;
        if (ch === full.length) {
          deleting = true;
          setTimeout(tick, 1000); // pause at full phrase
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
      setTimeout(tick, deleting ? 40 : 70);
    }
    tick();
  }

  /* Copy email to clipboard */
  const copyEmail = document.getElementById('copy-email');
  if (copyEmail) {
    copyEmail.addEventListener('click', async (e) => {
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      try {
        await navigator.clipboard.writeText(mail);
        showCopyFeedback('📧 Email copied to clipboard');
      } catch (err) {
        // fallback: open mail client
        window.location.href = `mailto:${mail}?subject=Teaching%20Inquiry`;
      }
    });
  }

  /* Show copy feedback (SR-friendly) */
  const fb = document.getElementById('copy-feedback');
  function showCopyFeedback(msg) {
    if (!fb) return;
    fb.textContent = msg;
    fb.classList.add('show');
    fb.style.display = 'flex';
    const sr = document.createElement('div');
    sr.className = 'sr-only';
    sr.setAttribute('aria-live', 'polite');
    sr.textContent = msg;
    document.body.appendChild(sr);
    setTimeout(() => {
      fb.classList.remove('show');
      fb.style.display = 'none';
      document.body.removeChild(sr);
    }, 2600);
  }

  // Light button loading state — short, non-blocking
  document.querySelectorAll('.btn[href], .btn-download[href]').forEach(btn => {
    btn.addEventListener('click', function (e) {
      if (!this.href || this.href.startsWith('#')) return;
      const original = this.innerHTML;
      this.innerHTML = '⏳ Loading...';
      this.style.opacity = '0.85';
      setTimeout(() => {
        this.innerHTML = original;
        this.style.opacity = '1';
      }, 900);
    });
  });

  // Minimal IntersectionObserver for the few project cards (keeps paint cost low)
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver((entries, obs) => {
      entries.forEach(en => {
        if (en.isIntersecting) {
          en.target.style.opacity = '1';
          en.target.style.transform = 'translateY(0)';
          obs.unobserve(en.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.proj').forEach(el => {
      el.style.opacity = '0';
      el.style.transform = 'translateY(10px)';
      el.style.transition = 'opacity .5s ease, transform .5s ease';
      io.observe(el);
    });
  }
});
