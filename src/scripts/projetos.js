// Projects Page Specific JavaScript
document.addEventListener('DOMContentLoaded', function() {
    'use strict';

    // DOM Elements
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');
    const projectsGrid = document.getElementById('projectsGrid');
    const statNumbers = document.querySelectorAll('.stat-number-mini');

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
            if (fallback && fallback.classList.contains('project-fallback')) {
                fallback.style.display = 'flex';
            }
        }
    };

    // Filter State
    let currentFilter = 'all';
    let isAnimating = false;

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

    // Filter Projects Function
    const filterProjects = function(filter) {
        if (isAnimating || filter === currentFilter) return;
        
        isAnimating = true;
        currentFilter = filter;
        
        // Add loading state
        projectsGrid.classList.add('loading');
        
        // Update active filter button
        filterBtns.forEach(function(btn) {
            btn.classList.toggle('active', btn.getAttribute('data-filter') === filter);
        });

        // Animate out visible cards
        const visibleCards = Array.from(projectCards).filter(function(card) {
            return card.style.display !== 'none';
        });
        
        visibleCards.forEach(function(card, index) {
            setTimeout(function() {
                card.classList.add('filter-out');
            }, index * 50);
        });

        // Wait for exit animation then filter
        setTimeout(function() {
            let visibleCount = 0;
            
            projectCards.forEach(function(card) {
                const categories = card.getAttribute('data-category') || '';
                const shouldShow = filter === 'all' || categories.includes(filter);
                
                card.classList.remove('filter-out', 'filter-in');
                
                if (shouldShow) {
                    card.style.display = 'block';
                    visibleCount++;
                } else {
                    card.style.display = 'none';
                }
            });

            // Show empty state if no cards match filter
            handleEmptyState(visibleCount === 0, filter);

            // Animate in filtered cards
            const newVisibleCards = Array.from(projectCards).filter(function(card) {
                return card.style.display === 'block';
            });
            
            newVisibleCards.forEach(function(card, index) {
                setTimeout(function() {
                    card.classList.add('filter-in');
                }, index * 100);
            });

            // Remove loading state
            setTimeout(function() {
                projectsGrid.classList.remove('loading');
                isAnimating = false;
            }, newVisibleCards.length * 100 + 200);
            
        }, visibleCards.length * 50 + 200);
    };

    // Handle Empty State
    const handleEmptyState = function(isEmpty, filter) {
        const existingEmptyState = document.querySelector('.empty-state');
        
        if (existingEmptyState) {
            existingEmptyState.remove();
        }

        if (isEmpty) {
            const emptyState = document.createElement('div');
            emptyState.className = 'empty-state';
            emptyState.innerHTML = '<i class="fas fa-search"></i>' +
                '<h3>Nenhum projeto encontrado</h3>' +
                '<p>Não encontramos projetos na categoria "' + getFilterDisplayName(filter) + '".<br>' +
                'Tente outro filtro ou volte para "Todos".</p>';
            projectsGrid.appendChild(emptyState);
        }
    };

    // Get Filter Display Name
    const getFilterDisplayName = function(filter) {
        const filterNames = {
            web: 'Web Apps',
            landing: 'Landing Pages',
            interactive: 'Interativos',
            commercial: 'Comerciais'
        };
        return filterNames[filter] || filter;
    };

    // Add Filter Event Listeners
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            const filter = btn.getAttribute('data-filter');
            filterProjects(filter);
        });

        // Add keyboard support
        btn.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                const filter = btn.getAttribute('data-filter');
                filterProjects(filter);
            }
        });
    });

    // Enhanced Project Card Interactions
    const enhanceProjectCards = function() {
        projectCards.forEach(function(card) {
            const projectImage = card.querySelector('.project-image');
            const projectLinks = card.querySelectorAll('.project-link');
            
            // Add hover effects
            card.addEventListener('mouseenter', function() {
                card.style.transform = 'translateY(-10px) scale(1.02)';
                
                if (projectImage) {
                    const img = projectImage.querySelector('img');
                    if (img) {
                        img.style.transform = 'scale(1.1)';
                    }
                }
            });

            card.addEventListener('mouseleave', function() {
                card.style.transform = 'translateY(0) scale(1)';
                
                if (projectImage) {
                    const img = projectImage.querySelector('img');
                    if (img) {
                        img.style.transform = 'scale(1)';
                    }
                }
            });

            // Enhanced link interactions
            projectLinks.forEach(function(link) {
                link.addEventListener('mouseenter', function() {
                    link.style.transform = 'translateX(5px)';
                });

                link.addEventListener('mouseleave', function() {
                    link.style.transform = 'translateX(0)';
                });
            });

            // Add focus support for accessibility
            card.addEventListener('focus', function() {
                card.style.outline = '2px solid var(--primary)';
                card.style.outlineOffset = '2px';
            });

            card.addEventListener('blur', function() {
                card.style.outline = 'none';
            });
        });
    };

    // Entrance Animations
    const animateEntrance = function() {
        // Animate stats cards
        const statCards = document.querySelectorAll('.stat-card-mini');
        statCards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 150);
        });

        // Animate filter buttons
        filterBtns.forEach(function(btn, index) {
            btn.style.opacity = '0';
            btn.style.transform = 'translateY(20px)';
            btn.style.transition = 'all 0.4s ease';
            
            setTimeout(function() {
                btn.style.opacity = '1';
                btn.style.transform = 'translateY(0)';
            }, 300 + index * 100);
        });

        // Animate project cards
        projectCards.forEach(function(card, index) {
            card.style.opacity = '0';
            card.style.transform = 'translateY(30px)';
            card.style.transition = 'all 0.6s ease';
            
            setTimeout(function() {
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
                card.classList.add('animate-in');
            }, 600 + index * 150);
        });
    };

    // Scroll-based Stat Animation
    const handleStatsAnimation = function() {
        const statsSection = document.querySelector('.projects-stats');
        if (!statsSection) return;

        if (window.IntersectionObserver) {
            const observer = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        setTimeout(function() {
                            animateStatNumbers();
                        }, 500);
                        observer.unobserve(entry.target);
                    }
                });
            }, {
                threshold: 0.5,
                rootMargin: '0px 0px -100px 0px'
            });

            observer.observe(statsSection);
        } else {
            // Fallback for browsers without IntersectionObserver
            setTimeout(animateStatNumbers, 1000);
        }
    };

    // Search Functionality
    const initializeSearch = function() {
        const searchInput = document.createElement('input');
        searchInput.type = 'text';
        searchInput.placeholder = 'Buscar projetos...';
        searchInput.className = 'projects-search';
        searchInput.style.cssText = 
            'width: 100%; max-width: 400px; padding: 1rem 1.5rem; margin: 0 auto 2rem; ' +
            'display: block; border: 2px solid var(--border-color); border-radius: 2rem; ' +
            'background: var(--bg-secondary); color: var(--text-primary); font-size: 1.4rem; ' +
            'transition: var(--transition);';

        const filterContainer = document.querySelector('.projects-filter');
        filterContainer.parentNode.insertBefore(searchInput, filterContainer);

        let searchTimeout;
        searchInput.addEventListener('input', function(e) {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(function() {
                searchProjects(e.target.value.toLowerCase());
            }, 300);
        });

        searchInput.addEventListener('focus', function() {
            searchInput.style.borderColor = 'var(--primary)';
            searchInput.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
        });

        searchInput.addEventListener('blur', function() {
            searchInput.style.borderColor = 'var(--border-color)';
            searchInput.style.boxShadow = 'none';
        });
    };

    // Search Projects Function
    const searchProjects = function(searchTerm) {
        if (searchTerm.length === 0) {
            projectCards.forEach(function(card) {
                card.style.display = 'block';
            });
            return;
        }

        let visibleCount = 0;
        
        projectCards.forEach(function(card) {
            const title = card.querySelector('.project-title').textContent.toLowerCase();
            const description = card.querySelector('.project-description').textContent.toLowerCase();
            const tags = Array.from(card.querySelectorAll('.tag')).map(function(tag) {
                return tag.textContent.toLowerCase();
            });
            
            const matchesSearch = title.includes(searchTerm) || 
                                description.includes(searchTerm) || 
                                tags.some(function(tag) {
                                    return tag.includes(searchTerm);
                                });
            
            if (matchesSearch) {
                card.style.display = 'block';
                visibleCount++;
            } else {
                card.style.display = 'none';
            }
        });

        handleEmptyState(visibleCount === 0, 'busca por "' + searchTerm + '"');
    };

    // Performance Optimization
    const optimizePerformance = function() {
        // Lazy load images
        const images = document.querySelectorAll('.project-image img');
        if (window.IntersectionObserver) {
            const imageObserver = new IntersectionObserver(function(entries) {
                entries.forEach(function(entry) {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.style.opacity = '0';
                        img.style.transition = 'opacity 0.3s ease';
                        
                        img.onload = function() {
                            img.style.opacity = '1';
                        };
                        
                        imageObserver.unobserve(img);
                    }
                });
            });

            images.forEach(function(img) {
                imageObserver.observe(img);
            });
        }

        // Optimize animations for reduced motion
        if (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
            const style = document.createElement('style');
            style.textContent = 
                '* { animation-duration: 0.01ms !important; ' +
                'animation-iteration-count: 1 !important; ' +
                'transition-duration: 0.01ms !important; }';
            document.head.appendChild(style);
        }
    };

    // Initialize Everything
    const init = function() {
        enhanceProjectCards();
        handleStatsAnimation();
        animateEntrance();
        initializeSearch();
        optimizePerformance();

        // Add CSS for search input hover
        const style = document.createElement('style');
        style.textContent = 
            '.projects-search:hover { border-color: var(--primary) !important; ' +
            'transform: translateY(-2px); }';
        document.head.appendChild(style);

        console.log('Página de Projetos inicializada!');
    };

    // Start initialization
    init();
});