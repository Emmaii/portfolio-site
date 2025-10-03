// script.js - Enhanced for Mathematics Educator Portfolio

document.addEventListener('DOMContentLoaded', () => {
  // Enhanced typed headline with teaching focus
  const typedEl = document.getElementById('typed');
  const cursorEl = document.querySelector('.cursor');
  const phrases = [
    "Mathematics Educator — Grade 1-12",
    "GCSE & A-Level Specialist", 
    "Curriculum Developer & Tutor",
    "Available for Teaching Roles",
    "Exam-Focused Lesson Creator"
  ];

  let pIndex = 0, ch = 0, deleting = false, typingPaused = false;

  function tick() {
    if (!typedEl || typingPaused) return;
    const full = phrases[pIndex];
    if (!deleting) {
      typedEl.textContent = full.slice(0, ch + 1);
      ch++;
      if (ch === full.length) { 
        deleting = true; 
        setTimeout(tick, 1500); // Longer pause at full phrase
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

  // Pause typing when user interacts with important elements
  document.addEventListener('click', () => { 
    if (!typingPaused) {
      typingPaused = true;
      if (typedEl) typedEl.textContent = "Mathematics Educator — Grade 1-12, GCSE & A-Level";
    }
  });
  
  tick();

  // Enhanced smooth scroll with offset for fixed headers
  const viewProjects = document.getElementById('view-projects');
  if (viewProjects) {
    viewProjects.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector('#projects');
      if (target) {
        const offsetTop = target.getBoundingClientRect().top + window.pageYOffset - 20;
        window.scrollTo({ top: offsetTop, behavior: 'smooth' });
      }
    });
  }

  // Copy plain CV to clipboard (for Indeed and application forms)
  const copyCvBtn = document.getElementById('copy-cv');
  if (copyCvBtn) {
    copyCvBtn.addEventListener('click', async () => {
      const pre = document.getElementById('plain-cv');
      if (!pre) return;
      const text = pre.textContent.trim();
      try {
        await navigator.clipboard.writeText(text);
        showCopyFeedback('✅ CV text copied — ready to paste into application forms');
      } catch (err) {
        // Fallback for older browsers
        const textArea = document.createElement('textarea');
        textArea.value = text;
        textArea.style.position = 'fixed';
        textArea.style.left = '-9999px';
        document.body.appendChild(textArea);
        textArea.select();
        try {
          document.execCommand('copy');
          showCopyFeedback('✅ CV text copied — ready to paste into application forms');
        } catch (fallbackErr) {
          showCopyFeedback('❌ Copy failed — please select and copy the text manually');
        }
        document.body.removeChild(textArea);
      }
    });
  }

  // Copy email to clipboard
  const copyEmail = document.getElementById('copy-email');
  if (copyEmail) {
    copyEmail.addEventListener('click', async (e) => {
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      try {
        await navigator.clipboard.writeText(mail);
        showCopyFeedback('📧 Email copied to clipboard');
      } catch (err) {
        // Fallback: open mail client
        window.location.href = 'mailto:' + mail + '?subject=Mathematics%20Teaching%20Inquiry';
      }
    });
  }

  // Enhanced copy feedback with accessibility
  const copyFeedback = document.getElementById('copy-feedback');
  function showCopyFeedback(msg = 'Copied to clipboard') {
    if (!copyFeedback) return;
    
    copyFeedback.textContent = msg;
    copyFeedback.style.display = 'block';
    copyFeedback.setAttribute('aria-live', 'assertive');
    
    // Enhanced screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = msg;
    document.body.appendChild(announcement);
    
    setTimeout(() => { 
      copyFeedback.style.display = 'none';
      copyFeedback.removeAttribute('aria-live');
      document.body.removeChild(announcement);
    }, 3000);
  }

  // Project card interactions
  document.querySelectorAll('.proj').forEach(proj => {
    // Click to open main link if available
    proj.addEventListener('click', (e) => {
      // Don't trigger if user clicked on interactive elements
      if (e.target.closest('a') || e.target.closest('button')) return;
      
      const url = proj.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener');
      }
    });

    // Keyboard navigation support
    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
  });

  // IntersectionObserver for subtle scroll animations
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          observer.unobserve(entry.target);
        }
      });
    }, { 
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });

    document.querySelectorAll('.proj').forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(20px)';
      card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
      observer.observe(card);
    });
  }

  // Track outbound links for analytics (placeholder for future implementation)
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Here you would send to Google Analytics
      console.log('Outbound link clicked:', link.href);
    });
  });

  // Loading states for better UX
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.href && !this.href.startsWith('#')) {
        const originalText = this.innerHTML;
        this.innerHTML = '⏳ Loading...';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 1500);
      }
    });
  });

  // Performance optimization: debounced resize handler
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Future layout adjustments on resize
    }, 250);
  });
});

// Screen reader only utility class
const style = document.createElement('style');
style.textContent = `
  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border: 0;
  }
`;
document.head.appendChild(style);
