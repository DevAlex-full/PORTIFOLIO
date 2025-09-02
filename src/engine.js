/* ==========================================================================
   Main Styles - css/main.css
   ========================================================================== */

:root {
    --primary-color: #8b5cf6;
    --secondary-color: #a855f7;
    --accent-color: #c084fc;
    --dark-bg: #0a0a0a;
    --dark-surface: #1a1a1a;
    --dark-surface-light: #2a2a2a;
    --text-primary: #ffffff;
    --text-secondary: #d1d5db;
    --text-muted: #9ca3af;
    --gradient-primary: linear-gradient(135deg, #8b5cf6 0%, #a855f7 100%);
    --gradient-secondary: linear-gradient(135deg, #a855f7 0%, #c084fc 100%);
    --shadow-sm: 0 1px 2px 0 rgba(139, 92, 246, 0.05);
    --shadow-md: 0 4px 6px -1px rgba(139, 92, 246, 0.1);
    --shadow-lg: 0 10px 15px -3px rgba(139, 92, 246, 0.1);
    --shadow-xl: 0 20px 25px -5px rgba(139, 92, 246, 0.1);
    --border-radius: 0.8rem;
    --transition: all 0.3s ease;
}

/* ==========================================================================
   Base Components
   ========================================================================== */

.container {
    max-width: 1200px;
    0 auto;
    padding: 0 2rem;
}

.btn {
    display: inline-block;
    padding: 1.2rem 2.4rem;
    font-size: 1.4rem;
    font-weight: 600;
    text-align: center;
    border-radius: var(--border-radius);
    transition: var(--transition);
    cursor: pointer;
    border: 2px solid transparent;
}

.btn-primary {
    background: var(--gradient-primary);
    color: white;
    box-shadow: var(--shadow-md);
}

.btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: var(--shadow-xl);
}

.btn-secondary {
    background: transparent;
    color: var(--primary-color);
    border-color: var(--primary-color);
}

.btn-secondary:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-2px);
}

.section-header {
    text-align: center;
    margin-bottom: 6rem;
}

.section-title {
    font-size: 3.6rem;
    font-weight: 700;
    margin-bottom: 1.6rem;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.section-subtitle {
    font-size: 1.8rem;
    color: var(--text-secondary);
    max-width: 600px;
    margin: 0 auto;
}

/* ==========================================================================
   Header & Navigation
   ========================================================================== */

.header {
    position: fixed;
    top: 0;
    width: 100%;
    background: rgba(10, 10, 26, 0.95);
    backdrop-filter: blur(10px);
    border-bottom: 1px solid rgba(139, 92, 246, 0.1);
    z-index: 1000;
    transition: var(--transition);
}

.nav-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
    height: 7rem;
}

.nav-logo h2 {
    font-size: 2.4rem;
    font-weight: 700;
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.nav-menu {
    display: flex;
    gap: 3rem;
}

.nav-link {
    font-size: 1.6rem;
    font-weight: 500;
    color: var(--text-secondary);
    transition: var(--transition);
    position: relative;
}

.nav-link:hover,
.nav-link.active {
    color: var(--primary-color);
}

.nav-link::after {
    content: '';
    position: absolute;
    width: 0;
    height: 2px;
    bottom: -5px;
    left: 0;
    background: var(--gradient-primary);
    transition: var(--transition);
}

.nav-link:hover::after,
.nav-link.active::after {
    width: 100%;
}

.hamburger {
    display: none;
    flex-direction: column;
    cursor: pointer;
}

.bar {
    width: 25px;
    height: 3px;
    background: var(--primary-color);
    margin: 3px 0;
    transition: var(--transition);
}

/* ==========================================================================
   Hero Section
   ========================================================================== */

.hero {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    background: radial-gradient(ellipse at center, rgba(139, 92, 246, 0.1) 0%, transparent 70%);
}

.hero-container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 2rem;
}

.hero-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: center;
}

.hero-title {
    font-size: 4.8rem;
    font-weight: 700;
    line-height: 1.2;
    margin-bottom: 2rem;
}

.highlight {
    background: var(--gradient-primary);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
}

.hero-subtitle {
    font-size: 2.4rem;
    font-weight: 600;
    color: var(--primary-color);
    margin-bottom: 1.6rem;
}

.hero-description {
    font-size: 1.8rem;
    color: var(--text-secondary);
    margin-bottom: 3.2rem;
    line-height: 1.6;
}

.hero-buttons {
    display: flex;
    gap: 2rem;
}

.hero-image {
    display: flex;
    justify-content: center;
    align-items: center;
}

.profile-card {
    background: var(--dark-surface);
    border-radius: 2rem;
    padding: 4rem;
    box-shadow: var(--shadow-xl);
    border: 1px solid rgba(139, 92, 246, 0.2);
    position: relative;
    overflow: hidden;
}

.profile-card::before {
    content: '';
    position: absolute;
    top: -50%;
    left: -50%;
    width: 200%;
    height: 200%;
    background: conic-gradient(from 0deg, transparent, var(--primary-color), transparent);
    animation: rotate 4s linear infinite;
    z-index: -1;
}

.profile-card::after {
    content: '';
    position: absolute;
    inset: 2px;
    background: var(--dark-surface);
    border-radius: inherit;
    z-index: -1;
}

