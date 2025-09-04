// Projects Page Enhanced JavaScript - VERSÃO ATUALIZADA
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM Elements
    const $ = (selector) => document.querySelector(selector);
    const $$ = (selector) => document.querySelectorAll(selector);
    
    const filterBtns = $$('.filter-btn');
    const projectCards = $$('.project-card');
    const projectsGrid = $('#projectsGrid');
    const statNumbers = $$('.stat-number-mini');
    const hamburger = $('.hamburger');
    const navMenu = $('.nav-menu');
    const navLinks = $$('.nav-link');
    const backToTopBtn = $('#backToTop');
    const header = $('.header');
    const themeToggle = $('#themeToggle');

    // Theme Management (synchronized with main site)
    const themeManager = {
        DARK: 'dark',
        LIGHT: 'light',

        init() {
            const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            const theme = prefersDark ? this.DARK : this.DARK;
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
        }
    };

    // Navigation Management
    const navigationManager = {
        init() {
            this.bindMobileMenu();
            this.bindNavigationLinks();
            this.bindBackToTop();
            this.handleScroll();
        },

        bindMobileMenu() {
            hamburger?.addEventListener('click', this.toggleMobileMenu.bind(this));
            
            document.addEventListener('click', (e) => {
                if (hamburger && navMenu && 
                    !hamburger.contains(e.target) && 
                    !navMenu.contains(e.target)) {
                    this.closeMobileMenu();
                }
            });

            document.addEventListener('keydown', (e) => {
                if (e.key === 'Escape') this.closeMobileMenu();
            });
        },

        toggleMobileMenu() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            document.body.classList.toggle('menu-open');
        },

        closeMobileMenu() {
            hamburger?.classList.remove('active');
            navMenu?.classList.remove('active');
            document.body.classList.remove('menu-open');
        },

        bindNavigationLinks() {
            navLinks.forEach(link => {
                link.addEventListener('click', (e) => {
                    const href = link.getAttribute('href');
                    
                    if (link.classList.contains('nav-external')) {
                        this.closeMobileMenu();
                        return;
                    }
                    
                    if (href.startsWith('#')) {
                        e.preventDefault();
                        this.smoothScrollTo(href);
                        this.closeMobileMenu();
                    }
                });
            });
        },

        bindBackToTop() {
            backToTopBtn?.addEventListener('click', (e) => {
                e.preventDefault();
                this.smoothScrollTo('#all-projects');
            });
        },

        bindBackLink() {
            // Funcionalidade para o botão "Voltar ao Portfólio"
            const backLink = $('.back-link');
            if (backLink) {
                backLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Voltando ao portfólio principal');
                    window.location.href = '../index.html#projects';
                });
            }
        },

        smoothScrollTo(target) {
            const element = $(target);
            if (element) {
                const offset = target === '#all-projects' ? 0 : 70;
                window.scrollTo({ 
                    top: element.offsetTop - offset, 
                    behavior: 'smooth' 
                });
            }
        },

        handleScroll() {
            const throttledScroll = this.throttle(() => {
                const scrollTop = window.pageYOffset;
                header?.classList.toggle('scrolled', scrollTop > 50);
                backToTopBtn?.classList.toggle('show', scrollTop > 300);
            }, 16);

            window.addEventListener('scroll', throttledScroll, { passive: true });
        },

        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        }
    };

    // ===== FUNCIONALIDADES DE FILTRO - IMPLEMENTAÇÃO COMPLETA =====
    
    // Estado do filtro
    let currentFilter = 'all';
    let isAnimating = false;

    // Configuração dos filtros
    const FILTER_CONFIG = {
        all: {
            name: 'Todos',
            selector: () => true
        },
        web: {
            name: 'Web Apps',
            selector: (categories) => categories.includes('web')
        },
        landing: {
            name: 'Landing Pages',
            selector: (categories) => categories.includes('landing')
        },
        interactive: {
            name: 'Interativos',
            selector: (categories) => categories.includes('interactive')
        },
        commercial: {
            name: 'Comerciais',
            selector: (categories) => categories.includes('commercial')
        }
    };

    // Função principal de filtro
    const filterProjects = function(filter) {
        if (isAnimating || filter === currentFilter) return;
        
        console.log(`🔍 Filtrando projetos: ${filter}`);
        
        isAnimating = true;
        currentFilter = filter;
        
        // Atualizar botão ativo
        updateActiveFilterButton(filter);
        
        // Adicionar estado de loading
        projectsGrid?.classList.add('loading');
        
        // Animar saída dos cards visíveis
        animateCardsOut(() => {
            // Aplicar filtro
            const visibleCount = applyFilter(filter);
            
            // Mostrar estado vazio se necessário
            handleEmptyState(visibleCount === 0, filter);
            
            // Animar entrada dos cards filtrados
            animateCardsIn(() => {
                projectsGrid?.classList.remove('loading');
                isAnimating = false;
                console.log(`✅ Filtro aplicado: ${visibleCount} projetos visíveis`);
            });
        });
    };

    // Atualizar botão de filtro ativo
    const updateActiveFilterButton = function(filter) {
        filterBtns.forEach(btn => {
            const btnFilter = btn.getAttribute('data-filter');
            btn.classList.toggle('active', btnFilter === filter);
            
            // Adicionar animação ao botão ativo
            if (btnFilter === filter) {
                btn.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    btn.style.transform = 'scale(1)';
                }, 150);
            }
        });
    };

    // Aplicar filtro aos cards
    const applyFilter = function(filter) {
        let visibleCount = 0;
        const filterConfig = FILTER_CONFIG[filter];
        
        if (!filterConfig) {
            console.error(`❌ Filtro não encontrado: ${filter}`);
            return 0;
        }

        projectCards.forEach(card => {
            const categories = (card.getAttribute('data-category') || '').split(' ');
            const shouldShow = filterConfig.selector(categories);
            
            // Reset classes de animação
            card.classList.remove('filter-out', 'filter-in');
            
            if (shouldShow) {
                card.style.display = 'block';
                card.setAttribute('data-visible', 'true');
                visibleCount++;
            } else {
                card.style.display = 'none';
                card.setAttribute('data-visible', 'false');
            }
        });

        // Atualizar estatísticas
        updateProjectStats(visibleCount, filter);
        
        return visibleCount;
    };

    // Animar saída dos cards
    const animateCardsOut = function(callback) {
        const visibleCards = Array.from(projectCards).filter(card => 
            card.style.display !== 'none'
        );
        
        if (visibleCards.length === 0) {
            callback();
            return;
        }

        visibleCards.forEach((card, index) => {
            setTimeout(() => {
                card.classList.add('filter-out');
                card.style.transform = 'translateY(20px)';
                card.style.opacity = '0';
            }, index * 50);
        });

        setTimeout(callback, visibleCards.length * 50 + 200);
    };

    // Animar entrada dos cards
    const animateCardsIn = function(callback) {
        const newVisibleCards = Array.from(projectCards).filter(card => 
            card.getAttribute('data-visible') === 'true'
        );
        
        if (newVisibleCards.length === 0) {
            callback();
            return;
        }

        newVisibleCards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                card.classList.add('filter-in');
                card.style.transition = 'all 0.6s ease';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });

        setTimeout(callback, newVisibleCards.length * 100 + 200);
    };

    // Atualizar estatísticas dos projetos
    const updateProjectStats = function(visibleCount, filter) {
        const statElement = $('.stat-number-mini');
        if (statElement && filter !== 'all') {
            const originalValue = statElement.getAttribute('data-original') || statElement.textContent;
            if (!statElement.getAttribute('data-original')) {
                statElement.setAttribute('data-original', originalValue);
            }
            
            // Animar mudança do número
            animateStatChange(statElement, visibleCount + '+');
        } else if (statElement && filter === 'all') {
            const originalValue = statElement.getAttribute('data-original');
            if (originalValue) {
                animateStatChange(statElement, originalValue);
            }
        }
    };

    // Animar mudança na estatística
    const animateStatChange = function(element, newValue) {
        element.style.transform = 'scale(1.2)';
        element.style.color = 'var(--primary)';
        
        setTimeout(() => {
            element.textContent = newValue;
            element.style.transform = 'scale(1)';
            element.style.color = '';
        }, 150);
    };

    // Lidar com estado vazio
    const handleEmptyState = function(isEmpty, filter) {
        const existingEmptyState = $('.empty-state');
        
        if (existingEmptyState) {
            existingEmptyState.remove();
        }

        if (isEmpty) {
            const filterConfig = FILTER_CONFIG[filter];
            const filterName = filterConfig ? filterConfig.name : filter;
            
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Nenhum projeto encontrado</h3>
                <p>Não encontramos projetos na categoria "${filterName}".<br>
                Tente outro filtro ou volte para "Todos".</p>
            `;
            
            projectsGrid?.appendChild(emptyState);
            
            // Animar entrada do estado vazio
            setTimeout(() => {
                emptyState.style.opacity = '1';
                emptyState.style.transform = 'translateY(0)';
            }, 100);
        }
    };

    // Funcionalidade de busca por texto
    const initializeSearch = function() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.id = 'projectsSearch';
        searchInput.placeholder = 'Buscar projetos por nome, descrição ou tecnologia...';
        searchInput.className = 'projects-search';
        searchInput.style.cssText = `
            width: 100%; 
            max-width: 500px; 
            padding: 1.2rem 2rem; 
            margin: 0 auto 3rem; 
            display: block; 
            border: 2px solid var(--border-color); 
            border-radius: 2rem; 
            background: var(--bg-secondary); 
            color: var(--text-primary); 
            font-size: 1.4rem; 
            font-family: inherit;
            transition: all 0.3s ease;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
        `;

        const filterContainer = $('.projects-filter');
        if (filterContainer) {
            filterContainer.parentNode.insertBefore(searchInput, filterContainer);
        }

        // Eventos de busca
        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                searchProjects(e.target.value.toLowerCase().trim());
            }, 300);
        });

        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--primary)';
            this.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1), 0 4px 6px rgba(0, 0, 0, 0.05)';
        });

        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'var(--border-color)';
            this.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
        });

        // Shortcut para busca (Ctrl/Cmd + K)
        document.addEventListener('keydown', function(e) {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                searchInput.focus();
            }
        });
    };

    // Buscar projetos por texto
    const searchProjects = function(searchTerm) {
        console.log(`🔍 Buscando: "${searchTerm}"`);
        
        if (searchTerm.length === 0) {
            // Restaurar filtro atual quando busca está vazia
            filterProjects(currentFilter);
            return;
        }

        let visibleCount = 0;
        
        projectCards.forEach(card => {
            const title = card.querySelector('.project-title')?.textContent.toLowerCase() || '';
            const description = card.querySelector('.project-description')?.textContent.toLowerCase() || '';
            const tags = Array.from(card.querySelectorAll('.tag')).map(tag => 
                tag.textContent.toLowerCase()
            );
            const categories = card.getAttribute('data-category') || '';
            
            const matchesSearch = 
                title.includes(searchTerm) || 
                description.includes(searchTerm) || 
                categories.toLowerCase().includes(searchTerm) ||
                tags.some(tag => tag.includes(searchTerm));
            
            if (matchesSearch) {
                card.style.display = 'block';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        // Remover estado vazio anterior
        const existingEmptyState = $('.empty-state');
        if (existingEmptyState) {
            existingEmptyState.remove();
        }

        // Mostrar estado vazio se necessário
        if (visibleCount === 0) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = `
                <i class="fas fa-search"></i>
                <h3>Nenhum resultado encontrado</h3>
                <p>Não encontramos projetos que correspondam à sua busca por "<strong>${searchTerm}</strong>".<br>
                Tente outros termos ou limpe o campo de busca.</p>
            `;
            projectsGrid?.appendChild(emptyState);
        }

        console.log(`✅ Busca concluída: ${visibleCount} resultados para "${searchTerm}"`);
    };

    // ===== FIM DAS FUNCIONALIDADES DE FILTRO =====

    // Statistics Animation
    const animateStatNumbers = function() {
        statNumbers.forEach(function(element) {
            if (element.hasAttribute('data-animated')) return;
            
            const text = element.textContent;
            const number = parseInt(text.replace(/\D/g, ''));
            const suffix = text.replace(/[\d]/g, '');
            
            if (isNaN(number)) return;
            
            element.setAttribute('data-animated', 'true');
            let current = 0;
            const increment = number / 50;
            const duration = 2000;
            const stepTime = duration / 50;
            
            const timer = setInterval(function() {
                current += increment;
                if (current >= number) {
                    current = number;
                    clearInterval(timer);
                }
                element.textContent = Math.floor(current) + suffix;
            }, stepTime);
        });
    };

    // Enhanced Project Card Interactions
    const enhanceProjectCards = function() {
        projectCards.forEach(function(card) {
            const projectImage = card.querySelector('.project-image');
            const projectLinks = card.querySelectorAll('.project-link');
            
            card.addEventListener('mouseenter', function() {
                if (!isAnimating) {
                    card.style.transform = 'translateY(-10px) scale(1.02)';
                    
                    if (projectImage) {
                        const img = projectImage.querySelector('img');
                        if (img) img.style.transform = 'scale(1.1)';
                    }
                }
            });

            card.addEventListener('mouseleave', function() {
                if (!isAnimating) {
                    card.style.transform = 'translateY(0) scale(1)';
                    
                    if (projectImage) {
                        const img = projectImage.querySelector('img');
                        if (img) img.style.transform = 'scale(1)';
                    }
                }
            });

            projectLinks.forEach(function(link) {
                link.addEventListener('mouseenter', function() {
                    this.style.transform = 'translateX(5px)';
                });

                link.addEventListener('mouseleave', function() {
                    this.style.transform = 'translateX(0)';
                });
            });
        });
    };

    // Entrance Animations
    const animateEntrance = function() {
        const statCards = $$('.stat-card-mini');
        statCards.forEach(function(card, index) {
            card.style.cssText = 'opacity: 0; transform: translateY(30px); transition: all 0.6s ease';
            setTimeout(function() {
                card.style.cssText += '; opacity: 1; transform: translateY(0)';
            }, index * 150);
        });

        filterBtns.forEach(function(btn, index) {
            btn.style.cssText = 'opacity: 0; transform: translateY(20px); transition: all 0.4s ease';
            setTimeout(function() {
                btn.style.cssText += '; opacity: 1; transform: translateY(0)';
            }, 300 + index * 100);
        });

        projectCards.forEach(function(card, index) {
            card.style.cssText = 'opacity: 0; transform: translateY(30px); transition: all 0.6s ease';
            setTimeout(function() {
                card.style.cssText += '; opacity: 1; transform: translateY(0)';
                card.classList.add('animate-in');
            }, 600 + index * 150);
        });
    };

    // Scroll-based Stats Animation
    const handleStatsAnimation = function() {
        const statsSection = $('.projects-stats');
        if (!statsSection) return;

        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        setTimeout(animateStatNumbers, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            });

            observer.observe(statsSection);
        } else {
            setTimeout(animateStatNumbers, 1000);
        }
    };

    // Event Bindings
    const bindEvents = function() {
        // Filter buttons - FUNCIONALIDADE PRINCIPAL
        filterBtns.forEach(function(btn) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const filter = this.getAttribute('data-filter');
                console.log(`🎯 Clique no filtro: ${filter}`);
                filterProjects(filter);
            });

            btn.addEventListener('keydown', function(e) {
                if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    const filter = this.getAttribute('data-filter');
                    filterProjects(filter);
                }
            });

            // Efeito visual ao clicar
            btn.addEventListener('mousedown', function() {
                this.style.transform = 'scale(0.95)';
            });

            btn.addEventListener('mouseup', function() {
                this.style.transform = 'scale(1)';
            });
        });

        // Window events
        window.addEventListener('resize', function() {
            navigationManager.closeMobileMenu();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', function(e) {
            // Números 1-5 para filtros rápidos
            if (e.ctrlKey || e.metaKey) {
                const filters = ['all', 'web', 'landing', 'interactive', 'commercial'];
                const keyNum = parseInt(e.key);
                if (keyNum >= 1 && keyNum <= 5) {
                    e.preventDefault();
                    filterProjects(filters[keyNum - 1]);
                }
            }
        });
    };

    // Utility Functions
    const debounce = function(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = function() {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    };

    // Image Error Handler
    window.handleImageError = function(img) {
        const fileName = img.src.split('/').pop();
        const possiblePaths = [
            `../src/imagens/${fileName}`,
            `./src/imagens/${fileName}`,
            `src/imagens/${fileName}`,
            `imagens/${fileName}`,
            `../imagens/${fileName}`
        ];
        
        let currentIndex = possiblePaths.findIndex(path => img.src.includes(path.split('/').pop()));
        currentIndex = currentIndex === -1 ? 0 : currentIndex + 1;
        
        if (currentIndex < possiblePaths.length) {
            img.src = possiblePaths[currentIndex];
        } else {
            img.style.display = 'none';
            const fallback = img.nextElementSibling;
            if (fallback?.classList.contains('project-fallback')) {
                fallback.style.display = 'flex';
            }
        }
    };

    // Initialize Everything
    const init = function() {
        console.log('Inicializando página de projetos...');
        
        themeManager.init();
        navigationManager.init();
        enhanceProjectCards();
        handleStatsAnimation();
        initializeSearch();
        bindEvents();
        animateEntrance();

        // IMPLEMENTAÇÃO DEFINITIVA DA NAVEGAÇÃO
        // Remove código temporário e implementa solução final
        setTimeout(() => {
            console.log('Aplicando navegação definitiva...');
            
            // Selecionar todos os links de navegação
            const allNavLinks = document.querySelectorAll('.nav-link');
            
            allNavLinks.forEach((link, index) => {
                const href = link.getAttribute('href');
                const text = link.textContent.trim();
                
                // Remover listeners existentes
                const newLink = link.cloneNode(true);
                link.parentNode.replaceChild(newLink, link);
                
                // Adicionar novo listener
                newLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log(`Navegação: ${text} -> ${href}`);
                    
                    // Fechar menu mobile
                    const hamburger = document.querySelector('.hamburger');
                    const navMenu = document.querySelector('.nav-menu');
                    hamburger?.classList.remove('active');
                    navMenu?.classList.remove('active');
                    document.body.classList.remove('menu-open');
                    
                    // Determinar URL de destino
                    let targetUrl;
                    
                    if (href.includes('index.html')) {
                        targetUrl = href;
                    } else if (href.startsWith('#')) {
                        if (href === '#all-projects') {
                            // Link interno da página atual
                            document.querySelector(href)?.scrollIntoView({ 
                                behavior: 'smooth',
                                block: 'start'
                            });
                            return;
                        } else {
                            // Links para seções do index.html
                            targetUrl = `../index.html${href}`;
                        }
                    }
                    
                    if (targetUrl) {
                        console.log(`Redirecionando para: ${targetUrl}`);
                        window.location.href = targetUrl;
                    }
                });
            });
            
            // Implementar botão "Voltar ao Portfólio"
            const backLink = document.querySelector('.back-link');
            if (backLink) {
                backLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    console.log('Voltando ao portfólio');
                    window.location.href = '../index.html#projects';
                });
            }
            
        }, 100);

        // Add custom CSS for filter animations
        const style = document.createElement('style');
        style.textContent = `
            .projects-search:hover { 
                border-color: var(--primary) !important; 
                transform: translateY(-2px); 
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
            .filter-out {
                opacity: 0 !important;
                transform: translateY(20px) !important;
                transition: all 0.3s ease !important;
            }
            .filter-in {
                opacity: 1 !important;
                transform: translateY(0) !important;
                transition: all 0.6s ease !important;
            }
            .projects-grid.loading {
                pointer-events: none;
            }
            .projects-grid.loading .project-card {
                opacity: 0.6;
            }
            .empty-state {
                opacity: 0;
                transform: translateY(20px);
                transition: all 0.5s ease;
            }
        `;
        document.head.appendChild(style);

        console.log('Página de Projetos inicializada com filtros funcionais!');
    };

    // Start initialization
    init();
});