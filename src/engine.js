document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // DOM Elements
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    const backToTopBtn = document.querySelector('#backToTop');
    const header = document.querySelector('.header');
    const sections = document.querySelectorAll('section[id]');
    const contactForm = document.querySelector('.contact-form');
    const themeToggle = document.querySelector('#themeToggle');

    let isScrolling = false;
    let currentSection = 'home';

    // Theme Management
    const themeManager = {
        STORAGE_KEY: 'portfolio-theme',
        DARK: 'dark',
        LIGHT: 'light',

        init() {
            const savedTheme = this.getSavedTheme();
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = savedTheme || (prefersDark ? this.DARK : this.LIGHT);
            
            this.setTheme(theme);
            this.bindEvents();
        },

        getSavedTheme() {
            try {
                return null; // Não usa localStorage conforme instruções
            } catch {
                return null;
            }
        },

        saveTheme(theme) {
            // Mantém em memória apenas durante a sessão
            this.currentTheme = theme;
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.saveTheme(theme);
            this.updateThemeIcon(theme);
            this.updateMetaThemeColor(theme);
        },

        toggleTheme() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || this.DARK;
            const newTheme = currentTheme === this.DARK ? this.LIGHT : this.DARK;
            this.setTheme(newTheme);
            this.animateToggle();
        },

        updateThemeIcon(theme) {
            const lightIcon = document.querySelector('.theme-icon-light');
            const darkIcon = document.querySelector('.theme-icon-dark');
            
            if (lightIcon && darkIcon) {
                if (theme === this.DARK) {
                    lightIcon.style.opacity = '1';
                    lightIcon.style.transform = 'rotate(0deg) scale(1)';
                    darkIcon.style.opacity = '0';
                    darkIcon.style.transform = 'rotate(-90deg) scale(0.5)';
                } else {
                    lightIcon.style.opacity = '0';
                    lightIcon.style.transform = 'rotate(90deg) scale(0.5)';
                    darkIcon.style.opacity = '1';
                    darkIcon.style.transform = 'rotate(0deg) scale(1)';
                }
            }
        },

        updateMetaThemeColor(theme) {
            const metaThemeColor = document.querySelector('meta[name="theme-color"]');
            if (metaThemeColor) {
                metaThemeColor.setAttribute('content', theme === this.DARK ? '#8b5cf6' : '#7c3aed');
            }
        },

        animateToggle() {
            if (themeToggle) {
                themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
                setTimeout(() => {
                    themeToggle.style.transform = 'scale(1) rotate(0deg)';
                }, 150);
            }
        },

        bindEvents() {
            if (themeToggle) {
                themeToggle.addEventListener('click', () => this.toggleTheme());
            }

            // Detecta mudanças na preferência do sistema
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.currentTheme) {
                    this.setTheme(e.matches ? this.DARK : this.LIGHT);
                }
            });

            // Atalho de teclado (Ctrl/Cmd + Shift + T)
            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    };

    // Image Handling
    function handleImageError(img) {
        const fileName = img.src.split('/').pop();
        const altPaths = [`./imagens/${fileName}`, `./${fileName}`, `src/imagens/${fileName}`, `imagens/${fileName}`];
        
        let attemptIndex = 0;
        
        function tryNext() {
            if (attemptIndex < altPaths.length) {
                img.src = altPaths[attemptIndex++];
            } else {
                img.style.display = 'none';
                const fallback = img.nextElementSibling;
                if (fallback && (fallback.classList.contains('profile-fallback') || fallback.classList.contains('project-fallback'))) {
                    fallback.style.display = 'flex';
                }
            }
        }

        img.addEventListener('error', tryNext, { once: true });
        tryNext();
    }

    // Navigation
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
            link.classList.toggle('active', link.getAttribute('href') === `#${currentSection}`);
        });
    }

    // Scroll Functions
    function handleScroll() {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;

            header.classList.toggle('scrolled', scrollTop > 50);
            backToTopBtn.classList.toggle('show', scrollTop > 300);
            
            updateActiveNavLink();
            animateOnScroll();
            isScrolling = false;
        });
    }

    function smoothScrollTo(target) {
        const element = document.querySelector(target);
        if (element) {
            window.scrollTo({ 
                top: element.offsetTop - 70, 
                behavior: 'smooth' 
            });
        }
    }

    function animateOnScroll() {
        const elements = document.querySelectorAll('.project-card, .skill-item, .contact-item');
        const threshold = window.innerHeight + window.pageYOffset - 100;

        elements.forEach(el => {
            if (threshold >= el.offsetTop) {
                el.classList.add('animate-in');
            }
        });
    }

    // Form Handling
    function handleFormSubmit(e) {
        e.preventDefault();
        
        const data = new FormData(contactForm);
        const fields = {
            name: data.get('name'),
            email: data.get('email'),
            subject: data.get('subject'),
            message: data.get('message')
        };

        if (!validateForm(fields)) {
            showNotification('Por favor, preencha todos os campos corretamente.', 'error');
            return;
        }

        const btn = contactForm.querySelector('button[type="submit"]');
        const originalText = btn.textContent;
        btn.textContent = 'Enviando...';
        btn.disabled = true;

        setTimeout(() => {
            showNotification('Mensagem enviada com sucesso! Entrarei em contato em breve.', 'success');
            contactForm.reset();
            btn.textContent = originalText;
            btn.disabled = false;
        }, 2000);
    }

    function validateForm(fields) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return fields.name.trim().length >= 2 &&
               emailRegex.test(fields.email) &&
               fields.subject.trim().length >= 3 &&
               fields.message.trim().length >= 10;
    }

    function showNotification(message, type = 'info') {
        document.querySelectorAll('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        const icon = type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle';
        const color = type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1';
        
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icon}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: color,
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
            zIndex: '9999',
            opacity: '0',
            transform: 'translateX(100%)',
            transition: 'all 0.3s ease',
            maxWidth: '400px'
        });

        document.body.appendChild(notification);

        requestAnimationFrame(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        });

        notification.querySelector('.notification-close').onclick = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        };

        setTimeout(() => {
            if (document.contains(notification)) {
                notification.style.opacity = '0';
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => notification.remove(), 300);
            }
        }, 5000);
    }

    // Interactive Effects
    function addInteractiveEffects() {
        document.querySelectorAll('.project-card').forEach(card => {
            card.onmouseenter = () => card.style.transform = 'translateY(-10px) scale(1.02)';
            card.onmouseleave = () => card.style.transform = 'translateY(0) scale(1)';
        });

        document.querySelectorAll('.skill-item').forEach(item => {
            const icon = item.querySelector('i');
            if (icon) {
                item.onmouseenter = () => icon.style.transform = 'scale(1.2) rotate(10deg)';
                item.onmouseleave = () => icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        // Adiciona efeito hover ao botão de tema
        if (themeToggle) {
            themeToggle.onmouseenter = () => {
                themeToggle.style.transform = 'scale(1.1)';
            };
            themeToggle.onmouseleave = () => {
                themeToggle.style.transform = 'scale(1)';
            };
        }
    }

    // Utility Functions
    const throttle = (func, limit) => {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    };

    const debounce = (func, wait) => {
        let timeout;
        return function(...args) {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    };

    // Mobile Optimizations
    function optimizeMobile() {
        if (window.innerWidth <= 768) {
            // Otimiza scroll para mobile
            window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
            
            // Previne zoom em inputs
            document.querySelectorAll('input, textarea').forEach(input => {
                input.onfocus = () => input.style.fontSize = '16px';
            });
            
            // Verifica imagens após carregamento
            setTimeout(() => {
                document.querySelectorAll('img').forEach((img, i) => {
                    setTimeout(() => {
                        if (img.naturalWidth === 0 || !img.complete) {
                            handleImageError(img);
                        }
                    }, i * 200);
                });
            }, 1000);
        }
    }

    // Theme Accessibility
    function announceThemeChange(theme) {
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.style.cssText = 'position: absolute; left: -10000px; width: 1px; height: 1px; overflow: hidden;';
        announcement.textContent = `Tema alterado para ${theme === 'dark' ? 'escuro' : 'claro'}`;
        
        document.body.appendChild(announcement);
        setTimeout(() => document.body.removeChild(announcement), 1000);
    }

    // Enhanced Theme Manager
    themeManager.setTheme = function(theme) {
        const oldTheme = document.documentElement.getAttribute('data-theme');
        document.documentElement.setAttribute('data-theme', theme);
        this.saveTheme(theme);
        this.updateThemeIcon(theme);
        this.updateMetaThemeColor(theme);
        
        if (oldTheme && oldTheme !== theme) {
            announceThemeChange(theme);
        }
    };

    // Event Listeners
    if (hamburger) hamburger.onclick = toggleMobileMenu;
    if (backToTopBtn) backToTopBtn.onclick = e => { e.preventDefault(); smoothScrollTo('#home'); };
    if (contactForm) contactForm.onsubmit = handleFormSubmit;

    navLinks.forEach(link => {
        link.onclick = e => {
            e.preventDefault();
            smoothScrollTo(link.getAttribute('href'));
            closeMobileMenu();
        };
    });

    window.addEventListener('scroll', throttle(handleScroll, 16));
    window.addEventListener('resize', debounce(() => {
        closeMobileMenu();
        updateActiveNavLink();
    }, 250));

    document.onkeydown = e => { 
        if (e.key === 'Escape') closeMobileMenu(); 
    };
    
    document.onclick = e => {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    };

    // Initialize
    function init() {
        // Inicializa o sistema de temas
        themeManager.init();
        
        // Setup image error handling
        document.querySelectorAll('img').forEach(img => {
            img.onload = () => img.style.opacity = '1';
            img.onerror = () => handleImageError(img);
        });
        
        updateActiveNavLink();
        addInteractiveEffects();
        optimizeMobile();

        // Initial animations
        document.querySelectorAll('.hero-content, .section-header').forEach((el, i) => {
            el.style.cssText = 'opacity: 0; transform: translateY(30px)';
            setTimeout(() => {
                el.style.cssText += '; transition: all 0.6s ease; opacity: 1; transform: translateY(0)';
            }, i * 200);
        });

        animateOnScroll();
        console.log('🚀 Portfólio inicializado com sistema de temas!');
    }

    init();
});