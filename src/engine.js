/* ==========================================================================
   JavaScript Engine - js/engine.js
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
    // Image Management Functions
    // ==========================================================================

    function initImageHandling() {
        const images = document.querySelectorAll('img[data-src], img[src]');

        images.forEach(img => {
            // Add loading state
            img.parentElement.classList.add('image-loading');

            img.addEventListener('load', function () {
                this.parentElement.classList.remove('image-loading');
                this.style.opacity = '1';
            });

            img.addEventListener('error', function () {
                console.warn(`Falha ao carregar imagem: ${this.src}`);
                this.parentElement.classList.remove('image-loading');
                handleImageError(this);
            });
        });

        // Initialize lazy loading if supported
        if ('IntersectionObserver' in window) {
            initLazyLoading();
        }
    }

    function handleImageError(img) {
        console.log('Erro ao carregar imagem:', img.src);

        // Tenta diferentes caminhos alternativos
        const originalSrc = img.src;
        const fileName = originalSrc.split('/').pop();

        // Tentativas com caminhos alternativos
        const altPaths = [
            `./imagens/${fileName}`,
            `./${fileName}`,
            `src/imagens/${fileName}`,
            `imagens/${fileName}`
        ];

        let attemptIndex = 0;

        function tryNextPath() {
            if (attemptIndex < altPaths.length) {
                img.src = altPaths[attemptIndex];
                attemptIndex++;
            } else {
                // Se todas as tentativas falharam, mostra o fallback
                img.style.display = 'none';
                const fallback = img.nextElementSibling;
                if (fallback && (fallback.classList.contains('profile-fallback') ||
                    fallback.classList.contains('project-fallback'))) {
                    fallback.style.display = 'flex';
                }
            }
        }

        img.addEventListener('error', tryNextPath, { once: true });
        tryNextPath();
    }

    function updateProjectFallbackIcon(fallback, projectTitle) {
    if (!fallback) return;
    
    let iconClass = 'fas fa-laptop-code';
    let projectName = projectTitle;
    
    // Define ícone baseado no projeto
    if (projectTitle.toLowerCase().includes('spider') || projectTitle.toLowerCase().includes('aranha')) {
        iconClass = 'fas fa-mask';
        projectName = 'Spider-Man';
    } else if (projectTitle.toLowerCase().includes('mundo') || projectTitle.toLowerCase().includes('invertido')) {
        iconClass = 'fas fa-magic';
        projectName = 'Stranger Things';
    } else if (projectTitle.toLowerCase().includes('barber')) {
        iconClass = 'fas fa-cut';
        projectName = 'Barbearia';
    }
    
    fallback.innerHTML = `
        <i class="${iconClass}"></i>
        <span>${projectName}</span>
    `;
}

    function initLazyLoading() {
        const lazyImages = document.querySelectorAll('img[loading="lazy"]');

        if ('IntersectionObserver' in window) {
            const imageObserver = new IntersectionObserver((entries, observer) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;

                        // Adiciona um delay para mobile
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
            }, {
                rootMargin: '50px 0px',
                threshold: 0.1
            });

            lazyImages.forEach(img => {
                imageObserver.observe(img);
            });
        }
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
            card.addEventListener('mouseenter', function () {
                this.style.transform = 'translateY(-10px) scale(1.02)';
            });

            card.addEventListener('mouseleave', function () {
                this.style.transform = 'translateY(0) scale(1)';
            });
        });

        skillItems.forEach(item => {
            item.addEventListener('mouseenter', function () {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1.2) rotate(10deg)';
                }
            });

            item.addEventListener('mouseleave', function () {
                const icon = this.querySelector('i');
                if (icon) {
                    icon.style.transform = 'scale(1) rotate(0deg)';
                }
            });
        });
    }

    function addParallaxEffect() {
        const hero = document.querySelector('.hero');
        const profileCard = document.querySelector('.profile-card');

        if (!hero || !profileCard) return;

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
    // Performance Optimization
    // ==========================================================================

    function optimizeImages() {
        const images = document.querySelectorAll('img');

        images.forEach(img => {
            // Add loading="lazy" if not present
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }

            // Add proper alt attributes if missing
            if (!img.getAttribute('alt')) {
                const src = img.src || img.dataset.src || '';
                const filename = src.split('/').pop().split('.')[0];
                img.setAttribute('alt', filename.replace(/[_-]/g, ' '));
            }
        });
    }

    function preloadCriticalImages() {
        const criticalImages = [
            './src/imagens/EU1.jpg',
            './favicon-32x32.png'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
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
        if (hamburger && navMenu &&
            !hamburger.contains(e.target) &&
            !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // ==========================================================================
    // Initialization
    // ==========================================================================

    function init() {
        // Initialize image handling
        initImageHandling();
        optimizeImages();
        preloadCriticalImages();

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

        // Handle image errors on load
        setTimeout(() => {
            const images = document.querySelectorAll('img');
            images.forEach(img => {
                if (img.naturalWidth === 0 && img.naturalHeight === 0) {
                    handleImageError(img);
                }
            });
        }, 1000);

        console.log('🚀 Portfólio inicializado com sucesso!');
    }

    // Dentro da função init(), após as outras inicializações
    setTimeout(() => {
        fixProjectImagesOnMobile();
    }, 1000);

    // Verifica imagens especificamente no mobile
        if (window.innerWidth <= 768) {
            setTimeout(checkMobileImageSupport, 500);
        }

    // Initialize everything
    init();

    function testImageConnectivity() {
        const testImages = [
            './src/imagens/EU1.jpg',
            './src/imagens/homem-aranha1.png',
            './src/imagens/mundo-invertido1.png',
            './src/imagens/barbearia1.png'
        ];

        testImages.forEach((src, index) => {
            const testImg = new Image();
            testImg.onload = () => console.log(`✅ Imagem ${index + 1} carregou: ${src}`);
            testImg.onerror = () => console.error(`❌ Erro ao carregar imagem ${index + 1}: ${src}`);
            testImg.src = src;
        });
    }

    // Chame esta função no final da função init()

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

    // ==========================================================================
    // Additional Image Utilities
    // ==========================================================================

    function createImagePlaceholder(width = 300, height = 200, text = '') {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');

        canvas.width = width;
        canvas.height = height;

        // Background gradient
        const gradient = ctx.createLinearGradient(0, 0, width, height);
        gradient.addColorStop(0, '#8b5cf6');
        gradient.addColorStop(1, '#a855f7');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);

        // Text
        if (text) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 16px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(text, width / 2, height / 2);
        }

        return canvas.toDataURL();
    }

    function retryImageLoad(img, maxRetries = 3) {
        let retries = 0;
        const originalSrc = img.src;

        function attemptLoad() {
            if (retries >= maxRetries) {
                handleImageError(img);
                return;
            }

            retries++;
            img.src = '';

            setTimeout(() => {
                img.src = originalSrc + '?retry=' + retries;
            }, 1000 * retries);
        }

        img.addEventListener('error', attemptLoad, { once: true });
    }

    // ==========================================================================
    // Accessibility Improvements
    // ==========================================================================

    function improveAccessibility() {
        // Add skip link
        const skipLink = document.createElement('a');
        skipLink.href = '#main-content';
        skipLink.textContent = 'Pular para conteúdo principal';
        skipLink.className = 'skip-link';
        skipLink.style.cssText = `
            position: absolute;
            top: -40px;
            left: 6px;
            background: var(--primary-color);
            color: white;
            padding: 8px;
            text-decoration: none;
            border-radius: 4px;
            z-index: 10000;
            transition: top 0.3s;
        `;

        skipLink.addEventListener('focus', () => {
            skipLink.style.top = '6px';
        });

        skipLink.addEventListener('blur', () => {
            skipLink.style.top = '-40px';
        });

        document.body.insertBefore(skipLink, document.body.firstChild);

        // Add main content id
        const heroSection = document.getElementById('home');
        if (heroSection) {
            heroSection.id = 'main-content';
        }

        // Improve keyboard navigation
        const focusableElements = document.querySelectorAll('a, button, input, textarea, select');
        focusableElements.forEach(element => {
            element.addEventListener('focus', function () {
                this.style.outline = '2px solid var(--primary-color)';
                this.style.outlineOffset = '2px';
            });

            element.addEventListener('blur', function () {
                this.style.outline = '';
                this.style.outlineOffset = '';
            });
        });
    }

    // Initialize accessibility improvements
    improveAccessibility();

});

/* ==========================================================================
   Additional Utility Functions
   ========================================================================== */

