document.addEventListener('DOMContentLoaded', function () {
    'use strict';

    // DOM Elements
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);
    
    const hamburger = $('.hamburger');
    const navMenu = $('.nav-menu');
    const navLinks = $$('.nav-link');
    const backToTopBtn = $('#backToTop');
    const header = $('.header');
    const sections = $$('section[id]');
    const contactForm = $('.contact-form');
    const themeToggle = $('#themeToggle');

    let isScrolling = false;
    let currentSection = 'home';

    // Theme Management
    const themeManager = {
        DARK: 'dark',
        LIGHT: 'light',

        init() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? this.DARK : this.LIGHT;
            this.setTheme(theme);
            this.bindEvents();
        },

        setTheme(theme) {
            document.documentElement.setAttribute('data-theme', theme);
            this.updateThemeIcon(theme);
            this.updateMetaThemeColor(theme);
        },

        toggleTheme() {
            const current = document.documentElement.getAttribute('data-theme') || this.DARK;
            const newTheme = current === this.DARK ? this.LIGHT : this.DARK;
            this.setTheme(newTheme);
            this.animateToggle();
        },

        updateThemeIcon(theme) {
            const lightIcon = $('.theme-icon-light');
            const darkIcon = $('.theme-icon-dark');
            
            if (lightIcon && darkIcon) {
                if (theme === this.DARK) {
                    lightIcon.style.cssText = 'opacity: 1; transform: rotate(0deg) scale(1)';
                    darkIcon.style.cssText = 'opacity: 0; transform: rotate(-90deg) scale(0.5)';
                } else {
                    lightIcon.style.cssText = 'opacity: 0; transform: rotate(90deg) scale(0.5)';
                    darkIcon.style.cssText = 'opacity: 1; transform: rotate(0deg) scale(1)';
                }
            }
        },

        updateMetaThemeColor(theme) {
            const meta = $('meta[name="theme-color"]');
            if (meta) meta.setAttribute('content', theme === this.DARK ? '#8b5cf6' : '#7c3aed');
        },

        animateToggle() {
            if (themeToggle) {
                themeToggle.style.transform = 'scale(0.9) rotate(180deg)';
                setTimeout(() => themeToggle.style.transform = 'scale(1) rotate(0deg)', 150);
            }
        },

        bindEvents() {
            themeToggle?.addEventListener('click', () => this.toggleTheme());
            
            window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
                if (!this.currentTheme) this.setTheme(e.matches ? this.DARK : this.LIGHT);
            });

            document.addEventListener('keydown', (e) => {
                if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'T') {
                    e.preventDefault();
                    this.toggleTheme();
                }
            });
        }
    };

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

    // Image Handling
    function handleImageError(img) {
        const fileName = img.src.split('/').pop();
        const paths = [`./imagens/${fileName}`, `./${fileName}`, `src/imagens/${fileName}`, `imagens/${fileName}`];
        let i = 0;
        
        const tryNext = () => {
            if (i < paths.length) {
                img.src = paths[i++];
            } else {
                img.style.display = 'none';
                const fallback = img.nextElementSibling;
                if (fallback?.classList.contains('profile-fallback') || fallback?.classList.contains('project-fallback')) {
                    fallback.style.display = 'flex';
                }
            }
        };

        img.addEventListener('error', tryNext, { once: true });
        tryNext();
    }

    // Navigation
    const toggleMobileMenu = () => {
        hamburger.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.classList.toggle('menu-open');
    };

    const closeMobileMenu = () => {
        hamburger.classList.remove('active');
        navMenu.classList.remove('active');
        document.body.classList.remove('menu-open');
    };

    const updateActiveNavLink = () => {
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
    };

    // Scroll Functions
    const handleScroll = () => {
        if (isScrolling) return;
        
        isScrolling = true;
        requestAnimationFrame(() => {
            const scrollTop = window.pageYOffset;
            header.classList.toggle('scrolled', scrollTop > 50);
            backToTopBtn.classList.toggle('show', scrollTop > 300);
            updateActiveNavLink();
            animateOnScroll();
            animateStatsOnScroll();
            isScrolling = false;
        });
    };

    const smoothScrollTo = (target) => {
        const element = $(target);
        if (element) {
            window.scrollTo({ 
                top: element.offsetTop - 70, 
                behavior: 'smooth' 
            });
        }
    };

    const animateOnScroll = () => {
        const elements = $$('.project-card, .skill-item, .contact-item, .certification-card');
        const threshold = window.innerHeight + window.pageYOffset - 100;

        elements.forEach(el => {
            if (threshold >= el.offsetTop) el.classList.add('animate-in');
        });
    };

    // Stats Animation
    const animateStatsOnScroll = () => {
        const statCards = $$('.stat-card');
        const certificationsSection = $('#certifications');
        
        if (certificationsSection) {
            const sectionTop = certificationsSection.offsetTop;
            const sectionBottom = sectionTop + certificationsSection.offsetHeight;
            const scrollPos = window.scrollY + window.innerHeight / 2;
            
            if (scrollPos >= sectionTop && scrollPos <= sectionBottom) {
                statCards.forEach((card, index) => {
                    setTimeout(() => {
                        if (!card.classList.contains('animated')) {
                            card.classList.add('animated');
                            animateNumber(card.querySelector('.stat-number'));
                        }
                    }, index * 200);
                });
            }
        }
    };

    const animateNumber = (element) => {
        if (!element || element.hasAttribute('data-animated')) return;
        
        const text = element.textContent;
        const number = parseInt(text.replace(/\D/g, ''));
        const suffix = text.replace(/[\d]/g, '');
        
        if (isNaN(number)) return;
        
        element.setAttribute('data-animated', 'true');
        let current = 0;
        const increment = number / 30;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= number) {
                current = number;
                clearInterval(timer);
            }
            element.textContent = Math.floor(current) + suffix;
        }, 50);
    };

    // Form Handling
    const handleFormSubmit = (e) => {
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
    };

    const validateForm = (fields) => {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return fields.name.trim().length >= 2 &&
               emailRegex.test(fields.email) &&
               fields.subject.trim().length >= 3 &&
               fields.message.trim().length >= 10;
    };

    const showNotification = (message, type = 'info') => {
        $$('.notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        const icons = { success: 'check-circle', error: 'exclamation-circle', info: 'info-circle' };
        const colors = { success: '#10b981', error: '#ef4444', info: '#6366f1' };
        
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-${icons[type]}"></i>
                <span>${message}</span>
                <button class="notification-close"><i class="fas fa-times"></i></button>
            </div>
        `;

        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: colors[type],
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

        const close = () => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        };

        notification.querySelector('.notification-close').onclick = close;
        setTimeout(() => document.contains(notification) && close(), 5000);
    };

    // Interactive Effects
    const addInteractiveEffects = () => {
        $$('.project-card').forEach(card => {
            card.onmouseenter = () => card.style.transform = 'translateY(-10px) scale(1.02)';
            card.onmouseleave = () => card.style.transform = 'translateY(0) scale(1)';
        });

        $$('.skill-item').forEach(item => {
            const icon = item.querySelector('i');
            if (icon) {
                item.onmouseenter = () => icon.style.transform = 'scale(1.2) rotate(10deg)';
                item.onmouseleave = () => icon.style.transform = 'scale(1) rotate(0deg)';
            }
        });

        if (themeToggle) {
            themeToggle.onmouseenter = () => themeToggle.style.transform = 'scale(1.1)';
            themeToggle.onmouseleave = () => themeToggle.style.transform = 'scale(1)';
        }

        $$('.stat-card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                const icon = card.querySelector('.stat-icon');
                if (icon) icon.style.transform = 'scale(1.1) rotate(5deg)';
            });
            
            card.addEventListener('mouseleave', () => {
                const icon = card.querySelector('.stat-icon');
                if (icon) icon.style.transform = 'scale(1) rotate(0deg)';
            });
        });
    };

    // Certification Effects
    const addCertificationEffects = () => {
        $$('.certification-card').forEach(card => {
            const certIcon = card.querySelector('.cert-icon');
            const certStatus = card.querySelector('.cert-status');
            
            card.addEventListener('mouseenter', () => {
                if (certIcon) certIcon.style.transform = 'scale(1.1) rotate(5deg)';
                if (certStatus?.classList.contains('verified')) {
                    certStatus.style.transform = 'scale(1.2)';
                    certStatus.style.animation = 'pulse 1s ease-in-out';
                }
            });
            
            card.addEventListener('mouseleave', () => {
                if (certIcon) certIcon.style.transform = 'scale(1) rotate(0deg)';
                if (certStatus) {
                    certStatus.style.transform = 'scale(1)';
                    certStatus.style.animation = 'none';
                }
            });

            if (certStatus?.classList.contains('verified')) {
                card.addEventListener('click', () => showCertificationDetails(card));
                card.style.cursor = 'pointer';
            }
        });
    };

    const showCertificationDetails = (card) => {
        const title = card.querySelector('.cert-title').textContent;
        const institution = card.querySelector('.cert-institution').textContent;
        const skills = Array.from(card.querySelectorAll('.cert-skill')).map(skill => skill.textContent);
        
        showNotification(
            `Certificação: ${title} | Instituição: ${institution} | Habilidades: ${skills.join(', ')}`,
            'info'
        );
    };

    // Mobile Optimizations
    const optimizeMobile = () => {
        if (window.innerWidth <= 768) {
            window.addEventListener('scroll', throttle(handleScroll, 16), { passive: true });
            
            $$('input, textarea').forEach(input => {
                input.onfocus = () => input.style.fontSize = '16px';
            });
            
            setTimeout(() => {
                $$('img').forEach((img, i) => {
                    setTimeout(() => {
                        if (img.naturalWidth === 0 || !img.complete) handleImageError(img);
                    }, i * 200);
                });
            }, 1000);
        }
    };

    // Certification Filters
    const initCertificationFilters = () => {
        const certCards = $$('.certification-card');
        
        const filterByStatus = (status) => {
            certCards.forEach(card => {
                const cardStatus = card.querySelector('.cert-status');
                const shouldShow = !status || cardStatus.classList.contains(status);
                
                card.style.display = shouldShow ? 'block' : 'none';
                
                if (shouldShow) {
                    setTimeout(() => {
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 100);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                }
            });
        };

        const updateCertificationCount = () => {
            const verified = $$('.cert-status.verified').length;
            const inProgress = $$('.cert-status.in-progress').length;
            const statNumbers = $$('.stat-number');
            if (statNumbers[0]) statNumbers[0].textContent = (verified + inProgress) + '+';
        };

        updateCertificationCount();
    };

    // Entrance Animations
    const animateCertificationsEntrance = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    setTimeout(() => {
                        entry.target.style.opacity = '1';
                        entry.target.style.transform = 'translateY(0)';
                    }, index * 150);
                    observer.unobserve(entry.target);
                }
            });
        }, { threshold: 0.1 });

        $$('.certification-card, .stat-card').forEach(card => {
            card.style.cssText = 'opacity: 0; transform: translateY(30px); transition: all 0.6s ease';
            observer.observe(card);
        });
    };

    // Event Listeners
    hamburger?.addEventListener('click', toggleMobileMenu);
    backToTopBtn?.addEventListener('click', e => { e.preventDefault(); smoothScrollTo('#home'); });
    contactForm?.addEventListener('submit', handleFormSubmit);

    navLinks.forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            smoothScrollTo(link.getAttribute('href'));
            closeMobileMenu();
        });
    });

    window.addEventListener('scroll', throttle(handleScroll, 16));
    window.addEventListener('resize', debounce(() => {
        closeMobileMenu();
        updateActiveNavLink();
    }, 250));

    document.addEventListener('keydown', e => { 
        if (e.key === 'Escape') closeMobileMenu(); 
    });
    
    document.addEventListener('click', e => {
        if (hamburger && navMenu && !hamburger.contains(e.target) && !navMenu.contains(e.target)) {
            closeMobileMenu();
        }
    });

    // Initialize
    const init = () => {
        themeManager.init();
        
        $$('img').forEach(img => {
            img.onload = () => img.style.opacity = '1';
            img.onerror = () => handleImageError(img);
        });
        
        updateActiveNavLink();
        addInteractiveEffects();
        addCertificationEffects();
        initCertificationFilters();
        optimizeMobile();
        animateCertificationsEntrance();

        $$('.hero-content, .section-header').forEach((el, i) => {
            el.style.cssText = 'opacity: 0; transform: translateY(30px)';
            setTimeout(() => {
                el.style.cssText += '; transition: all 0.6s ease; opacity: 1; transform: translateY(0)';
            }, i * 200);
        });

        animateOnScroll();
        console.log('🚀 Portfólio inicializado!');
    };

    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
        
        .animate-in {
            opacity: 1 !important;
            transform: translateY(0) !important;
        }
        
        .hamburger.active .bar:nth-child(1) {
            transform: rotate(45deg) translate(5px, 5px);
        }
        
        .hamburger.active .bar:nth-child(2) {
            opacity: 0;
        }
        
        .hamburger.active .bar:nth-child(3) {
            transform: rotate(-45deg) translate(7px, -6px);
        }
    `;
    document.head.appendChild(style);

    init();
});

// Integração CMS - adicione no final do arquivo
document.addEventListener('cms:contentLoaded', (e) => {
    console.log('🎯 Conteúdo CMS carregado, re-inicializando componentes');
    
    // Re-executar funções que dependem do conteúdo
    updateActiveNavLink();
    addInteractiveEffects();
    addCertificationEffects();
    optimizeMobile();
    
    // Re-bind eventos de navegação
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            smoothScrollTo(link.getAttribute('href'));
            closeMobileMenu();
        });
    });
});