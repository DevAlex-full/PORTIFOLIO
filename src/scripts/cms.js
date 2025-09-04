/**
 * CMS (Content Management System) para Portfólio
 * Sistema otimizado para gerenciamento dinâmico de conteúdo
 */

class PortfolioCMS {
    constructor() {
        this.content = null;
        this.cache = new Map();
        this.observers = new Map();
        this.isLoaded = false;
        this.loadingPromise = null;
    }

    /**
     * Inicializa o CMS carregando o conteúdo
     */
    async init() {
        if (this.loadingPromise) return this.loadingPromise;
        
        this.loadingPromise = this.loadContent();
        await this.loadingPromise;
        
        this.bindEvents();
        this.setupImageHandling();
        
        console.log('📄 CMS inicializado com sucesso');
        return this;
    }

    /**
     * Carrega o conteúdo do arquivo JSON
     */
    async loadContent() {
        try {
            const response = await fetch('./src/data/content.json');
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            
            this.content = await response.json();
            this.isLoaded = true;
            this.renderContent();
            this.updateSEO();
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar CMS, usando conteúdo padrão:', error.message);
            this.loadFallbackContent();
        }
    }

    /**
     * Conteúdo de fallback caso o JSON não carregue
     */
    loadFallbackContent() {
        this.content = {
            hero: {
                title: 'Olá, eu sou <span class="highlight">Alexander Bueno Santiago</span>',
                subtitle: 'Desenvolvedor Front-End & Designer',
                description: 'Criando experiências digitais incríveis através de código limpo e design inovador.'
            },
            projects: { items: [] }, // Inicializa com array vazio
            certifications: { items: [] }, // Inicializa com array vazio
            about: { skills: [] },
            contact: { info: [], social: [] },
            site: {},
            settings: {}
        };
        this.isLoaded = true;
        this.renderContent();
    }

    /**
     * Renderiza todo o conteúdo na página
     */
    renderContent() {
        if (!this.content) return;

        this.renderNavigation();
        this.renderHero();
        this.renderAbout();
        this.renderCertifications();
        this.renderProjects();
        this.renderContact();
        this.renderFooter();
        
        // Dispara evento personalizado
        document.dispatchEvent(new CustomEvent('cms:contentLoaded', { 
            detail: { content: this.content } 
        }));
    }

    /**
     * Renderiza a navegação
     */
    renderNavigation() {
        const nav = this.content.navigation;
        if (!nav) return;

        // Logo
        const logoText = document.querySelector('.nav-logo h2');
        if (logoText && nav.logo) logoText.textContent = nav.logo.text;

        // Menu items
        const navMenu = document.querySelector('.nav-menu');
        if (navMenu && nav.menu) {
            const activeItems = nav.menu.filter(item => item.active);
            navMenu.innerHTML = activeItems.map(item => 
                `<li><a href="${item.href}" class="nav-link">${item.label}</a></li>`
            ).join('');
        }
    }

    /**
     * Renderiza a seção hero
     */
    renderHero() {
        const hero = this.content.hero;
        if (!hero) return;

        const elements = {
            title: document.querySelector('.hero-title'),
            subtitle: document.querySelector('.hero-subtitle'),
            description: document.querySelector('.hero-description'),
            image: document.querySelector('.profile-img img'),
            buttons: document.querySelector('.hero-buttons')
        };

        if (elements.title) elements.title.innerHTML = hero.title;
        if (elements.subtitle) elements.subtitle.textContent = hero.subtitle;
        if (elements.description) elements.description.textContent = hero.description;
        if (elements.image && hero.profileImage) elements.image.src = hero.profileImage;

        if (elements.buttons && hero.buttons) {
            elements.buttons.innerHTML = hero.buttons.map(btn => 
                `<a href="${btn.href}" class="btn btn-${btn.type}">${btn.text}</a>`
            ).join('');
        }
    }

    /**
     * Renderiza a seção sobre
     */
    renderAbout() {
        const about = this.content.about;
        if (!about) return;

        // Título e subtítulo
        const title = document.querySelector('#about .section-title');
        const subtitle = document.querySelector('#about .section-subtitle');
        
        if (title) title.textContent = about.title;
        if (subtitle) subtitle.textContent = about.subtitle;

        // Conteúdo
        const aboutText = document.querySelector('.about-text');
        if (aboutText && about.content) {
            const paragraphs = about.content.map(p => `<p>${p}</p>`).join('');
            const skillsHTML = this.generateSkillsHTML(about.skills);
            aboutText.innerHTML = paragraphs + skillsHTML;
        }
    }

