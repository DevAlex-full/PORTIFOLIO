/**
 * Admin Panel JavaScript
 * Sistema de administração com persistência local
 */

class PortfolioCMSAdmin {
    constructor() {
        this.content = null;
        this.currentSection = 'dashboard';
        this.editingItem = null;
        this.editingType = null;
        this.storageKey = 'portfolio_cms_content';
    }

    async init() {
        await this.loadContent();
        this.bindEvents();
        this.renderDashboard();
        this.showPersistenceInfo();
        console.log('🔧 Admin CMS inicializado com persistência local');
    }

    /**
     * Carrega conteúdo com prioridade para localStorage
     */
    async loadContent() {
        try {
            // Primeiro tenta carregar do localStorage
            const localContent = this.loadFromLocalStorage();
            if (localContent) {
                this.content = localContent;
                console.log('📦 Conteúdo carregado do localStorage no admin');
                return;
            }

            // Se não há dados locais, carrega do servidor
            const response = await fetch('./src/data/content.json?v=' + Date.now());
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            this.content = await response.json();
            console.log('📡 Conteúdo carregado do servidor no admin');

        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            this.content = this.getDefaultContent();
        }
    }

    /**
     * Carrega do localStorage
     */
    loadFromLocalStorage() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return null;

            const data = JSON.parse(stored);
            return data.content;
        } catch (error) {
            console.error('Erro ao carregar do localStorage:', error);
            return null;
        }
    }

    /**
     * Salva no localStorage
     */
    saveToLocalStorage() {
        try {
            const dataToSave = {
                content: this.content,
                timestamp: Date.now(),
                version: '1.0.0'
            };
            localStorage.setItem(this.storageKey, JSON.stringify(dataToSave));
            this.showPersistenceInfo();
            console.log('💾 Conteúdo salvo no localStorage');
            return true;
        } catch (error) {
            console.error('Erro ao salvar no localStorage:', error);
            return false;
        }
    }

    /**
     * Mostra informações sobre persistência
     */
    showPersistenceInfo() {
        // Remove info existente
        const existing = document.querySelector('.persistence-info');
        if (existing) existing.remove();

        const hasLocalChanges = localStorage.getItem(this.storageKey);
        if (!hasLocalChanges) return;

        const info = document.createElement('div');
        info.className = 'persistence-info';
        info.innerHTML = `
            <div style="display: flex; align-items: center; justify-content: space-between; gap: 1rem;">
                <div style="display: flex; align-items: center; gap: 0.5rem;">
                    <i class="fas fa-info-circle"></i>
                    <span>Suas alterações estão salvas localmente</span>
                </div>
                <div style="display: flex; gap: 0.5rem;">
                    <button onclick="admin.previewChanges()" class="btn btn-small btn-primary">
                        <i class="fas fa-eye"></i> Visualizar
                    </button>
                    <button onclick="admin.clearLocalStorage()" class="btn btn-small btn-warning">
                        <i class="fas fa-undo"></i> Resetar
                    </button>
                </div>
            </div>
        `;

        Object.assign(info.style, {
            background: 'linear-gradient(135deg, #10b981, #059669)',
            color: 'white',
            padding: '1rem',
            borderRadius: 'var(--radius)',
            margin: '1rem 0',
            fontSize: '0.9rem',
            fontWeight: '500'
        });

        const mainContent = document.querySelector('.main-content');
        if (mainContent) {
            mainContent.insertBefore(info, mainContent.firstChild);
        }
    }

    /**
     * Visualiza as alterações no site principal
     */
    previewChanges() {
        const previewUrl = window.location.href.replace('/admin', '');
        window.open(previewUrl, '_blank');
    }

    /**
     * Limpa localStorage
     */
    clearLocalStorage() {
        if (confirm('Tem certeza que deseja descartar todas as alterações locais?')) {
            try {
                localStorage.removeItem(this.storageKey);
                localStorage.removeItem('portfolio_cms_server_backup');
                location.reload();
            } catch (error) {
                console.error('Erro ao limpar localStorage:', error);
                showNotification('Erro ao limpar dados locais', 'error');
            }
        }
    }

    getDefaultContent() {
        return {
            projects: { items: [] },
            certifications: { items: [] },
            about: { skills: [] },
            hero: {},
            contact: { info: [] },
            site: {},
            settings: {}
        };
    }

    bindEvents() {
        // Navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const section = link.dataset.section;
                this.switchSection(section);
            });
        });

        // Form submission
        const editForm = document.getElementById('editForm');
        if (editForm) {
            editForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.saveItem();
            });
        }

        // Refresh data
        const refreshBtn = document.getElementById('refreshData');
        if (refreshBtn) {
            refreshBtn.addEventListener('click', () => {
                this.loadContent().then(() => this.renderCurrentSection());
            });
        }
    }

    switchSection(section) {
        // Update navigation
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.toggle('active', link.dataset.section === section);
        });

        // Update content
        document.querySelectorAll('.content-section').forEach(content => {
            const isActive = content.id === `${section}-content`;
            content.style.display = isActive ? 'block' : 'none';
            if (isActive) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        this.currentSection = section;
        this.renderCurrentSection();
    }

    renderCurrentSection() {
        switch (this.currentSection) {
            case 'dashboard':
                this.renderDashboard();
                break;
            case 'projects':
                this.renderProjectsList();
                break;
            case 'certifications':
                this.renderCertificationsList();
                break;
            case 'content':
                this.renderContentEditor();
                break;
            case 'settings':
                this.renderSettings();
                break;
        }
    }

    renderDashboard() {
        const projects = this.content.projects?.items?.filter(p => p.isActive) || [];
        const certifications = this.content.certifications?.items?.filter(c => c.isActive) || [];
        const skills = this.content.about?.skills || [];

        const projectsCountEl = document.getElementById('projectsCount');
        const certificationsCountEl = document.getElementById('certificationsCount');
        const skillsCountEl = document.getElementById('skillsCount');
        const lastUpdateEl = document.getElementById('lastUpdate');

        if (projectsCountEl) projectsCountEl.textContent = projects.length;
        if (certificationsCountEl) certificationsCountEl.textContent = certifications.length;
        if (skillsCountEl) skillsCountEl.textContent = skills.length;
        if (lastUpdateEl) lastUpdateEl.textContent = new Date().toLocaleDateString('pt-BR');
    }

    renderProjectsList() {
        const container = document.getElementById('projectsList');
        if (!container) return;

        const projects = this.content.projects?.items || [];

        container.innerHTML = projects.map(project => `
            <div class="content-card" data-id="${project.id}">
                <div class="card-header">
                    <div>
                        <h4 class="card-title">${project.title}</h4>
                        <p class="card-subtitle">${project.category || 'Geral'}</p>
                        <span class="status-badge ${project.isActive ? 'status-active' : ''}">
                            ${project.isActive ? 'Ativo' : 'Inativo'}
                        </span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-small btn-primary" onclick="admin.editItem('project', '${project.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="admin.deleteItem('projects', '${project.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 1rem;">
                    ${project.description?.substring(0, 100) || 'Sem descrição'}...
                </p>
                <div style="margin-top: 1rem;">
                    ${project.technologies?.map(tech =>
                        `<span style="background: rgba(139, 92, 246, 0.2); color: var(--primary); padding: 0.2rem 0.6rem; border-radius: 1rem; font-size: 0.8rem; margin-right: 0.5rem;">${tech}</span>`
                    ).join('') || ''}
                </div>
            </div>
        `).join('');
    }

    renderCertificationsList() {
        const container = document.getElementById('certificationsList');
        if (!container) return;

        const certifications = this.content.certifications?.items || [];

        container.innerHTML = certifications.map(cert => `
            <div class="content-card" data-id="${cert.id}">
                <div class="card-header">
                    <div>
                        <h4 class="card-title">${cert.title}</h4>
                        <p class="card-subtitle">${cert.institution}</p>
                        <span class="status-badge ${cert.status === 'verified' ? 'status-verified' : 'status-progress'}">
                            ${cert.status === 'verified' ? 'Verificado' : 'Em Progresso'}
                        </span>
                    </div>
                    <div class="card-actions">
                        <button class="btn btn-small btn-primary" onclick="admin.editItem('certification', '${cert.id}')">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn btn-small btn-danger" onclick="admin.deleteItem('certifications', '${cert.id}')">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
                <p style="font-size: 0.9rem; color: var(--text-muted); margin-top: 1rem;">
                    ${cert.description?.substring(0, 100) || 'Sem descrição'}...
                </p>
                <div style="margin-top: 1rem; font-size: 0.8rem; color: var(--text-muted);">
                    <span><i class="fas fa-calendar"></i> ${cert.date}</span>
                    <span style="margin-left: 1rem;"><i class="fas fa-clock"></i> ${cert.duration}</span>
                </div>
            </div>
        `).join('');
    }

    renderContentEditor() {
        const container = document.getElementById('contentEditor');
        if (!container) return;

        container.innerHTML = `
            <div class="content-card">
                <h3>Informações Pessoais</h3>
                <div class="form-group">
                    <label class="form-label">Título Hero</label>
                    <input type="text" class="form-input" id="heroTitle" value="${this.content.hero?.title || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Subtítulo</label>
                    <input type="text" class="form-input" id="heroSubtitle" value="${this.content.hero?.subtitle || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <textarea class="form-textarea" id="heroDescription">${this.content.hero?.description || ''}</textarea>
                </div>
            </div>

            <div class="content-card">
                <h3>Sobre Mim</h3>
                <div class="form-group">
                    <label class="form-label">Conteúdo (um parágrafo por linha)</label>
                    <textarea class="form-textarea" id="aboutContent" rows="6">${this.content.about?.content?.join('\n') || ''}</textarea>
                </div>
            </div>

            <div class="content-card">
                <h3>Informações de Contato</h3>
                <div class="form-group">
                    <label class="form-label">Email</label>
                    <input type="email" class="form-input" id="contactEmail" value="${this.content.contact?.info?.find(i => i.type === 'email')?.value || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Telefone</label>
                    <input type="tel" class="form-input" id="contactPhone" value="${this.content.contact?.info?.find(i => i.type === 'phone')?.value || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Localização</label>
                    <input type="text" class="form-input" id="contactLocation" value="${this.content.contact?.info?.find(i => i.type === 'location')?.value || ''}">
                </div>
            </div>
        `;
    }

    renderSettings() {
        const container = document.getElementById('settingsPanel');
        if (!container) return;
        
        container.innerHTML = `
            <div class="content-card">
                <h3>Configurações do Site</h3>
                <div class="form-group">
                    <label class="form-label">Título do Site</label>
                    <input type="text" class="form-input" id="siteTitle" value="${this.content.site?.title || ''}">
                </div>
                <div class="form-group">
                    <label class="form-label">Descrição</label>
                    <textarea class="form-textarea" id="siteDescription">${this.content.site?.description || ''}</textarea>
                </div>
                <div class="form-group">
                    <label class="form-label">Cor do Tema</label>
                    <input type="color" class="form-input" id="themeColor" value="${this.content.site?.themeColor || '#8b5cf6'}">
                </div>
            </div>

            <div class="content-card">
                <h3>Configurações Avançadas</h3>
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="animationsEnabled" ${this.content.settings?.animationsEnabled ? 'checked' : ''}>
                        Habilitar Animações
                    </label>
                </div>
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="lazyLoadImages" ${this.content.settings?.lazyLoadImages ? 'checked' : ''}>
                        Carregamento Lazy de Imagens
                    </label>
                </div>
                <div class="form-group">
                    <label style="display: flex; align-items: center; gap: 0.5rem;">
                        <input type="checkbox" id="showBackToTop" ${this.content.settings?.showBackToTop ? 'checked' : ''}>
                        Mostrar Botão "Voltar ao Topo"
                    </label>
                </div>
            </div>

            <div class="content-card">
                <h3>Gerenciamento Local</h3>
                <div class="form-group">
                    <p style="color: var(--text-muted); margin-bottom: 1rem;">
                        Suas alterações são salvas automaticamente no navegador. 
                        Use as opções abaixo para gerenciar seus dados.
                    </p>
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap;">
                        <button type="button" class="btn btn-warning" onclick="admin.downloadBackup()">
                            <i class="fas fa-download"></i> Baixar Backup
                        </button>
                        <button type="button" class="btn btn-success" onclick="admin.uploadBackup()">
                            <i class="fas fa-upload"></i> Restaurar Backup
                        </button>
                        <button type="button" class="btn btn-danger" onclick="admin.clearLocalStorage()">
                            <i class="fas fa-trash"></i> Limpar Dados
                        </button>
                    </div>
                </div>
            </div>
        `;
    }

    editItem(type, id) {
        const section = type === 'project' ? 'projects' : 'certifications';
        const item = this.content[section]?.items?.find(i => i.id === id);
        
        if (!item) return;
        
        this.editingType = type;
        this.editingItem = item;
        
        showAddModal(type);
        
        // Preencher campos
        const form = document.getElementById('editForm');
        if (!form) return;

        Object.keys(item).forEach(key => {
            const field = form.querySelector(`[name="${key}"]`);
            if (field) {
                if (field.type === 'checkbox') {
                    field.checked = item[key];
                } else if (key === 'technologies' || key === 'skills') {
                    field.value = Array.isArray(item[key]) ? item[key].join(', ') : item[key];
                } else if (key === 'links' && type === 'project') {
                    const demoField = form.querySelector('[name="demoLink"]');
                    const githubField = form.querySelector('[name="githubLink"]');
                    if (demoField) demoField.value = item.links?.demo || '';
                    if (githubField) githubField.value = item.links?.github || '';
                } else {
                    field.value = item[key] || '';
                }
            }
        });
        
        const modalTitle = document.getElementById('modalTitle');
        if (modalTitle) {
            modalTitle.textContent = `Editar ${type === 'project' ? 'Projeto' : 'Certificação'}`;
        }
    }

    deleteItem(section, id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            const items = this.content[section]?.items;
            if (items) {
                const index = items.findIndex(item => item.id === id);
                if (index !== -1) {
                    items.splice(index, 1);
                    this.saveToLocalStorage();
                    this.renderCurrentSection();
                    showNotification('Item excluído com sucesso!', 'success');
                }
            }
        }
    }

    saveItem() {
        const form = document.getElementById('editForm');
        if (!form) return;

        const formData = new FormData(form);
        const data = {};
        
        // Convert form data to object
        for (let [key, value] of formData.entries()) {
            if (key === 'technologies' || key === 'skills') {
                data[key] = value.split(',').map(item => item.trim()).filter(item => item);
            } else if (key === 'isActive' || key === 'featured') {
                data[key] = true;
            } else {
                data[key] = value;
            }
        }
        
        // Handle checkboxes that weren't checked
        const checkboxes = form.querySelectorAll('input[type="checkbox"]');
        checkboxes.forEach(cb => {
            if (!formData.has(cb.name)) {
                data[cb.name] = false;
            }
        });
        
        // Special handling for project links
        if (this.editingType === 'project') {
            data.links = {
                demo: data.demoLink || '',
                github: data.githubLink || ''
            };
            delete data.demoLink;
            delete data.githubLink;
        }
        
        const section = this.editingType === 'project' ? 'projects' : 'certifications';
        
        if (this.editingItem) {
            // Update existing
            Object.assign(this.editingItem, data);
        } else {
            // Add new
            data.id = `${this.editingType}_${Date.now()}`;
            if (!this.content[section].items) this.content[section].items = [];
            this.content[section].items.push(data);
        }
        
        this.saveToLocalStorage();
        this.renderCurrentSection();
        closeModal();
        showNotification(`${this.editingType === 'project' ? 'Projeto' : 'Certificação'} salvo com sucesso!`, 'success');
    }

    downloadBackup() {
        const backup = {
            content: this.content,
            timestamp: Date.now(),
            version: '1.0.0',
            source: 'admin-panel'
        };
        
        const blob = new Blob([JSON.stringify(backup, null, 2)], { 
            type: 'application/json' 
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`;
        a.click();
        URL.revokeObjectURL(url);
        
        showNotification('Backup baixado com sucesso!', 'success');
    }

    uploadBackup() {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.json';
        
        input.onchange = (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const backup = JSON.parse(e.target.result);
                    
                    if (backup.content) {
                        this.content = backup.content;
                        this.saveToLocalStorage();
                        this.renderCurrentSection();
                        showNotification('Backup restaurado com sucesso!', 'success');
                    } else {
                        showNotification('Formato de backup inválido!', 'error');
                    }
                } catch (error) {
                    showNotification('Erro ao restaurar backup!', 'error');
                }
            };
            reader.readAsText(file);
        };
        
        input.click();
    }
}

// Global functions
function showAddModal(type) {
    if (!window.admin) return;

    admin.editingType = type;
    admin.editingItem = null;
    
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const formFields = document.getElementById('formFields');
    
    if (!modal || !title || !formFields) return;

    title.textContent = type === 'project' ? 'Novo Projeto' : 'Nova Certificação';
    
    if (type === 'project') {
        formFields.innerHTML = `
            <div class="form-group">
                <label class="form-label">Título</label>
                <input type="text" class="form-input" name="title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Descrição</label>
                <textarea class="form-textarea" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Imagem (URL)</label>
                <input type="url" class="form-input" name="image">
            </div>
            <div class="form-group">
                <label class="form-label">Tecnologias (separadas por vírgula)</label>
                <input type="text" class="form-input" name="technologies" placeholder="HTML, CSS, JavaScript">
            </div>
            <div class="form-group">
                <label class="form-label">Link Demo</label>
                <input type="url" class="form-input" name="demoLink">
            </div>
            <div class="form-group">
                <label class="form-label">Link GitHub</label>
                <input type="url" class="form-input" name="githubLink">
            </div>
            <div class="form-group">
                <label class="form-label">Categoria</label>
                <select class="form-select" name="category">
                    <option value="web">Web</option>
                    <option value="mobile">Mobile</option>
                    <option value="desktop">Desktop</option>
                    <option value="interactive">Interativo</option>
                    <option value="business">Negócios</option>
                </select>
            </div>
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" name="isActive" checked>
                    Projeto Ativo
                </label>
            </div>
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" name="featured">
                    Projeto em Destaque
                </label>
            </div>
        `;
    } else {
        formFields.innerHTML = `
            <div class="form-group">
                <label class="form-label">Título</label>
                <input type="text" class="form-input" name="title" required>
            </div>
            <div class="form-group">
                <label class="form-label">Instituição</label>
                <input type="text" class="form-input" name="institution" required>
            </div>
            <div class="form-group">
                <label class="form-label">Descrição</label>
                <textarea class="form-textarea" name="description" required></textarea>
            </div>
            <div class="form-group">
                <label class="form-label">Ícone (classe Font Awesome)</label>
                <input type="text" class="form-input" name="icon" placeholder="fab fa-html5">
            </div>
            <div class="form-group">
                <label class="form-label">Habilidades (separadas por vírgula)</label>
                <input type="text" class="form-input" name="skills" placeholder="HTML5, CSS3, JavaScript">
            </div>
            <div class="form-group">
                <label class="form-label">Data</label>
                <input type="text" class="form-input" name="date" placeholder="2025">
            </div>
            <div class="form-group">
                <label class="form-label">Duração</label>
                <input type="text" class="form-input" name="duration" placeholder="40h">
            </div>
            <div class="form-group">
                <label class="form-label">Status</label>
                <select class="form-select" name="status">
                    <option value="verified">Verificado</option>
                    <option value="in-progress">Em Progresso</option>
                </select>
            </div>
            <div class="form-group">
                <label class="form-label">URL do Certificado</label>
                <input type="url" class="form-input" name="credentialUrl">
            </div>
            <div class="form-group">
                <label style="display: flex; align-items: center; gap: 0.5rem;">
                    <input type="checkbox" name="isActive" checked>
                    Certificação Ativa
                </label>
            </div>
        `;
    }
    
    modal.classList.add('active');
}

function closeModal() {
    const modal = document.getElementById('editModal');
    if (modal) {
        modal.classList.remove('active');
    }

    if (window.admin) {
        admin.editingItem = null;
        admin.editingType = null;
    }
}

function saveAllContent() {
    if (!window.admin || !admin.content) return;

    const content = admin.content;

    // Update from content editor
    if (admin.currentSection === 'content') {
        const heroTitle = document.getElementById('heroTitle');
        const heroSubtitle = document.getElementById('heroSubtitle');
        const heroDescription = document.getElementById('heroDescription');
        const aboutContent = document.getElementById('aboutContent');
        const contactEmail = document.getElementById('contactEmail');
        const contactPhone = document.getElementById('contactPhone');
        const contactLocation = document.getElementById('contactLocation');

        if (heroTitle) content.hero.title = heroTitle.value;
        if (heroSubtitle) content.hero.subtitle = heroSubtitle.value;
        if (heroDescription) content.hero.description = heroDescription.value;

        if (aboutContent) {
            const aboutContentValue = aboutContent.value;
            content.about.content = aboutContentValue.split('\n').filter(line => line.trim());
        }

        // Update contact info
        if (!content.contact.info) content.contact.info = [];

        if (contactEmail) {
            let emailField = content.contact.info.find(i => i.type === 'email');
            if (!emailField) {
                emailField = { type: 'email', icon: 'fas fa-envelope', label: 'Email' };
                content.contact.info.push(emailField);
            }
            emailField.value = contactEmail.value;
            emailField.link = `mailto:${contactEmail.value}`;
        }

        if (contactPhone) {
            let phoneField = content.contact.info.find(i => i.type === 'phone');
            if (!phoneField) {
                phoneField = { type: 'phone', icon: 'fas fa-phone', label: 'Telefone' };
                content.contact.info.push(phoneField);
            }
            phoneField.value = contactPhone.value;
            phoneField.link = `tel:${contactPhone.value.replace(/\D/g, '')}`;
        }

        if (contactLocation) {
            let locationField = content.contact.info.find(i => i.type === 'location');
            if (!locationField) {
                locationField = { type: 'location', icon: 'fas fa-map-marker-alt', label: 'Localização' };
                content.contact.info.push(locationField);
            }
            locationField.value = contactLocation.value;
        }
    }

    // Update from settings
    if (admin.currentSection === 'settings') {
        const siteTitle = document.getElementById('siteTitle');
        const siteDescription = document.getElementById('siteDescription');
        const themeColor = document.getElementById('themeColor');
        const animationsEnabled = document.getElementById('animationsEnabled');
        const lazyLoadImages = document.getElementById('lazyLoadImages');
        const showBackToTop = document.getElementById('showBackToTop');

        if (siteTitle) content.site.title = siteTitle.value;
        if (siteDescription) content.site.description = siteDescription.value;
        if (themeColor) content.site.themeColor = themeColor.value;

        if (!content.settings) content.settings = {};
        if (animationsEnabled) content.settings.animationsEnabled = animationsEnabled.checked;
        if (lazyLoadImages) content.settings.lazyLoadImages = lazyLoadImages.checked;
        if (showBackToTop) content.settings.showBackToTop = showBackToTop.checked;
    }

    // Salva automaticamente no localStorage
    admin.saveToLocalStorage();
    showNotification('Conteúdo salvo automaticamente!', 'success');
}

function exportContent() {
    if (!window.admin) return;
    admin.downloadBackup();
}

function importContent() {
    if (!window.admin) return;
    admin.uploadBackup();
}

function showNotification(message, type = 'info') {
    // Remove notificações existentes
    document.querySelectorAll('.admin-notification').forEach(n => n.remove());

    const notification = document.createElement('div');
    notification.className = `admin-notification notification-${type}`;

    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-exclamation-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };

    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };

    notification.innerHTML = `
        <div style="display: flex; align-items: center; gap: 0.8rem;">
            <i class="${icons[type]}" style="font-size: 1.2rem;"></i>
            <span>${message}</span>
            <button onclick="this.parentElement.parentElement.remove()" 
                    style="background: none; border: none; color: inherit; cursor: pointer; margin-left: auto;">
                <i class="fas fa-times"></i>
            </button>
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
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)',
        zIndex: '9999',
        maxWidth: '400px',
        opacity: '0',
        transform: 'translateX(100%)',
        transition: 'all 0.3s ease',
        fontSize: '0.9rem',
        fontWeight: '500'
    });

    document.body.appendChild(notification);

    // Animate in
    requestAnimationFrame(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    });

    // Auto remove
    setTimeout(() => {
        if (document.contains(notification)) {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Admin instance
const admin = new PortfolioCMSAdmin();
window.admin = admin;

// Auto-save quando há mudanças
function setupAutoSave() {
    // Salva automaticamente a cada 30 segundos se houver mudanças
    setInterval(() => {
        if (admin.content) {
            admin.saveToLocalStorage();
        }
    }, 30000);

    // Salva antes de sair da página
    window.addEventListener('beforeunload', () => {
        if (admin.content) {
            admin.saveToLocalStorage();
        }
    });
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        admin.init();
        setupAutoSave();
    });
} else {
    admin.init();
    setupAutoSave();
}