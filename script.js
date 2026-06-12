// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // ============================================
    // FIXED TYPING ANIMATION - Complete each word
    // ============================================
    const typedText = document.getElementById('typed-text');
    const words = [
        'Emmanuel Silas Kelechi',
        'Aspiring AI & Data Intern',
        'ML Engineer',
        'LLM Enthusiast'
    ];
    
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100; // typing speed in ms
    let deletingSpeed = 50; // deleting speed in ms
    let pauseDuration = 2000; // pause at the end of each word

    function type() {
        if (!typedText) return;
        
        const currentWord = words[wordIndex];
        
        // If we're typing
        if (!isDeleting) {
            // Type the next character
            typedText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            
            // If word is complete
            if (charIndex === currentWord.length) {
                // Pause at the end of the word
                setTimeout(() => {
                    isDeleting = true;
                    type();
                }, pauseDuration);
                return;
            }
        } 
        // If we're deleting
        else {
            // Delete the last character
            typedText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            
            // If word is completely deleted
            if (charIndex === 0) {
                isDeleting = false;
                // Move to next word
                wordIndex = (wordIndex + 1) % words.length;
                // Small pause before starting next word
                setTimeout(type, 500);
                return;
            }
        }
        
        // Calculate speed
        const speed = isDeleting ? deletingSpeed : typingSpeed;
        
        // Call next iteration
        setTimeout(type, speed);
    }

    // Start typing animation after a short delay
    if (typedText) {
        setTimeout(type, 1000);
    }

    // ============================================
    // FIXED MOBILE MENU - Proper alignment
    // ============================================
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const body = document.body;
    
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            
            // Toggle menu
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
            
            // Update icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('active') 
                    ? 'fas fa-times' 
                    : 'fas fa-bars';
            }
        });

        // Close menu when clicking on a link
        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        // Close menu on escape key
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
            }
        });

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                
                // Reset icon
                const icon = menuToggle.querySelector('i');
                if (icon) {
                    icon.className = 'fas fa-bars';
                }
                
                // Ensure nav-links is visible on desktop
                navLinks.style.display = 'flex';
            } else {
                // Hide nav-links on mobile when not active
                if (!navLinks.classList.contains('active')) {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                }
            }
        });
    }

    // Back to Top Button
    const backToTop = document.querySelector('.back-to-top');
    
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop(); // Initial check

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                    
                    // Reset icon
                    const icon = menuToggle.querySelector('i');
                    if (icon) {
                        icon.className = 'fas fa-bars';
                    }
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            
            // Show success message
            if (toast) {
                toast.classList.add('show');
                
                // Hide toast after 3 seconds
                setTimeout(() => {
                    toast.classList.remove('show');
                }, 3000);
            }
            
            // Reset form
            this.reset();
            
            // Log for debugging
            console.log('Form submitted:', data);
        });
    }

    // Add hover effects to project cards (only on non-touch devices)
    if (window.matchMedia("(hover: hover)").matches) {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0)';
            });
        });
    }

    // Intersection Observer for animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    document.querySelectorAll('.project-card, .stat-card, .contact-card').forEach(el => {
        observer.observe(el);
    });

    // Copy email to clipboard
    const emailLinks = document.querySelectorAll('.contact-link[href^="mailto:"]');
    emailLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            if (navigator.clipboard) {
                e.preventDefault();
                const email = this.href.replace('mailto:', '');
                navigator.clipboard.writeText(email).then(() => {
                    // Show copied notification
                    if (toast) {
                        toast.textContent = 'Email copied to clipboard!';
                        toast.style.background = 'var(--accent-blue)';
                        toast.classList.add('show');
                        
                        setTimeout(() => {
                            toast.classList.remove('show');
                            toast.textContent = 'Message sent successfully!';
                            toast.style.background = 'var(--success)';
                        }, 2000);
                    }
                }).catch(err => {
                    console.error('Failed to copy email:', err);
                    // Fallback: open email client
                    window.location.href = `mailto:${email}`;
                });
            }
        });
    });

    // Prevent form zoom on iOS
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('focus', function() {
            this.style.fontSize = '16px';
        });
    });

    // Improve performance on mobile
    let resizeTimer;
    window.addEventListener('resize', () => {
        document.body.classList.add('resize-animation-stopper');
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            document.body.classList.remove('resize-animation-stopper');
        }, 400);
    });
});

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    .resize-animation-stopper * {
        animation: none !important;
        transition: none !important;
    }

    .animate-in {
        animation: fadeInUp 0.6s ease-out forwards;
        opacity: 0;
    }

    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    .project-card:nth-child(1) { animation-delay: 0.1s; }
    .project-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(1) { animation-delay: 0.1s; }
    .stat-card:nth-child(2) { animation-delay: 0.2s; }
    .stat-card:nth-child(3) { animation-delay: 0.3s; }
    .contact-card:nth-child(1) { animation-delay: 0.1s; }
    .contact-card:nth-child(2) { animation-delay: 0.2s; }
    .contact-card:nth-child(3) { animation-delay: 0.3s; }
`;
document.head.appendChild(style);
