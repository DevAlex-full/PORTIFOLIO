/**
 * Admin Panel JavaScript
 * Sistema de administração para o Portfolio CMS
 */

class PortfolioCMSAdmin {
    constructor() {
        this.content = null;
        this.currentSection = 'dashboard';
        this.editingItem = null;
        this.editingType = null;
    }

    async init() {
        await this.loadContent();
        this.bindEvents();
        this.renderDashboard();
        console.log('🔧 Admin CMS inicializado');
    }

    async loadContent() {
        try {
            const response = await fetch('./src/data/content.json');
            this.content = await response.json();
        } catch (error) {
            console.error('Erro ao carregar conteúdo:', error);
            this.content = this.getDefaultContent();
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
        document.getElementById('editForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveItem();
        });

        // Refresh data
        document.getElementById('refreshData').addEventListener('click', () => {
            this.loadContent().then(() => this.renderCurrentSection());
        });
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

        document.getElementById('projectsCount').textContent = projects.length;
        document.getElementById('certificationsCount').textContent = certifications.length;
        document.getElementById('skillsCount').textContent = skills.length;
        document.getElementById('lastUpdate').textContent = new Date().toLocaleDateString('pt-BR');
    }

    renderProjectsList() {
        const container = document.getElementById('projectsList');
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
                    ${project.description?.substring(0, 100)}...
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
                    ${cert.description?.substring(0, 100)}...
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
        
        document.getElementById('modalTitle').textContent = `Editar ${type === 'project' ? 'Projeto' : 'Certificação'}`;
    }

    deleteItem(section, id) {
        if (confirm('Tem certeza que deseja excluir este item?')) {
            const items = this.content[section]?.items;
            if (items) {
                const index = items.findIndex(item => item.id === id);
                if (index !== -1) {
                    items.splice(index, 1);
                    this.renderCurrentSection();
                    showNotification('Item excluído com sucesso!', 'success');
                }
            }
        }
    }

    saveItem() {
        const form = document.getElementById('editForm');
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
        
        this.renderCurrentSection();
        closeModal();
        showNotification(`${this.editingType === 'project' ? 'Projeto' : 'Certificação'} salvo com sucesso!`, 'success');
    }
}

// Global functions
function showAddModal(type) {
    admin.editingType = type;
    admin.editingItem = null;
    
    const modal = document.getElementById('editModal');
    const title = document.getElementById('modalTitle');
    const formFields = document.getElementById('formFields');
    
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
    document.getElementById('editModal').classList.remove('active');
    admin.editingItem = null;
    admin.editingType = null;
}

function saveAllContent() {
    const content = admin.content;
    
    // Update from content editor
    if (admin.currentSection === 'content') {
        content.hero.title = document.getElementById('heroTitle').value;
        content.hero.subtitle = document.getElementById('heroSubtitle').value;
        content.hero.description = document.getElementById('heroDescription').value;
        
        const aboutContent = document.getElementById('aboutContent').value;
        content.about.content = aboutContent.split('\n').filter(line => line.trim());
        
        // Update contact info
        const emailField = content.contact.info.find(i => i.type === 'email');
        if (emailField) emailField.value = document.getElementById('contactEmail').value;
        
        const phoneField = content.contact.info.find(i => i.type === 'phone');
        if (phoneField) phoneField.value = document.getElementById('contactPhone').value;
        
        const locationField = content.contact.info.find(i => i.type === 'location');
        if (locationField) locationField.value = document.getElementById('contactLocation').value;
    }
    
    // Save to JSON (simulated)
    downloadJSON(content, 'content.json');
    showNotification('Conteúdo salvo! Baixe o arquivo e substitua o content.json', 'success');
}

function exportContent() {
    downloadJSON(admin.content, 'portfolio-backup.json');
    showNotification('Backup exportado com sucesso!', 'success');
}

function importContent() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    
    input.onchange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        
        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                admin.content = JSON.parse(e.target.result);
                admin.renderCurrentSection();
                showNotification('Conteúdo importado com sucesso!', 'success');
            } catch (error) {
                showNotification('Erro ao importar arquivo!', 'error');
            }
        };
        reader.readAsText(file);
    };
    
    input.click();
}

function downloadJSON(data, filename) {
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    const colors = {
        success: '#10b981',
        error: '#ef4444',
        warning: '#f59e0b',
        info: '#6366f1'
    };
    
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${colors[type]};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.3);
        z-index: 9999;
        transform: translateX(100%);
        transition: transform 0.3s ease;
    `;
    
    notification.textContent = message;
    document.body.appendChild(notification);
    
    requestAnimationFrame(() => {
        notification.style.transform = 'translateX(0)';
    });
    
    setTimeout(() => {
        notification.style.transform = 'translateX(100%)';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Admin instance
const admin = new PortfolioCMSAdmin();

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => admin.init());
} else {
    admin.init();
}