/**
 * Services - Integração com serviços externos
 * Sistema compatível com persistência local
 */

class PortfolioServices {
    constructor() {
        this.config = null;
        this.emailService = null;
        this.analytics = null;
        this.cache = new Map();
        this.storageKey = 'portfolio_cms_content';
    }

    /**
     * Inicializa os serviços
     */
    async init(config = null) {
        this.config = config || await this.loadConfig();
        
        if (this.config.email?.enabled) {
            await this.initEmailService();
        }
        
        if (this.config.analytics?.enabled) {
            this.initAnalytics();
        }
        
        this.bindFormEvents();
        this.injectStyles();
        console.log('🔧 Serviços inicializados com persistência local');
    }

    /**
     * Carrega configuração com suporte ao localStorage
     */
    async loadConfig() {
        try {
            // Primeiro tenta carregar configuração personalizada do localStorage
            const localContent = this.loadLocalContent();
            if (localContent?.services) {
                console.log('📦 Configuração de serviços do localStorage');
                return { ...this.getDefaultConfig(), ...localContent.services };
            }

            // Tenta carregar do arquivo de configuração
            const response = await fetch('./src/data/services-config.json');
            if (response.ok) {
                const serverConfig = await response.json();
                return serverConfig;
            }
            
            throw new Error('Arquivo de configuração não encontrado');
        } catch (error) {
            console.warn('Config não encontrada, usando padrão:', error.message);
            return this.getDefaultConfig();
        }
    }

    /**
     * Carrega conteúdo do localStorage
     */
    loadLocalContent() {
        try {
            const stored = localStorage.getItem(this.storageKey);
            if (!stored) return null;
            
            const data = JSON.parse(stored);
            return data.content;
        } catch (error) {
            return null;
        }
    }

    /**
     * Configuração padrão dos serviços
     */
    getDefaultConfig() {
        return {
            email: {
                enabled: true,
                provider: 'emailjs',
                serviceId: 'service_d6r94y9',
                templateId: 'template_5d22ssi',
                publicKey: '4UjTKqTMYtiAldXj0',
                fallbackEmail: 'alex.bueno22@hotmail.com'
            },
            analytics: {
                enabled: false,
                provider: 'gtag',
                trackingId: 'G-XXXXXXXXXX'
            },
            notifications: {
                enabled: true,
                position: 'top-right',
                autoClose: 5000
            },
            validation: {
                email: true,
                phone: true,
                honeypot: true
            }
        };
    }

    /**
     * Inicializa serviço de email
     */
    async initEmailService() {
        const { provider, serviceId, templateId, publicKey } = this.config.email;
        
        if (provider === 'emailjs') {
            await this.loadEmailJS();
            this.emailService = {
                send: (data) => this.sendWithEmailJS(data, serviceId, templateId),
                validate: (email) => this.validateEmail(email)
            };
        } else if (provider === 'formspree') {
            this.emailService = {
                send: (data) => this.sendWithFormspree(data),
                validate: (email) => this.validateEmail(email)
            };
        } else {
            // Fallback - mailto
            this.emailService = {
                send: (data) => this.sendWithMailto(data),
                validate: (email) => this.validateEmail(email)
            };
        }
    }

    /**
     * Carrega EmailJS dinamicamente
     */
    async loadEmailJS() {
        if (window.emailjs) return;
        
        return new Promise((resolve, reject) => {
            const script = document.createElement('script');
            script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js';
            script.onload = () => {
                emailjs.init(this.config.email.publicKey);
                resolve();
            };
            script.onerror = reject;
            document.head.appendChild(script);
        });
    }

    /**
     * Envia email via EmailJS
     */
    async sendWithEmailJS(data, serviceId, templateId) {
        if (!window.emailjs) throw new Error('EmailJS não carregado');
        
        const templateData = {
            from_name: data.name,
            from_email: data.email,
            subject: data.subject,
            message: data.message,
            to_email: this.config.email.fallbackEmail
        };

        try {
            const result = await emailjs.send(serviceId, templateId, templateData);
            return { success: true, result };
        } catch (error) {
            console.error('Erro EmailJS:', error);
            throw new Error('Falha no envio do email');
        }
    }

