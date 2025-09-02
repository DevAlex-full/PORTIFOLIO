/* ==========================================================================
   JavaScript Engine - js/engine.js
   ========================================================================== */

document.addEventListener('DOMContentLoaded', function() {
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
            
            // Header background on scroll
            if (scrollTop > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
            
            // Back to top button
            if (scrollTop > 300) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
            
            // Update active navigation
            updateActiveNavLink();
            
            // Animate elements on scroll
            animateOnScroll();
            
            isScrolling = false;
        });
    }

    function smoothScrollTo(target) {
        const targetElement = document.querySelector(target);
        if (!targetElement) return;
        
        const targetPosition = targetElement.offsetTop - 70;
        
        window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
        });
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
        const windowHeight = window.innerHeight;
        const scrollTop = window.pageYOffset;
        
        elements.forEach(element => {
            const elementTop = element.offsetTop;
            const elementHeight = element.offsetHeight;
            const elementBottom = elementTop + elementHeight;
            
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
        
        // Basic validation
        if (!validateForm(formFields)) {
            showNotification('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }
        
        // Show loading state
        const submitBtn = contactForm.querySelector('button[type="submit"]');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Enviando...';
        submitBtn.disabled = true;
        
        // Simulate form submission (replace with actual form handling)
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
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.notification');
        existingNotifications.forEach(notification => notification.remove());
        
        // Create notification element
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button class="notification-close">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        
        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
            z-index: 9999;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
            max-width: 400px;
        `;
        
        document.body.appendChild(notification);
        
        // Animate in
        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });
        
        // Close functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        });
        
        // Auto remove after 5 seconds
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
    
    function addHoverEffects() {
        const projectCards = document.querySelectorAll('.project-card');
        const skillItems = document.querySelectorAll('.skill-item');
        
        projectCards.forEach(card => {
            card.addEventListener('mouseenter', function() {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });
            
            card.addEventListener('mouseleave', function() {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });
        
        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function() {
                const icon = this.querySelector('i');
                icon.style.transform = 'scale(1.2) rotate(10deg)';
            });
            
            item.addEventListener('mouseleave', function() {
                const icon = this.querySelector('i');
                icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    }
    
    function addParallaxEffect() {
        const hero = document.querySelector('.hero');
        const profileCard = document.querySelector('.profile-card');
        
        window.addEventListener('scroll', () => {
            if (window.innerWidth > 768) {
                const scrolled = window.pageYOffset;
                const rate = scrolled * -0.5;
                
                if (hero && profileCard) {
                    profileCard.style.transform = `translateY(${rate}px)`;
                }
            }
        });
    }
    
    function addTypingEffect() {
        const titles = document.querySelectorAll('.hero-title');
        
        titles.forEach(title => {
            const text = title.textContent;
            title.textContent = '';
            
            let i = 0;
            const typeWriter = setInterval(() => {
                if (i < text.length) {
                    title.textContent += text.charAt(i);
                    i++;
                } else {
                    clearInterval(typeWriter);
                }
            }, 100);
        });
    }

    // ==========================================================================
    // Utility Functions
    // ==========================================================================
    
    function debounce(func, wait, immediate) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                timeout = null;
                if (!immediate) func(...args);
            };
            const callNow = immediate && !timeout;
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
            if (callNow) func(...args);
        };
    }
    
    function throttle(func, limit) {
        let inThrottle;
        return function() {
            const args = arguments;
            const context = this;
            if (!inThrottle) {
                func.apply(context, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }

    // ==========================================================================
    // Event Listeners
    // ==========================================================================
    
    // Mobile menu toggle
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', toggleMobileMenu);
    }
    
    // Navigation links
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            smoothScrollTo(targetId);
            closeMobileMenu();
        });
    });
    
    // Back to top button
    if (backToTopBtn) {
        backToTopBtn.addEventListener('click', (e) => {
            e.preventDefault();
            smoothScrollTo('#home');
        });
    }
    
    // Form submission
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // Scroll events (throttled for performance)
    window.addEventListener('scroll', throttle(handleScroll, 16));
    
    // Resize events
    window.addEventListener('resize', debounce(() => {
        closeMobileMenu();
        updateActiveNavLink();
    }, 250));
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeMobileMenu();
        }
    });
    
    // Click outside to close mobile menu
    document.addEventListener('click', (e) => {
        if (!hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // ==========================================================================
    // Initialization
    // ==========================================================================
    
    function init() {
        // Initial setup
        updateActiveNavLink();
        addHoverEffects();
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
        
        // Initialize scroll animations
        animateOnScroll();
        
        console.log('🚀 Portfólio inicializado com sucesso!');
    }
    
    // Initialize everything
    init();
    
    // ==========================================================================
    // Service Worker Registration (Optional)
    // ==========================================================================
    
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => {
            navigator.serviceWorker.register('/sw.js')
                .then(registration => {
                    console.log('SW registered: ', registration);
                })
                .catch(registrationError => {
                    console.log('SW registration failed: ', registrationError);
                });
        });
    }
});

/* ==========================================================================
   Additional Utility Functions
   ========================================================================== */

// Smooth scroll polyfill for older browsers
(function() {
    'use strict';
    
    if (!Element.prototype.scrollIntoView) return;
    
    const originalScrollIntoView = Element.prototype.scrollIntoView;
    
    Element.prototype.scrollIntoView = function(options) {
        if (typeof options === 'object') {
            return originalScrollIntoView.call(this, options);
        }
        
        return originalScrollIntoView.call(this, {
            behavior: 'smooth',
            block: 'start',
            inline: 'nearest'
        });
    };
})();

// Performance monitoring
(function() {
    'use strict';
    
    if (!window.performance) return;
    
    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
            
            if (pageLoadTime > 0) {
                console.log(`⚡ Página carregada em: ${pageLoadTime}ms`);
            }
        }, 0);
    });
})();