/* ==========================================================================
   JavaScript Engine - js/engine.js (Otimizado)
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // ==========================================================================
    // Variables and DOM Elements
    // ==========================================================================

    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.querySelector('#backToTop');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const contactForm = document.querySelector('.contact-form');

    let isScrolling = false;
    let currentSection = 'home';

    // ==========================================================================
    // Image Management
    // ==========================================================================

    function initImageHandling() {
        const images = document.querySelectorAll('img[data-src], img[src]');

        images.forEach(img => {
            img.parentElement.classList.add('image-loading');
            
            img.addEventListener('load', function () {
                this.parentElement.classList.remove('image-loading');
                this.style.opacity = '1';
            });

            img.addEventListener('error', function () {
                this.parentElement.classList.remove('image-loading');
                handleImageError(this);
            });
        });

        if ('IntersectionObserver' in window) initLazyLoading();
    }

    function handleImageError(img) {
        const originalSrc = img.src;
        const fileName = originalSrc.split('/').pop();
        const altPaths = [`./imagens/${fileName}`, `./${fileName}`, `src/imagens/${fileName}`, `imagens/${fileName}`];
        
        let attemptIndex = 0;
        
        function tryNextPath() {
            if (attemptIndex < altPaths.length) {
                img.src = altPaths[attemptIndex];
                attemptIndex++;
            } else {
                img.style.display = 'none';
                const fallback = img.nextElementSibling;
                if (fallback && (fallback.classList.contains('profile-fallback') || fallback.classList.contains('project-fallback'))) {
                    fallback.style.display = 'flex';
                }
            }
        }

        img.addEventListener('error', tryNextPath, { once: true });
        tryNextPath();
    }

    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');
        
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const delay = window.innerWidth <= 768 ? 300 : 0;

                    setTimeout(() => {
                        if (img.dataset.src) {
                            img.src = img.dataset.src;
                            img.removeAttribute('data-src');
                        }
                        img.classList.add('fade-in');
                        observer.unobserve(img);
                    }, delay);
                }
            });
        }, { rootMargin: '50px 0px', threshold: 0.1 });

        lazyImages.forEach(img => imageObserver.observe(img));
    }

    // ==========================================================================
    // Navigation Functions
    // ==========================================================================

    function toggleMobileMenu() {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    }

    function closeMobileMenu() {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    }

    function updateActiveNavLink() {
        const scrollPos = window.scrollY + 100;

        sections.forEach(section => {
            const top = section.offsetTop;
            const bottom = top + section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos <= bottom) {
                currentSection = id;
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // Scroll Functions
    // ==========================================================================

    function handleScroll() {
        if (isScrolling) return;

        isScrolling = true;
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }

            updateActiveNavLink();
            animateOnScroll();
            isScrolling = false;
        });
    }

    function smoothScrollTo(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;

        const targetPosition = targetElement.offsetTop - 70;
        window.scrollTo({ top: targetPosition, behavior: 'smooth' });
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;

        elements.forEach(element => {
            const elementTop = element.offsetTop;
            if ((scrollTop + windowHeight) >= (elementTop + 100)) {
                element.classList.add('animate-in');
            }
        });
    }

    // ==========================================================================
    // Form Handling
    // ==========================================================================

    function handleFormSubmit(e) {
        e.preventDefault();
        
        const formData = new FormData(contactForm);
        const formFields = {
            name: formData.get('name'),
            email: formData.get('email'),
            subject: formData.get('subject'),
            message: formData.get('message')
        };

        if (!validateForm(formFields)) {
            showNotification('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }

        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;

        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            contactForm.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }, 2000);
    }

    function validateForm(fields) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return (
            fields.name.trim().length >= 2 &&
            emailRegex.test(fields.email) &&
            fields.subject.trim().length >= 3 &&
            fields.message.trim().length >= 10
        );
    }

    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;

        notification.style.cssText = `
            position: fixed; top: 20px; right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white; padding: 1rem 1.5rem; border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); z-index: 9999;
            opacity: 0; transform: translateX(100%); transition: all 0.3s ease; max-width: 400px;
        `;

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });

        setTimeout(() => {
            if (document.body.contains(notification)) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // ==========================================================================
    // Interactive Effects
    // ==========================================================================

    function addInteractiveEffects() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        document.querySelectorAll('.skill-item').forEach(item => {
            item.addEventListener('mouseenter', function () {
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = 'scale(1.2) rotate(10deg)';
            });
            item.addEventListener('mouseleave', function () {
                const icon = this.querySelector('i');
                if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }

    function addParallaxEffect() {
        const profileCard = document.querySelector('.profile-card');
        if (!profileCard) return;

        const handleParallax = throttle(() => {
            if (window.innerWidth > 768) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.3;
                profileCard.style.transform = `translateY(${rate}px)`;
            } else {
                profileCard.style.transform = 'translateY(0)';
            }
        }, 16);

        window.addEventListener('scroll', handleParallax);
    }

    // ==========================================================================
    // Utility Functions
    // ==========================================================================

    function throttle(func, limit) {
        let inThrottle;
        return function () {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ==========================================================================
    // Event Listeners
    // ==========================================================================

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);
            closeMobileMenu();
        });
    });

    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo('#home');
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }

    window.addEventListener('scroll', throttle(handleScroll, 16));
    window.addEventListener('resize', debounce(() => {
        closeMobileMenu();
        updateActiveNavLink();
    }, 250));

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeMobileMenu();
    });

    document.addEventListener('click', (e) => {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // ==========================================================================
    // Initialization
    // ==========================================================================

    function init() {
        initImageHandling();
        updateActiveNavLink();
        addInteractiveEffects();
        addParallaxEffect();

        // Add loading animations
        const animatedElements = document.querySelectorAll('.hero-content, .section-header');
        animatedElements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.6s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 200);
        });

        animateOnScroll();

        // Mobile image fixes
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                const projectImages = document.querySelectorAll('.project-image img');
                projectImages.forEach((img, index) => {
                    const originalSrc = img.src;
                    setTimeout(() => {
                        img.style.display = 'none';
                        img.src = '';
                        setTimeout(() => {
                            img.src = originalSrc;
                            img.style.display = 'block';
                            setTimeout(() => {
                                if (img.naturalWidth === 0) handleImageError(img);
                            }, 2000);
                        }, 100);
                    }, index * 200);
                });
            }, 500);
        }

        console.log('🚀 Portfólio inicializado com sucesso!');
    }

    init();
});