    /**
     * Envia email via Formspree
     */
    async sendWithFormspree(data) {
        const formspreeUrl = this.config.email.formspreeUrl;
        if (!formspreeUrl) throw new Error('URL Formspree não configurada');

        try {
            const response = await fetch(formspreeUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify(data)
            });

            if (!response.ok) throw new Error('Erro na resposta do servidor');
            
            return { success: true, response };
        } catch (error) {
            console.error('Erro Formspree:', error);
            throw new Error('Falha no envio do email');
        }
    }

    /**
     * Fallback - abre cliente de email
     */
    sendWithMailto(data) {
        const subject = encodeURIComponent(data.subject || 'Contato do Portfolio');
        const body = encodeURIComponent(
            `Nome: ${data.name}\nEmail: ${data.email}\n\nMensagem:\n${data.message}`
        );
        
        const mailtoUrl = `mailto:${this.config.email.fallbackEmail}?subject=${subject}&body=${body}`;
        
        window.location.href = mailtoUrl;
        return { success: true, method: 'mailto' };
    }

    /**
     * Valida email
     */
    validateEmail(email) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailRegex.test(email);
    }

    /**
     * Valida telefone brasileiro
     */
    validatePhone(phone) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        const cleanPhone = phone.replace(/\D/g, '');
        return cleanPhone.length >= 10 && phoneRegex.test(cleanPhone);
    }

    /**
     * Inicializa Google Analytics
     */
    initAnalytics() {
        const { provider, trackingId } = this.config.analytics;
        
        if (provider === 'gtag' && trackingId) {
            this.loadGoogleAnalytics(trackingId);
        }
    }

    /**
     * Carrega Google Analytics
     */
    loadGoogleAnalytics(trackingId) {
        const gtagScript = document.createElement('script');
        gtagScript.async = true;
        gtagScript.src = `https://www.googletagmanager.com/gtag/js?id=${trackingId}`;
        document.head.appendChild(gtagScript);

        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', trackingId, {
            anonymize_ip: true,
            cookie_flags: 'secure;samesite=strict'
        });

        this.analytics = {
            trackEvent: (action, category, label, value) => {
                gtag('event', action, {
                    event_category: category,
                    event_label: label,
                    value: value
                });
            },
            trackPageView: (page) => {
                gtag('config', trackingId, {
                    page_path: page
                });
            }
        };
    }

    /**
     * Bind eventos de formulário com suporte ao conteúdo dinâmico
     */
    bindFormEvents() {
        // Aguarda um pouco para que o CMS termine de renderizar
        setTimeout(() => {
            const contactForm = document.querySelector('.contact-form');
            if (!contactForm) return;

            // Remove listener anterior se existir
            const newForm = contactForm.cloneNode(true);
            contactForm.parentNode.replaceChild(newForm, contactForm);

            // Adiciona novo listener
            newForm.addEventListener('submit', (e) => this.handleFormSubmit(e));

            // Validação em tempo real
            this.addRealTimeValidation(newForm);

            // Honeypot para spam
            if (this.config?.validation?.honeypot) {
                this.addHoneypot(newForm);
            }
        }, 1000);
    }

    /**
     * Adiciona validação em tempo real
     */
    addRealTimeValidation(form) {
        const emailInput = form.querySelector('input[type="email"]');
        const phoneInputs = form.querySelectorAll('input[type="tel"]');

        if (emailInput) {
            emailInput.addEventListener('blur', (e) => {
                this.validateField(e.target, 'email');
            });
        }

        phoneInputs.forEach(input => {
            input.addEventListener('blur', (e) => {
                this.validateField(e.target, 'phone');
            });
        });
    }

    /**
     * Valida campo individual
     */
    validateField(field, type) {
        let isValid = true;
        let message = '';

        switch (type) {
            case 'email':
                isValid = this.validateEmail(field.value);
                message = isValid ? '' : 'Email inválido';
                break;
            case 'phone':
                isValid = this.validatePhone(field.value);
                message = isValid ? '' : 'Telefone inválido';
                break;
        }

        this.showFieldValidation(field, isValid, message);
        return isValid;
    }

    /**
     * Mostra validação de campo
     */
    showFieldValidation(field, isValid, message) {
        // Remove validação anterior
        const existingError = field.parentNode.querySelector('.field-error');
        if (existingError) existingError.remove();

        field.style.borderColor = isValid ? 'var(--border-color)' : '#ef4444';

        if (!isValid && message) {
            const errorDiv = document.createElement('div');
            errorDiv.className = 'field-error';
            errorDiv.textContent = message;
            errorDiv.style.cssText = `
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 0.4rem;
                opacity: 0;
                transform: translateY(-10px);
                transition: all 0.3s ease;
            `;

            field.parentNode.appendChild(errorDiv);
            
            requestAnimationFrame(() => {
                errorDiv.style.opacity = '1';
                errorDiv.style.transform = 'translateY(0)';
            });
        }
    }

    /**
     * Adiciona honeypot anti-spam
     */
    addHoneypot(form) {
        const honeypot = document.createElement('input');
        honeypot.type = 'text';
        honeypot.name = 'website';
        honeypot.style.cssText = 'position: absolute; left: -9999px; opacity: 0; pointer-events: none;';
        honeypot.tabIndex = -1;
        honeypot.autocomplete = 'off';
        
        form.appendChild(honeypot);
    }

    /**
     * Manipula envio do formulário
     */
    async handleFormSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('button[type="submit"]');
        const formData = new FormData(form);
        
        // Verificação honeypot
        if (formData.get('website')) {
            console.warn('Spam detectado via honeypot');
            return;
        }

        // Preparar dados
        const data = {
            name: formData.get('name')?.trim(),
            email: formData.get('email')?.trim(),
            subject: formData.get('subject')?.trim(),
            message: formData.get('message')?.trim(),
            timestamp: new Date().toISOString(),
            userAgent: navigator.userAgent,
            referrer: document.referrer
        };

        // Validar dados
        const validation = this.validateFormData(data);
        if (!validation.valid) {
            this.showNotification(validation.message, 'error');
            return;
        }

        // UI Loading state
        const originalText = submitBtn.textContent;
        submitBtn.innerHTML = '<span class="loading-spinner"></span> Enviando...';
        submitBtn.disabled = true;

        try {
            // Enviar email
            if (this.emailService?.send) {
                await this.emailService.send(data);
            } else {
                this.sendWithMailto(data);
            }
            
            // Analytics tracking
            if (this.analytics) {
                this.analytics.trackEvent('form_submit', 'contact', 'success');
            }

            // Sucesso
            this.showNotification(
                'Mensagem enviada com sucesso! Entrarei em contato em breve.',
                'success'
            );
            
            form.reset();
            this.clearFieldValidations(form);

        } catch (error) {
            console.error('Erro ao enviar formulário:', error);
            
            // Analytics tracking
            if (this.analytics) {
                this.analytics.trackEvent('form_submit', 'contact', 'error');
            }

            this.showNotification(
                'Erro ao enviar mensagem. Tente novamente ou entre em contato diretamente.',
                'error'
            );
        } finally {
            // Restore button
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
        }
    }

    /**
     * Valida dados do formulário
     */
    validateFormData(data) {
        const errors = [];

        if (!data.name || data.name.length < 2) {
            errors.push('Nome deve ter pelo menos 2 caracteres');
        }

        if (!data.email || !this.validateEmail(data.email)) {
            errors.push('Email inválido');
        }

        if (!data.subject || data.subject.length < 3) {
            errors.push('Assunto deve ter pelo menos 3 caracteres');
        }

        if (!data.message || data.message.length < 10) {
            errors.push('Mensagem deve ter pelo menos 10 caracteres');
        }

        // Rate limiting
        if (this.isRateLimited(data.email)) {
            errors.push('Muitas tentativas. Aguarde alguns minutos.');
        }

        return {
            valid: errors.length === 0,
            message: errors.join(', '),
            errors
        };
    }

    /**
     * Controle de rate limiting
     */
    isRateLimited(email) {
        const key = `rate_limit_${email}`;
        const now = Date.now();
        const attempts = this.cache.get(key) || [];
        
        // Remove tentativas antigas (mais de 1 hora)
        const recentAttempts = attempts.filter(time => now - time < 3600000);
        
        // Máximo 3 tentativas por hora
        if (recentAttempts.length >= 3) {
            return true;
        }
        
        // Adiciona tentativa atual
        recentAttempts.push(now);
        this.cache.set(key, recentAttempts);
        
        return false;
    }

    /**
     * Limpa validações de campos
     */
    clearFieldValidations(form) {
        form.querySelectorAll('.field-error').forEach(error => error.remove());
        form.querySelectorAll('input, textarea').forEach(field => {
            field.style.borderColor = 'var(--border-color)';
        });
    }

    /**
     * Mostra notificação
     */
    showNotification(message, type = 'info') {
        // Remove notificações existentes
        document.querySelectorAll('.service-notification').forEach(n => n.remove());

        const notification = document.createElement('div');
        notification.className = `service-notification notification-${type}`;
        
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

        // Position
        const position = this.config?.notifications?.position || 'top-right';
        const [vertical, horizontal] = position.split('-');

        Object.assign(notification.style, {
            position: 'fixed',
            [vertical]: '20px',
            [horizontal]: '20px',
            background: colors[type],
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '8px',
            boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.2)',
            zIndex: '9999',
            maxWidth: '400px',
            opacity: '0',
            transform: horizontal === 'right' ? 'translateX(100%)' : 'translateX(-100%)',
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
        const autoClose = this.config?.notifications?.autoClose || 5000;
        if (autoClose > 0) {
            setTimeout(() => {
                if (document.contains(notification)) {
                    notification.style.opacity = '0';
                    notification.style.transform = horizontal === 'right' ? 'translateX(100%)' : 'translateX(-100%)';
                    setTimeout(() => notification.remove(), 300);
                }
            }, autoClose);
        }
    }

    /**
     * Tracking de eventos customizados
     */
    trackEvent(action, category = 'engagement', label = null, value = null) {
        if (this.analytics) {
            this.analytics.trackEvent(action, category, label, value);
        }
    }

    /**
     * Re-inicializa formulários quando há mudanças no CMS
     */
    reinitializeForms() {
        this.bindFormEvents();
        console.log('🔄 Formulários re-inicializados após mudança de conteúdo');
    }

    /**
     * API pública para desenvolvedores
     */
    getAPI() {
        return {
            // Email
            sendEmail: (data) => this.emailService?.send(data),
            validateEmail: (email) => this.validateEmail(email),
            
            // Analytics  
            trackEvent: (action, category, label, value) => this.trackEvent(action, category, label, value),
            
            // Notifications
            showNotification: (message, type) => this.showNotification(message, type),
            
            // Validation
            validatePhone: (phone) => this.validatePhone(phone),
            
            // Config
            getConfig: () => ({ ...this.config }),
            updateConfig: (newConfig) => {
                this.config = { ...this.config, ...newConfig };
                this.bindFormEvents();
            },
            
            // Forms
            reinitializeForms: () => this.reinitializeForms()
        };
    }

    /**
     * Adiciona CSS para componentes
     */
    injectStyles() {
        if (document.querySelector('#portfolio-services-styles')) return;

        const styles = document.createElement('style');
        styles.id = 'portfolio-services-styles';
        styles.textContent = `
            .loading-spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid transparent;
                border-top: 2px solid currentColor;
                border-radius: 50%;
                animation: spin 1s linear infinite;
                margin-right: 0.5rem;
            }

            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
            }

            .field-error {
                color: #ef4444;
                font-size: 0.8rem;
                margin-top: 0.4rem;
            }

            .service-notification {
                box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.2);
            }

            @media (max-width: 768px) {
                .service-notification {
                    left: 10px !important;
                    right: 10px !important;
                    max-width: calc(100vw - 20px);
                }
            }
        `;

        document.head.appendChild(styles);
    }
}

// Initialize services
window.portfolioServices = new PortfolioServices();

// Auto-initialization when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.portfolioServices.init();
    });
} else {
    window.portfolioServices.init();
}