.profile-img {
    width: 200px;
    height: 200px;
    border-radius: 50%;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 6rem;
    color: white;
}

.scroll-indicator {
    position: absolute;
    bottom: 3rem;
    left: 50%;
    transform: translateX(-50%);
    color: var(--primary-color);
    font-size: 2rem;
    animation: bounce 2s infinite;
}

@keyframes rotate {
    to {
        transform: rotate(360deg);
    }
}

@keyframes bounce {
    0%, 20%, 53%, 80%, 100% {
        transform: translateX(-50%) translateY(0);
    }
    40%, 43% {
        transform: translateX(-50%) translateY(-10px);
    }
    70% {
        transform: translateX(-50%) translateY(-5px);
    }
    90% {
        transform: translateX(-50%) translateY(-2px);
    }
}

/* ==========================================================================
   About Section
   ========================================================================== */

.about {
    padding: 10rem 0;
    background: var(--dark-surface);
}

.about-content {
    max-width: 800px;
    margin: 0 auto;
    text-align: center;
}

.about-text p {
    font-size: 1.8rem;
    color: var(--text-secondary);
    margin-bottom: 2.4rem;
    line-height: 1.8;
}

.skills {
    margin-top: 4rem;
}

.skills h3 {
    font-size: 2.4rem;
    margin-bottom: 3rem;
    color: var(--text-primary);
}

.skills-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
    gap: 2rem;
    margin-top: 3rem;
}

.skill-item {
    background: var(--dark-bg);
    padding: 2.4rem;
    border-radius: var(--border-radius);
    border: 1px solid rgba(139, 92, 246, 0.2);
    transition: var(--transition);
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 1.2rem;
}

.skill-item:hover {
    transform: translateY(-5px);
    border-color: var(--primary-color);
    box-shadow: var(--shadow-lg);
}

.skill-item i {
    font-size: 3rem;
    color: var(--primary-color);
}

.skill-item span {
    font-size: 1.4rem;
    font-weight: 600;
    color: var(--text-secondary);
}

/* ==========================================================================
   Projects Section
   ========================================================================== */

.projects {
    padding: 10rem 0;
    background: var(--dark-bg);
}

.projects-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
    gap: 3rem;
}

.project-card {
    background: var(--dark-surface);
    border-radius: var(--border-radius);
    overflow: hidden;
    border: 1px solid rgba(139, 92, 246, 0.2);
    transition: var(--transition);
    position: relative;
}

.project-card:hover {
    transform: translateY(-10px);
    box-shadow: var(--shadow-xl);
    border-color: var(--primary-color);
}

.project-image {
    height: 200px;
    background: var(--gradient-primary);
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 4rem;
    color: white;
}

.project-content {
    padding: 2.4rem;
}

.project-title {
    font-size: 2rem;
    font-weight: 700;
    margin-bottom: 1.2rem;
    color: var(--text-primary);
}

.project-description {
    font-size: 1.4rem;
    color: var(--text-secondary);
    margin-bottom: 2rem;
    line-height: 1.6;
}

.project-tags {
    display: flex;
    gap: 0.8rem;
    margin-bottom: 2rem;
    flex-wrap: wrap;
}

.tag {
    background: rgba(139, 92, 246, 0.2);
    color: var(--primary-color);
    padding: 0.4rem 1rem;
    border-radius: 2rem;
    font-size: 1.2rem;
    font-weight: 500;
}

.project-links {
    display: flex;
    gap: 1.6rem;
}

.project-link {
    display: flex;
    align-items: center;
    gap: 0.8rem;
    color: var(--primary-color);
    font-size: 1.4rem;
    font-weight: 500;
    transition: var(--transition);
}

.project-link:hover {
    color: var(--accent-color);
}

/* ==========================================================================
   Contact Section
   ========================================================================== */

.contact {
    padding: 10rem 0;
    background: var(--dark-surface);
}

.contact-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 6rem;
    align-items: start;
}

.contact-info h3 {
    font-size: 2.4rem;
    margin-bottom: 1.6rem;
    color: var(--text-primary);
}

.contact-info p {
    font-size: 1.6rem;
    color: var(--text-secondary);
    margin-bottom: 3rem;
    line-height: 1.6;
}

.contact-items {
    margin-bottom: 3rem;
}

.contact-item {
    display: flex;
    align-items: center;
    gap: 1.6rem;
    margin-bottom: 2rem;
}

.contact-item i {
    font-size: 2rem;
    color: var(--primary-color);
    width: 24px;
}

.contact-item div {
    display: flex;
    flex-direction: column;
}

.contact-item span:first-child {
    font-size: 1.4rem;
    color: var(--text-muted);
    font-weight: 600;
}

.contact-item span:last-child,
.contact-item a {
    font-size: 1.6rem;
    color: var(--text-secondary);
    margin-top: 0.4rem;
}

.contact-item a:hover {
    color: var(--primary-color);
}

.social-links {
    display: flex;
    gap: 1.6rem;
}

.social-link {
    width: 4.8rem;
    height: 4.8rem;
    background: var(--dark-bg);
    border: 1px solid rgba(139, 92, 246, 0.2);
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    color: var(--primary-color);
    transition: var(--transition);
}

.social-link:hover {
    background: var(--primary-color);
    color: white;
    transform: translateY(-3px);
}

.contact-form {
    background: var(--dark-bg);
    padding: 2rem;
}