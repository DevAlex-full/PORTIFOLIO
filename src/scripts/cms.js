/**
 * CMS (Content Management System) para Portfólio
 * Sistema otimizado com persistência local para sites estáticos
 */

class PortfolioCMS {
    constructor() {
        this.content = null;
        this.cache = new Map();
        this.observers = new Map();
        this.isLoaded = false;
        this.loadingPromise = null;
        this.storageKey = 'portfolio_cms_content';
        this.hasLocalChanges = false;
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
     * Carrega o conteúdo com prioridade para localStorage
     */
    async loadContent() {
        try {
            // Primeiro tenta carregar do localStorage
            const localContent = this.loadFromLocalStorage();
            if (localContent) {
                this.content = localContent;
                this.hasLocalChanges = true;
                this.isLoaded = true;
                this.renderContent();
                this.updateSEO();
                console.log('📦 Conteúdo carregado do localStorage');
                
                // Carrega do servidor em background para sincronização
                this.loadFromServer().catch(() => {
                    console.log('📡 Servidor não disponível, usando dados locais');
                });
                return;
            }
            
            // Se não há dados locais, carrega do servidor
            await this.loadFromServer();
            
        } catch (error) {
            console.warn('⚠️ Erro ao carregar CMS, usando conteúdo padrão:', error.message);
            this.loadFallbackContent();
        }
    }

    /**
     * Carrega conteúdo do servidor
     */
    async loadFromServer() {
        const response = await fetch('./src/data/content.json?v=' + Date.now());
        if (!response.ok) throw new Error(`HTTP ${response.status}`);
        
        const serverContent = await response.json();
        
        // Se não há mudanças locais, usa dados do servidor
        if (!this.hasLocalChanges) {
            this.content = serverContent;
            this.isLoaded = true;
            this.renderContent();
            this.updateSEO();
        }
        
        // Salva versão do servidor como backup
        this.saveToLocalStorage(serverContent, 'portfolio_cms_server_backup');
    }

    /**
     * Salva conteúdo no localStorage
     */
    saveToLocalStorage(content = this.content, key = this.storageKey) {
        try {
            const dataToSave = {
                content,
                timestamp: Date.now(),
                version: '1.0.0'
            };
            localStorage.setItem(key, JSON.stringify(dataToSave));
            if (key === this.storageKey) {
                this.hasLocalChanges = true;
            }
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Carrega conteúdo do localStorage
     */
    loadFromLocalStorage(key = this.storageKey) {
        try {
            const stored = localStorage.getItem(key);
            if (!stored) return null;
            
            const data = JSON.parse(stored);
            
            // Verifica se os dados não são muito antigos (7 dias)
            const maxAge = 7 * 24 * 60 * 60 * 1000;
            if (Date.now() - data.timestamp > maxAge) {
                localStorage.removeItem(key);
                return null;
            }
            
            return data.content;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    /**
     * Limpa dados locais
     */
    clearLocalStorage() {
        try {
            localStorage.removeItem(this.storageKey);
            localStorage.removeItem('portfolio_cms_server_backup');
            this.hasLocalChanges = false;
            console.log('🗑️ Cache local limpo');
            return true;
        } catch (error) {
            console.error('Erro ao limpar localStorage:', error);
            return false;
        }
    }

    /**
     * Restaura backup do servidor
     */
    restoreFromServerBackup() {
        const backup = this.loadFromLocalStorage('portfolio_cms_server_backup');
        if (backup) {
            this.content = backup;
            this.saveToLocalStorage();
            this.renderContent();
            console.log('🔄 Conteúdo restaurado do backup do servidor');
            return true;
        }
        return false;
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
            projects: { items: [] },
            certifications: { items: [] },
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
        
        // Adiciona indicador de mudanças locais
        this.updateLocalChangeIndicator();
        
        // Dispara evento personalizado
        document.dispatchEvent(new CustomEvent('cms:contentLoaded', { 
            detail: { content: this.content, hasLocalChanges: this.hasLocalChanges } 
        }));
    }

    /**
     * Adiciona indicador visual de mudanças locais
     */
    updateLocalChangeIndicator() {
        if (typeof window !== 'undefined' && window.location.pathname.includes('/admin')) {
            return; // Não mostra no admin
        }

        // Remove indicador existente
        const existing = document.querySelector('.local-changes-indicator');
        if (existing) existing.remove();

        if (!this.hasLocalChanges) return;

        const indicator = document.createElement('div');
        indicator.className = 'local-changes-indicator';
        indicator.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-exclamation-triangle"></i>
                <span>Visualizando alterações locais</span>
                <button onclick="portfolioCMS.clearLocalStorage(); location.reload();" 
                        style="background: none; border: 1px solid rgba(255,255,255,0.3); color: inherit; 
                               padding: 0.2rem 0.5rem; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                    Restaurar Original
                </button>
            </div>
        `;

        Object.assign(indicator.style, {
            position: 'fixed',
            top: '0',
            left: '0',
            right: '0',
            background: 'linear-gradient(135deg, #f59e0b, #d97706)',
            color: 'white',
            padding: '0.5rem 1rem',
            fontSize: '0.9rem',
            fontWeight: '500',
            zIndex: '9998',
            textAlign: 'center',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)'
        });

        document.body.appendChild(indicator);

        // Ajusta o padding do body para compensar o indicador
        document.body.style.paddingTop = '50px';
    }

    /**
     * Renderiza a navegação
     */
    renderNavigation() {
        const nav = this.content.navigation;
        if (!nav) return;

        const logoText = document.querySelector('.nav-logo h2');
        if (logoText && nav.logo) logoText.textContent = nav.logo.text;

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

        const title = document.querySelector('#about .section-title');
        const subtitle = document.querySelector('#about .section-subtitle');
        
        if (title) title.textContent = about.title;
        if (subtitle) subtitle.textContent = about.subtitle;

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
        if (!skills || !skills.length) return '';
        
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

        const title = document.querySelector('#certifications .section-title');
        const subtitle = document.querySelector('#certifications .section-subtitle');
        
        if (title) title.textContent = certs.title;
        if (subtitle) subtitle.textContent = certs.subtitle;

        this.renderCertificationStats(certs.stats);
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
                        ${cert.skills?.map(skill => `<span class="cert-skill">${skill}</span>`).join('') || ''}
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

        const title = document.querySelector('#projects .section-title');
        const subtitle = document.querySelector('#projects .section-subtitle');
        
        if (title) title.textContent = projects.title;
        if (subtitle) subtitle.textContent = projects.subtitle;

        const projectsGrid = document.querySelector('.projects-grid');
        if (!projectsGrid) return;

        const activeProjects = projects.items?.filter(project => project.isActive) || [];
        
        projectsGrid.innerHTML = activeProjects.map(project => 
            `<div class="project-card" data-project-id="${project.id}" data-category="${project.category}">
                <div class="project-image">
                    <img src="${project.image}" alt="${project.title}" loading="lazy" 
                         onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                    <div class="project-fallback" style="display: none; align-items: center; justify-content: center; height: 200px; background: var(--bg-secondary, #1a1a1a); border-radius: 8px;">
                        <i class="fas fa-laptop-code" style="font-size: 3rem; color: var(--text-muted, #9ca3af);"></i>
                    </div>
                </div>
                <div class="project-content">
                    <h3 class="project-title">${project.title}</h3>
                    <p class="project-description">${project.description}</p>
                    <div class="project-tags">
                        ${project.technologies?.map(tech => `<span class="tag">${tech}</span>`).join('') || ''}
                    </div>
                    <div class="project-links">
                        ${project.links?.demo ? `<a href="${project.links.demo}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fas fa-external-link-alt"></i>Demo</a>` : ''}
                        ${project.links?.github ? `<a href="${project.links.github}" class="project-link" target="_blank" rel="noopener noreferrer"><i class="fab fa-github"></i>Código</a>` : ''}
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

        const title = document.querySelector('#contact .section-title');
        const subtitle = document.querySelector('#contact .section-subtitle');
        
        if (title) title.textContent = contact.title;
        if (subtitle) subtitle.textContent = contact.subtitle;

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
     * Renderiza footer
     */
    renderFooter() {
        const footer = this.content.footer;
        if (!footer) return;

        const footerContent = document.querySelector('.footer-content');
        if (footerContent) {
            footerContent.innerHTML = `
                <p>${footer.copyright}</p>
                <p>${footer.madeWith}</p>
            `;
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
        
        this.saveToLocalStorage();
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
        this.saveToLocalStorage();
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
        this.saveToLocalStorage();
        this.renderContent();
        this.saveToCache(section, this.content[section]);
        return true;
    }

    /**
     * Obtém conteúdo específico
     */
    getContent(section, itemId = null) {
        if (!this.content || !this.content[section]) return null;
        
        if (itemId) {
            return this.content[section].items?.find(item => item.id === itemId) || null;
        }
        
        return this.content[section];
    }

    /**
     * Atualiza SEO da página
     */
    updateSEO() {
        const { site, seo } = this.content;
        if (!site && !seo) return;

        if (site?.title) document.title = site.title;

        this.updateMetaTag('description', seo?.description || site?.description);
        this.updateMetaTag('keywords', seo?.keywords?.join(', '));
        this.updateMetaTag('author', site?.author);
        this.updateMetaTag('theme-color', site?.themeColor);

        if (seo?.ogImage) {
            this.updateMetaProperty('og:image', seo.ogImage);
            this.updateMetaProperty('og:title', site?.title);
            this.updateMetaProperty('og:description', seo?.description);
        }

        if (seo?.twitterCard) {
            this.updateMetaName('twitter:card', seo.twitterCard);
            this.updateMetaName('twitter:image', seo.ogImage);
        }
    }

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
        if ('IntersectionObserver' in window) {
            this.setupLazyLoading();
        }

        document.querySelectorAll('img').forEach(img => {
            img.addEventListener('error', () => this.handleImageError(img), { once: true });
        });
    }

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

    handleImageError(img) {
        const fallback = img.nextElementSibling;
        if (fallback?.classList.contains('project-fallback') || 
            fallback?.classList.contains('profile-fallback')) {
            img.style.display = 'none';
            fallback.style.display = 'flex';
        }
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
        
        if (this.content.projects?.items) {
            this.content.projects.items.forEach(project => {
                const searchText = `${project.title} ${project.description} ${project.technologies?.join(' ') || ''}`.toLowerCase();
                const score = searchTerms.reduce((acc, term) => 
                    acc + (searchText.includes(term) ? 1 : 0), 0);
                
                if (score > 0) {
                    results.push({ type: 'project', item: project, score, section: 'projects' });
                }
            });
        }

        if (this.content.certifications?.items) {
            this.content.certifications.items.forEach(cert => {
                const searchText = `${cert.title} ${cert.description} ${cert.skills?.join(' ') || ''}`.toLowerCase();
                const score = searchTerms.reduce((acc, term) => 
                    acc + (searchText.includes(term) ? 1 : 0), 0);
                
                if (score > 0) {
                    results.push({ type: 'certification', item: cert, score, section: 'certifications' });
                }
            });
        }

        return results.sort((a, b) => b.score - a.score);
    }

    saveToCache(key, data) {
        this.cache.set(key, {
            data: JSON.parse(JSON.stringify(data)),
            timestamp: Date.now()
        });
    }

    getFromCache(key, maxAge = 300000) {
        const cached = this.cache.get(key);
        if (!cached) return null;
        
        const isExpired = Date.now() - cached.timestamp > maxAge;
        return isExpired ? null : cached.data;
    }

    clearCache() {
        this.cache.clear();
    }

    bindEvents() {
        document.addEventListener('cms:contentUpdated', (e) => {
            console.log('📄 Conteúdo atualizado:', e.detail);
        });

        document.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                this.showSearchModal();
            }
        });
    }

    showSearchModal() {
        // Implementação do modal de busca (mantido simples)
        console.log('Modal de busca ativado - Ctrl+K');
    }

    /**
     * API para desenvolvedores
     */
    getAPI() {
        return {
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
            
            addProject: (project) => this.addContent('projects', project),
            addCertification: (cert) => this.addContent('certifications', cert),
            updateProject: (id, updates) => this.updateContent('projects', id, updates),
            updateCertification: (id, updates) => this.updateContent('certifications', id, updates),
            removeProject: (id) => this.removeContent('projects', id),
            removeCertification: (id) => this.removeContent('certifications', id),
            
            search: (query) => this.search(query),
            filterProjects: (category) => this.filterProjects(category),
            clearCache: () => this.clearCache(),
            
            saveToLocalStorage: () => this.saveToLocalStorage(),
            clearLocalStorage: () => this.clearLocalStorage(),
            restoreFromServerBackup: () => this.restoreFromServerBackup(),
            hasLocalChanges: () => this.hasLocalChanges,
            
            getAllContent: () => this.content || {},
            isLoaded: () => this.isLoaded,
            
            updateHero: (data) => {
                Object.assign(this.content.hero, data);
                this.saveToLocalStorage();
                this.renderContent();
            },
            updateAbout: (data) => {
                Object.assign(this.content.about, data);
                this.saveToLocalStorage();
                this.renderContent();
            },
            updateContact: (data) => {
                Object.assign(this.content.contact, data);
                this.saveToLocalStorage();
                this.renderContent();
            },
            updateSite: (data) => {
                Object.assign(this.content.site, data);
                this.saveToLocalStorage();
                this.renderContent();
            }
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
            lastUpdate: new Date().toISOString(),
            hasLocalChanges: this.hasLocalChanges,
            localStorageSize: this.getLocalStorageSize()
        };
    }

    getLocalStorageSize() {
        try {
            let total = 0;
            for (let key in localStorage) {
                if (localStorage.hasOwnProperty(key)) {
                    total += localStorage[key].length + key.length;
                }
            }
            return `${(total / 1024).toFixed(2)} KB`;
        } catch (error) {
            return 'N/A';
        }
    }
}

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