    /**
     * Gera HTML para habilidades
     */
    generateSkillsHTML(skills) {
        if (!skills) return '';
        
        return `
            <div class="skills">
                <h3>Principais Habilidades</h3>
                <div class="skills-grid">
                    ${skills.map(skill => 
                        `<div class="skill-item">
                            <i class="${skill.icon}"></i>
                            <span>${skill.name}</span>
                        </div>`
                    ).join('')}
                </div>
            </div>
        `;
    }

    /**
     * Renderiza certificações
     */
    renderCertifications() {
        const certs = this.content.certifications;
        if (!certs) return;

        // Título e subtítulo
        const title = document.querySelector('#certifications .section-title');
        const subtitle = document.querySelector('#certifications .section-subtitle');
        
        if (title) title.textContent = certs.title;
        if (subtitle) subtitle.textContent = certs.subtitle;

        // Stats
        this.renderCertificationStats(certs.stats);
        
        // Cards de certificação
        this.renderCertificationCards(certs.items);
    }

    /**
     * Renderiza estatísticas de certificação
     */
    renderCertificationStats(stats) {
        const statsContainer = document.querySelector('.certifications-stats');
        if (!statsContainer || !stats) return;

        statsContainer.innerHTML = stats.map(stat => 
            `<div class="stat-card">
                <div class="stat-icon"><i class="${stat.icon}"></i></div>
                <div class="stat-info">
                    <span class="stat-number">${stat.number}</span>
                    <span class="stat-label">${stat.label}</span>
                </div>
            </div>`
        ).join('');
    }

    /**
     * Renderiza cards de certificação
     */
    renderCertificationCards(items) {
        const cardsContainer = document.querySelector('.certifications-grid');
        if (!cardsContainer || !items) return;

        const activeItems = items.filter(item => item.isActive);
        
        cardsContainer.innerHTML = activeItems.map(cert => 
            `<div class="certification-card" data-cert-id="${cert.id}">
                <div class="cert-header">
                    <div class="cert-icon"><i class="${cert.icon}"></i></div>
                    <div class="cert-info">
                        <h3 class="cert-title">${cert.title}</h3>
                        <p class="cert-institution">${cert.institution}</p>
                    </div>
                    <div class="cert-status ${cert.status}">
                        <i class="fas fa-${cert.status === 'verified' ? 'check-circle' : 'clock'}"></i>
                    </div>
                </div>
                <div class="cert-details">
                    <p class="cert-description">${cert.description}</p>
                    <div class="cert-skills">
                        ${cert.skills.map(skill => `<span class="cert-skill">${skill}</span>`).join('')}
                    </div>
                    <div class="cert-meta">
                        <span class="cert-date"><i class="fas fa-calendar"></i> ${cert.date}</span>
                        <span class="cert-duration"><i class="fas fa-clock"></i> ${cert.duration}</span>
                    </div>
                </div>
            </div>`
        ).join('');
    }

