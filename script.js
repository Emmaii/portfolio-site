// script.js — Enhanced for tutoring business conversion

document.addEventListener('DOMContentLoaded', () => {
  // Enhanced typed headline with teaching focus
  const typedEl = document.getElementById('typed');
  const cursorEl = document.querySelector('.cursor');
  const phrases = [
    "Transform Maths Anxiety into Confidence",
    "GCSE & A-Level Specialist",
    "5-Minute Lesson Expert", 
    "EdTech Innovator",
    "Book Your Free Trial Lesson"
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

  // Pause typing when user interacts
  document.addEventListener('click', () => { typingPaused = true; });
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

  // Enhanced project card interactions
  document.querySelectorAll('.proj').forEach(proj => {
    // Click to open main link if available
    proj.addEventListener('click', (e) => {
      if (e.target.closest('a') || e.target.closest('button')) return;
      
      const url = proj.getAttribute('data-url');
      if (url) {
        window.open(url, '_blank', 'noopener');
      }
    });

    // Keyboard navigation
    proj.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        const url = proj.getAttribute('data-url');
        if (url) window.open(url, '_blank', 'noopener');
      }
    });
  });

  // Enhanced email copy with better UX
  const contactEmail = document.getElementById('contact-email');
  const copyFeedback = document.getElementById('copy-feedback');
  
  if (contactEmail) {
    contactEmail.addEventListener('click', (e) => {
      e.preventDefault();
      const mail = 'emmaabusinesss@gmail.com';
      
      // Enhanced copy with fallback
      if (navigator.clipboard && window.isSecureContext) {
        navigator.clipboard.writeText(mail).then(() => {
          showCopyFeedback('📧 Email copied! Ready to help with maths questions.');
        }).catch(() => {
          window.location.href = 'mailto:' + mail + '?subject=Maths%20Tutoring%20Inquiry&body=Hi%20Emmanuel,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20learn%20more%20about%20your%20tutoring.';
        });
      } else {
        // Fallback with textarea
        const ta = document.createElement('textarea');
        ta.value = mail;
        ta.style.position = 'fixed';
        ta.style.left = '-9999px';
        document.body.appendChild(ta);
        ta.select();
        try {
          document.execCommand('copy');
          showCopyFeedback('📧 Email copied! Ready to help with maths questions.');
        } catch (err) {
          window.location.href = 'mailto:' + mail + '?subject=Maths%20Tutoring%20Inquiry&body=Hi%20Emmanuel,%20I%20saw%20your%20portfolio%20and%20would%20like%20to%20learn%20more%20about%20your%20tutoring.';
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

  function showCopyFeedback(text = 'Copied!') {
    if (!copyFeedback) return;
    copyFeedback.textContent = text;
    copyFeedback.classList.add('show');
    copyFeedback.setAttribute('role', 'status');
    
    // Enhanced screen reader announcement
    const announcement = document.createElement('div');
    announcement.setAttribute('aria-live', 'polite');
    announcement.setAttribute('class', 'sr-only');
    announcement.textContent = text;
    document.body.appendChild(announcement);
    
    setTimeout(() => { 
      copyFeedback.classList.remove('show');
      document.body.removeChild(announcement);
    }, 3000);
  }

  // Track outbound links for analytics (placeholder)
  document.querySelectorAll('a[target="_blank"]').forEach(link => {
    link.addEventListener('click', (e) => {
      // Here you would send to Google Analytics
      console.log('Outbound link clicked:', link.href);
    });
  });

  // Performance optimization
  let resizeTimer;
  window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(() => {
      // Recalculate any layout-dependent values
    }, 250);
  });

  // Add loading state for buttons
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      if (this.href && !this.href.startsWith('#')) {
        const originalText = this.innerHTML;
        this.innerHTML = '🎯 Loading...';
        setTimeout(() => {
          this.innerHTML = originalText;
        }, 1500);
      }
    });
  });
});

// Add intersection observer for animations (optional enhancement)
if ('IntersectionObserver' in window) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = "1";
        entry.target.style.transform = "translateY(0)";
      }
    });
  });

  document.querySelectorAll('.proj').forEach(card => {
    card.style.opacity = "0";
    card.style.transform = "translateY(20px)";
    card.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(card);
  });
}