// Smooth scroll polyfill for older browsers
(function () {
    'use strict';

    if (!Element.prototype.scrollIntoView) return;

    const originalScrollIntoView = Element.prototype.scrollIntoView;

    Element.prototype.scrollIntoView = function (options) {
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
(function () {
    'use strict';

    if (!window.performance) return;

    window.addEventListener('load', () => {
        setTimeout(() => {
            const perfData = performance.timing;
            const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;

            if (pageLoadTime > 0) {
                console.log(`⚡ Página carregada em: ${pageLoadTime}ms`);

                // Log image load performance
                const images = document.querySelectorAll('img');
                const loadedImages = Array.from(images).filter(img => img.complete);
                console.log(`🖼️ Imagens carregadas: ${loadedImages.length}/${images.length}`);
            }
        }, 0);
    });
})();

// Image intersection observer for analytics
(function () {
    'use strict';

    if (!window.IntersectionObserver) return;

    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                console.log(`📸 Imagem visualizada: ${img.alt || img.src.split('/').pop()}`);
            }
        });
    }, { threshold: 0.5 });

    window.addEventListener('load', () => {
        const images = document.querySelectorAll('img');
        images.forEach(img => imageObserver.observe(img));
    });
})();

function fixProjectImagesOnMobile() {
    if (window.innerWidth <= 768) {
        const projectImages = document.querySelectorAll('.project-image img');

        projectImages.forEach((img, index) => {
            // Força o carregamento da imagem
            const originalSrc = img.src;

            // Remove e re-adiciona a imagem
            setTimeout(() => {
                img.style.display = 'none';
                img.src = '';

                setTimeout(() => {
                    img.src = originalSrc;
                    img.style.display = 'block';

                    // Se ainda não carregar, mostra o fallback
                    setTimeout(() => {
                        if (img.naturalWidth === 0) {
                            handleImageError(img);
                        }
                    }, 2000);
                }, 100);
            }, index * 200);
        });
    }
}

function checkMobileImageSupport() {
    if (window.innerWidth <= 768) {
        // Verifica se as imagens dos projetos existem
        const projectImages = [
            './src/imagens/homem-aranha1.png',
            './src/imagens/mundo-invertido1.png', 
            './src/imagens/barbearia1.png'
        ];
        
        projectImages.forEach((src, index) => {
            const testImg = new Image();
            testImg.onload = () => {
                console.log(`Projeto ${index + 1} OK: ${src}`);
            };
            testImg.onerror = () => {
                console.error(`Projeto ${index + 1} ERRO: ${src}`);
                // Força fallback para esta imagem específica
                const projectImgs = document.querySelectorAll('.project-image img');
                if (projectImgs[index]) {
                    handleImageError(projectImgs[index]);
                }
            };
            testImg.src = src;
        });
    }
}