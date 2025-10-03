// script.js - Portfolio interactions and animations
document.addEventListener('DOMContentLoaded', function() {
    // Continuous typing animation for hero section
    const typedEl = document.getElementById('typed');
    if (typedEl) {
        const phrases = [
            "Mathematics Educator — Grade 1-12",
            "GCSE & A-Level Specialist", 
            "Curriculum Developer & Tutor",
            "Exam-Focused Lesson Creator"
        ];
        
        let pIndex = 0;
        let ch = 0;
        let deleting = false;
        let typingPaused = false;

        function typeAnimation() {
            if (typingPaused || !typedEl) return;
            
            const fullText = phrases[pIndex];
            
            if (!deleting) {
                // Typing forward
                typedEl.textContent = fullText.slice(0, ch + 1);
                ch++;
                
                if (ch === fullText.length) {
                    // Pause at end of word
                    deleting = true;
                    setTimeout(typeAnimation, 1500);
                    return;
                }
            } else {
                // Deleting
                typedEl.textContent = fullText.slice(0, ch - 1);
                ch--;
                
                if (ch === 0) {
                    deleting = false;
                    pIndex = (pIndex + 1) % phrases.length;
                }
            }
            
            setTimeout(typeAnimation, deleting ? 40 : 70);
        }
        
        // Start the animation
        typeAnimation();
        
        // Pause typing when user interacts with important elements
        document.addEventListener('click', function(e) {
            if (e.target.closest('.btn') || e.target.closest('.contact-box')) {
                typingPaused = true;
                typedEl.textContent = "Mathematics Educator — Grade 1-12";
            }
        });
    }

    // Copy email to clipboard functionality
    const copyEmailBtn = document.getElementById('copy-email');
    if (copyEmailBtn) {
        copyEmailBtn.addEventListener('click', async function(e) {
            e.preventDefault();
            const email = 'emmaabusinesss@gmail.com';
            
            try {
                await navigator.clipboard.writeText(email);
                showCopyFeedback('📧 Email copied to clipboard');
            } catch (err) {
                // Fallback for older browsers
                const textArea = document.createElement('textarea');
                textArea.value = email;
                textArea.style.position = 'fixed';
                textArea.style.left = '-999999px';
                textArea.style.top = '-999999px';
                document.body.appendChild(textArea);
                textArea.focus();
                textArea.select();
                
                try {
                    document.execCommand('copy');
                    showCopyFeedback('📧 Email copied to clipboard');
                } catch (err) {
                    showCopyFeedback('❌ Copy failed - please copy manually');
                }
                
                document.body.removeChild(textArea);
            }
        });
    }

    // Copy feedback notification
    function showCopyFeedback(message) {
        const feedbackEl = document.getElementById('copy-feedback');
        if (!feedbackEl) return;
        
        feedbackEl.textContent = message;
        feedbackEl.classList.add('show');
        
        // Announce to screen readers
        const srAnnouncement = document.createElement('div');
        srAnnouncement.setAttribute('aria-live', 'polite');
        srAnnouncement.className = 'sr-only';
        srAnnouncement.textContent = message;
        document.body.appendChild(srAnnouncement);
        
        setTimeout(() => {
            feedbackEl.classList.remove('show');
            document.body.removeChild(srAnnouncement);
        }, 3000);
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Project card click interactions
    document.querySelectorAll('.proj[data-url]').forEach(project => {
        project.addEventListener('click', function(e) {
            if (e.target.closest('a') || e.target.closest('button')) return;
            
            const url = this.getAttribute('data-url');
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
        
        // Keyboard accessibility
        project.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const url = this.getAttribute('data-url');
                if (url) {
                    window.open(url, '_blank', 'noopener,noreferrer');
                }
            }
        });
    });

    // Loading states for buttons
    document.querySelectorAll('.btn[href], .btn-download[href]').forEach(button => {
        button.addEventListener('click', function(e) {
            if (!this.href || this.href.startsWith('#')) return;
            
            const originalHtml = this.innerHTML;
            this.innerHTML = '⏳ Loading...';
            this.style.opacity = '0.7';
            
            setTimeout(() => {
                this.innerHTML = originalHtml;
                this.style.opacity = '1';
            }, 1500);
        });
    });

    // Mobile menu toggle (if needed in future)
    let mobileMenuToggler = null;
    
    function initMobileMenu() {
        // This can be expanded if you add a navigation menu later
        console.log('Mobile menu ready for future implementation');
    }

    // Initialize all functionality
    initMobileMenu();
    
    console.log('Portfolio website loaded successfully!');
});