    /**
     * Renderiza projetos
     */
    renderProjects() {
        const projects = this.content.projects;
        if (!projects) return;

        // Título e subtítulo
        const title = document.querySelector('#projects .section-title');
        const subtitle = document.querySelector('#projects .section-subtitle');
        
        if (title) title.textContent = projects.title;
        if (subtitle) subtitle.textContent = projects.subtitle;

        // Grid de projetos
        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        const activeProjects = projects.items.filter(project => project.isActive);
        
        projectsGrid.innerHTML = activeProjects.map(project => 
            `<div class="project-card" data-project-id="${project.id}" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="project-fallback">
                        <i class="fas fa-laptop-code"></i>
                        <span>${project.title}</span>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.technologies.map(tech => `<span class="tag">${tech}</span>`).join('')}
                    </div>
                    <div class="project-links">
                        ${project.links.demo ? `<a href="${project.links.demo}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i>Demo</a>` : ''}
                        ${project.links.github ? `<a href="${project.links.github}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i>Código</a>` : ''}
                    </div>
                </div>
            </div>`
        ).join('');
    }

    /**
     * Renderiza contato
     */
    renderContact() {
        const contact = this.content.contact;
        if (!contact) return;

        // Título e subtítulo
        const title = document.querySelector('#contact .section-title');
        const subtitle = document.querySelector('#contact .section-subtitle');
        
        if (title) title.textContent = contact.title;
        if (subtitle) subtitle.textContent = contact.subtitle;

        // Informações de contato
        this.renderContactInfo(contact);
        this.renderContactForm(contact.form);
    }

    /**
     * Renderiza informações de contato
     */
    renderContactInfo(contact) {
        const contactInfo = document.querySelector('.contact-info');
        if (!contactInfo) return;

        const greeting = contactInfo.querySelector('h3');
        const description = contactInfo.querySelector('p');
        
        if (greeting) greeting.textContent = contact.greeting;
        if (description) description.textContent = contact.description;

        // Items de contato
        const contactItems = contactInfo.querySelector('.contact-items');
        if (contactItems && contact.info) {
            contactItems.innerHTML = contact.info.map(item => 
                `<div class="contact-item">
                    <i class="${item.icon}"></i>
                    <div>
                        <span>${item.label}</span>
                        ${item.link ? `<a href="${item.link}">${item.value}</a>` : `<span>${item.value}</span>`}
                    </div>
                </div>`
            ).join('');
        }

        // Links sociais
        const socialLinks = contactInfo.querySelector('.social-links');
        if (socialLinks && contact.social) {
            const activeSocial = contact.social.filter(social => social.isActive);
            socialLinks.innerHTML = activeSocial.map(social => 
                `<a href="${social.url}" class="social-link" target="_blank" rel="noopener noreferrer" title="${social.label}">
                    <i class="${social.icon}"></i>
                </a>`
            ).join('');
        }
    }

    /**
     * Renderiza formulário de contato
     */
    renderContactForm(formConfig) {
        const contactForm = document.querySelector('.contact-form');
        if (!contactForm || !formConfig) return;

        const fieldsHTML = formConfig.fields.map(field => {
            if (field.type === 'textarea') {
                return `<div class="form-group">
                    <textarea name="${field.name}" placeholder="${field.placeholder}" 
                              rows="${field.rows}" ${field.required ? 'required' : ''}></textarea>
                </div>`;
            }
            return `<div class="form-group">
                <input type="${field.type}" name="${field.name}" 
                       placeholder="${field.placeholder}" ${field.required ? 'required' : ''}>
            </div>`;
        }).join('');

        contactForm.innerHTML = `
            ${fieldsHTML}
            <button type="submit" class="btn btn-primary">${formConfig.submitText}</button>
        `;
    }

    /**
     * Atualiza SEO da página
     */
    updateSEO() {
        const { site, seo } = this.content;
        if (!site && !seo) return;

        // Title
        if (site?.title) document.title = site.title;

        // Meta tags
        this.updateMetaTag('description', seo?.description || site?.description);
        this.updateMetaTag('keywords', seo?.keywords?.join(', '));
        this.updateMetaTag('author', site?.author);
        this.updateMetaTag('theme-color', site?.themeColor);

        // Open Graph
        if (seo?.ogImage) {
            this.updateMetaProperty('og:image', seo.ogImage);
            this.updateMetaProperty('og:title', site?.title);
            this.updateMetaProperty('og:description', seo?.description);
        }

        // Twitter Card
        if (seo?.twitterCard) {
            this.updateMetaName('twitter:card', seo.twitterCard);
            this.updateMetaName('twitter:image', seo.ogImage);
        }
    }

    /**
     * Atualiza meta tag
     */
    updateMetaTag(name, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Atualiza meta property
     */
    updateMetaProperty(property, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[property="${property}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('property', property);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Atualiza meta name
     */
    updateMetaName(name, content) {
        if (!content) return;
        
        let meta = document.querySelector(`meta[name="${name}"]`);
        if (!meta) {
            meta = document.createElement('meta');
            meta.setAttribute('name', name);
            document.head.appendChild(meta);
        }
        meta.setAttribute('content', content);
    }

    /**
     * Gerenciamento de imagens otimizado
     */
    setupImageHandling() {
        // Lazy loading para imagens
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }

        // Fallback para imagens quebradas
        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img), { once: true });
        });
    }

    /**
     * Configura lazy loading
     */
    setupLazyLoading() {
        const imageObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        }, { threshold: 0.1, rootMargin: '50px' });

        document.querySelectorAll('img[data-src]').forEach(img => {
            imageObserver.observe(img);
        });
    }

    /**
     * Manipula erro de imagem
     */
    handleImageError(img) {
        const fallback = img.nextElementSibling;
        if (fallback?.classList.contains('profile-fallback') || 
            fallback?.classList.contains('project-fallback')) {
            img.style.display = 'none';
            fallback.style.display = 'flex';
        }
    }

    /**
     * Adiciona conteúdo dinamicamente
     */
    addContent(section, item) {
        if (!this.content[section]) this.content[section] = { items: [] };
        if (!this.content[section].items) this.content[section].items = [];
        
        this.content[section].items.push({
            ...item,
            id: item.id || `${section}_${Date.now()}`,
            isActive: item.isActive !== false
        });
        
        this.renderContent();
        this.saveToCache(section, this.content[section]);
    }

    /**
     * Remove conteúdo
     */
    removeContent(section, itemId) {
        if (!this.content[section]?.items) return false;
        
        const index = this.content[section].items.findIndex(item => item.id === itemId);
        if (index === -1) return false;
        
        this.content[section].items.splice(index, 1);
        this.renderContent();
        this.saveToCache(section, this.content[section]);
        return true;
    }

    /**
     * Atualiza conteúdo existente
     */
    updateContent(section, itemId, updates) {
        if (!this.content[section]?.items) return false;
        
        const item = this.content[section].items.find(item => item.id === itemId);
        if (!item) return false;
        
        Object.assign(item, updates);
        this.renderContent();
        this.saveToCache(section, this.content[section]);
        return true;
    }

    /**
     * Obtém conteúdo específico - CORREÇÃO DO ERRO PRINCIPAL
     */
    getContent(section, itemId = null) {
        if (!this.content || !this.content[section]) return null;
        
        if (itemId) {
            return this.content[section].items?.find(item => item.id === itemId) || null;
        }
        
        return this.content[section];
    }

    /**
     * Filtra projetos por categoria
     */
    filterProjects(category = 'all') {
        const projectCards = document.querySelectorAll('.project-card');
        
        projectCards.forEach(card => {
            const cardCategory = card.dataset.category;
            const shouldShow = category === 'all' || cardCategory === category;
            
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
    }

    /**
     * Busca no conteúdo
     */
    search(query) {
        if (!this.content || !query) return [];
        
        const results = [];
        const searchTerms = query.toLowerCase().split(' ');
        
        // Busca em projetos
        if (this.content.projects?.items) {
            this.content.projects.items.forEach(project => {
                const searchText = `${project.title} ${project.description} ${project.technologies.join(' ')}`.toLowerCase();
                const score = searchTerms.reduce((acc, term) => 
                    acc + (searchText.includes(term) ? 1 : 0), 0);
                
                if (score > 0) {
                    results.push({ type: 'project', item: project, score, section: 'projects' });
                }
            });
        }

        // Busca em certificações
        if (this.content.certifications?.items) {
            this.content.certifications.items.forEach(cert => {
                const searchText = `${cert.title} ${cert.description} ${cert.skills.join(' ')}`.toLowerCase();
                const score = searchTerms.reduce((acc, term) => 
                    acc + (searchText.includes(term) ? 1 : 0), 0);
                
                if (score > 0) {
                    results.push({ type: 'certification', item: cert, score, section: 'certifications' });
                }
            });
        }

        return results.sort((a, b) => b.score - a.score);
    }

    /**
     * Cache management
     */
    saveToCache(key, data) {
        this.cache.set(key, {
            data: JSON.parse(JSON.stringify(data)),
            timestamp: Date.now()
        });
    }

    getFromCache(key, maxAge = 300000) { // 5 min default
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const isExpired = Date.now() - cached.timestamp > maxAge;
        return isExpired ? null : cached.data;
    }

    clearCache() {
        this.cache.clear();
    }

    /**
     * Event binding
     */
    bindEvents() {
        // Observa mudanças no conteúdo
        document.addEventListener('cms:contentUpdated', (e) => {
            console.log('📄 Conteúdo atualizado:', e.detail);
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            // Ctrl/Cmd + K para busca
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showSearchModal();
            }
        });
    }

    /**
     * Modal de busca
     */
    showSearchModal() {
        const modal = document.createElement('div');
        modal.className = 'search-modal';
        modal.innerHTML = `
            <div class="search-modal-content">
                <div class="search-input-container">
                    <i class="fas fa-search"></i>
                    <input type="text" placeholder="Buscar projetos, certificações..." class="search-input">
                    <button class="search-close"><i class="fas fa-times"></i></button>
                </div>
                <div class="search-results"></div>
            </div>
        `;

        // Styles
        Object.assign(modal.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            background: 'rgba(0, 0, 0, 0.8)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'center',
            zIndex: '9999',
            paddingTop: '10vh'
        });

        const content = modal.querySelector('.search-modal-content');
        Object.assign(content.style, {
            background: 'var(--bg-secondary)',
            borderRadius: 'var(--radius)',
            padding: '2rem',
            maxWidth: '600px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto'
        });

        document.body.appendChild(modal);

        const searchInput = modal.querySelector('.search-input');
        const searchResults = modal.querySelector('.search-results');
        
        searchInput.focus();

        // Busca em tempo real
        let searchTimeout;
        searchInput.addEventListener('input', (e) => {
            clearTimeout(searchTimeout);
            searchTimeout = setTimeout(() => {
                const results = this.search(e.target.value);
                this.renderSearchResults(searchResults, results);
            }, 300);
        });

        // Fechar modal
        const closeModal = () => modal.remove();
        modal.querySelector('.search-close').onclick = closeModal;
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closeModal();
        }, { once: true });
    }

    /**
     * Renderiza resultados de busca
     */
    renderSearchResults(container, results) {
        if (!results.length) {
            container.innerHTML = '<p style="color: var(--text-muted); text-align: center; padding: 2rem;">Nenhum resultado encontrado</p>';
            return;
        }

        container.innerHTML = results.map(result => `
            <div class="search-result-item" data-section="${result.section}" data-id="${result.item.id}">
                <div class="search-result-type">${result.type === 'project' ? 'Projeto' : 'Certificação'}</div>
                <h4>${result.item.title}</h4>
                <p>${result.item.description.substring(0, 100)}...</p>
            </div>
        `).join('');

        // Add click handlers
        container.querySelectorAll('.search-result-item').forEach(item => {
            item.style.cssText = `
                padding: 1.5rem;
                border: 1px solid var(--border-color);
                border-radius: var(--radius);
                margin-bottom: 1rem;
                cursor: pointer;
                transition: var(--transition);
            `;
            
            item.addEventListener('click', () => {
                const section = item.dataset.section;
                document.querySelector(`#${section}`).scrollIntoView({ 
                    behavior: 'smooth', 
                    block: 'start' 
                });
                container.closest('.search-modal').remove();
            });
            
            item.addEventListener('mouseenter', () => {
                item.style.borderColor = 'var(--primary)';
                item.style.background = 'var(--bg-primary)';
            });
            
            item.addEventListener('mouseleave', () => {
                item.style.borderColor = 'var(--border-color)';
                item.style.background = 'transparent';
            });
        });
    }

    /**
     * API para desenvolvedores - CORREÇÃO DO ERRO PRINCIPAL
     */
    getAPI() {
        return {
            // Getters - com verificação de existência
            getProjects: () => {
                if (!this.content || !this.content.projects) return [];
                return this.content.projects.items || [];
            },
            getCertifications: () => {
                if (!this.content || !this.content.certifications) return [];
                return this.content.certifications.items || [];
            },
            getProject: (id) => this.getContent('projects', id),
            getCertification: (id) => this.getContent('certifications', id),
            
            // Actions
            addProject: (project) => this.addContent('projects', project),
            addCertification: (cert) => this.addContent('certifications', cert),
            updateProject: (id, updates) => this.updateContent('projects', id, updates),
            updateCertification: (id, updates) => this.updateContent('certifications', id, updates),
            removeProject: (id) => this.removeContent('projects', id),
            removeCertification: (id) => this.removeContent('certifications', id),
            
            // Utilities
            search: (query) => this.search(query),
            filterProjects: (category) => this.filterProjects(category),
            clearCache: () => this.clearCache(),
            
            // Data
            getAllContent: () => this.content || {},
            isLoaded: () => this.isLoaded
        };
    }

    /**
     * Performance monitoring
     */
    getPerformanceMetrics() {
        return {
            cacheSize: this.cache.size,
            loadTime: this.loadingPromise ? 'Loading...' : 'Loaded',
            contentSections: Object.keys(this.content || {}),
            lastUpdate: new Date().toISOString()
        };
    }
}

// Renderizar footer
PortfolioCMS.prototype.renderFooter = function() {
    const footer = this.content.footer;
    if (!footer) return;

    const footerContent = document.querySelector('.footer-content');
    if (footerContent) {
        footerContent.innerHTML = `
            <p>${footer.copyright}</p>
            <p>${footer.madeWith}</p>
        `;
    }
};

// Instância global do CMS
window.portfolioCMS = new PortfolioCMS();

// Auto-inicialização
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => window.portfolioCMS.init());
} else {
    window.portfolioCMS.init();
}

// Export para módulos ES6
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PortfolioCMS;
}

// REMOÇÃO DA CHAMADA PROBLEMÁTICA
// A chamada direta da API foi removida para evitar o erro