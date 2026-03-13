// DOM Ready
document.addEventListener('DOMContentLoaded', function() {
    // ========== TYPING ANIMATION (roles only) ==========
    const typedText = document.getElementById('typed-text');
    const roles = ['Video Editor', 'Colorist', 'Motion Designer', 'Storyteller'];
    
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typingSpeed = 100;
    let deletingSpeed = 50;
    let pauseDuration = 2000;

    function typeRole() {
        if (!typedText) return;
        
        const currentRole = roles[roleIndex];
        
        if (!isDeleting) {
            typedText.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
            
            if (charIndex === currentRole.length) {
                setTimeout(() => {
                    isDeleting = true;
                    typeRole();
                }, pauseDuration);
                return;
            }
        } else {
            typedText.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
            
            if (charIndex === 0) {
                isDeleting = false;
                roleIndex = (roleIndex + 1) % roles.length;
                setTimeout(typeRole, 500);
                return;
            }
        }
        
        setTimeout(typeRole, isDeleting ? deletingSpeed : typingSpeed);
    }

    if (typedText) {
        setTimeout(typeRole, 1000);
    }

    // ========== MOBILE MENU ==========
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    const navLinksItems = document.querySelectorAll('.nav-links a');
    const body = document.body;

    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
            body.classList.toggle('menu-open');
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.className = navLinks.classList.contains('active') ? 'fas fa-times' : 'fas fa-bars';
            }
        });

        navLinksItems.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            });
        });

        document.addEventListener('click', (e) => {
            if (!navLinks.contains(e.target) && !menuToggle.contains(e.target)) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });

        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
            }
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth > 768) {
                navLinks.classList.remove('active');
                menuToggle.classList.remove('active');
                body.classList.remove('menu-open');
                const icon = menuToggle.querySelector('i');
                if (icon) icon.className = 'fas fa-bars';
                navLinks.style.display = 'flex';
            } else {
                if (!navLinks.classList.contains('active')) {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                }
            }
        });
    }

    // ========== VIDEO MODAL ==========
    const modal = document.getElementById('videoModal');
    const modalIframe = document.getElementById('modalIframe');
    const closeModal = document.getElementById('closeModal');
    const watchButtons = document.querySelectorAll('.watch-video');

    watchButtons.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            const videoUrl = this.getAttribute('data-video');
            modalIframe.src = videoUrl;
            modal.classList.add('active');
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        modalIframe.src = '';
    });

    window.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
            modalIframe.src = '';
        }
    });

    // ========== BACK TO TOP ==========
    const backToTop = document.querySelector('.back-to-top');
    function toggleBackToTop() {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    }
    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    menuToggle.classList.remove('active');
                    body.classList.remove('menu-open');
                    const icon = menuToggle.querySelector('i');
                    if (icon) icon.className = 'fas fa-bars';
                }
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ========== FORM SUBMISSION ==========
    const contactForm = document.getElementById('contactForm');
    const toast = document.getElementById('toast');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);
            const data = Object.fromEntries(formData);
            if (toast) {
                toast.classList.add('show');
                setTimeout(() => toast.classList.remove('show'), 3000);
            }
            this.reset();
            console.log('Form submitted:', data);
        });
    }

    // ========== ADDITIONAL EFFECTS ==========
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

    // ========== INTERSECTION OBSERVER ==========
    const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animate-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.project-card, .stat-card, .contact-card, .service-card').forEach(el => {
        observer.observe(el);
    });

    // ========== ANIMATION STYLES (injected) ==========
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
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .project-card:nth-child(1) { animation-delay: 0.1s; }
        .project-card:nth-child(2) { animation-delay: 0.2s; }
        .project-card:nth-child(3) { animation-delay: 0.3s; }
        .service-card:nth-child(1) { animation-delay: 0.1s; }
        .service-card:nth-child(2) { animation-delay: 0.2s; }
        .service-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
    `;
    document.head.appendChild(style);
});
