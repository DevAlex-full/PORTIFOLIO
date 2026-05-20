import type { Project } from '@/types'

export const projects: Project[] = [
  // ─── DESTAQUES PRINCIPAIS ───────────────────────────────────────────────────
  {
    id: 'barberflow',
    title: 'BarberFlow',
    description:
      'SaaS completo para gestão de barbearias. Plataforma multi-tenant com agendamento, gestão financeira, controle de estoque, comissões e app mobile. Arquitetura real de produção com autenticação JWT, multi-tenancy e dashboard analítico.',
    image: '/imagens/barberflow1.png',
    images: [
      { src: '/imagens/barberflow1.png', alt: 'BarberFlow - Dashboard' },
      { src: '/imagens/barberflow2.png', alt: 'BarberFlow - Gestão' },
      { src: '/imagens/barberflow3.png', alt: 'BarberFlow - Mobile' },
    ],
    tags: ['Next.js', 'TypeScript', 'Node.js', 'Express', 'Prisma ORM', 'PostgreSQL', 'Supabase', 'React Native'],
    categories: ['web', 'commercial'],
    featured: true,
    highlight: 'SaaS • Multi-tenant',
    links: {
      demo: 'https://barberflowoficial.vercel.app/',
      githubFrontend: 'https://github.com/DevAlex-full/barbeflow-frontend',
      githubBackend: 'https://github.com/DevAlex-full/BarberFlow-Back-End',
    },
  },
  {
    id: 'taskflow',
    title: 'TaskFlow',
    description:
      'Aplicação full-stack de gerenciamento de tarefas com autenticação segura, dashboard analítico e sincronização em tempo real. Back-end próprio com Node.js, Express e PostgreSQL via Supabase.',
    image: '/imagens/tarefa-dashboard.jpeg',
    images: [
      { src: '/imagens/tarefa-dashboard.jpeg', alt: 'TaskFlow - Dashboard' },
      { src: '/imagens/tarefa-minhas-tarefas.jpeg', alt: 'TaskFlow - Tarefas' },
      { src: '/imagens/tarefa-analytics.jpeg', alt: 'TaskFlow - Analytics' },
    ],
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Node.js', 'Express', 'PostgreSQL', 'Supabase'],
    categories: ['web', 'commercial'],
    featured: true,
    highlight: 'Full Stack',
    links: {
      demo: '',
      github: '',
    },
  },
  {
    id: 'instalock-valorant',
    title: 'InstalockValorant',
    description:
      'Aplicação desktop para Windows que seleciona e trava automaticamente agentes no Valorant via API local oficial do Riot Client. Configuração por mapa, hotkey global, UI dark theme e executável standalone — sem precisar de Python instalado.',
    image: '/imagens/painel.png',
    images: [
      { src: '/imagens/painel.png', alt: 'instalockvalorant - painel' },
      { src: '/imagens/print-landing-page.png', alt: 'instalockvalorant - landing-page' },
    ],
    tags: ['Python', 'CustomTkinter', 'PyInstaller', 'Valorant API', 'pynput', 'Windows .exe'],
    categories: ['web', 'interactive'],
    featured: true,
    highlight: 'Desktop • .exe',
    links: {
      demo: 'https://instalockvalorant.vercel.app',
      github: 'https://github.com/DevAlex-full/InstalockValorant',
    },
  },

  // ─── PROJETOS COMERCIAIS ────────────────────────────────────────────────────
  {
    id: 'advocacia-pro',
    title: 'Advocacia Pro',
    description:
      'Landing page profissional para escritório de advocacia, desenvolvida em WordPress com tema customizado do zero. Design focado em conversão, SEO otimizado e formulário de captação de leads.',
    image: '/imagens/advogacia1.png',
    images: [
      { src: '/imagens/advogacia1.png', alt: 'Advocacia Pro - Hero' },
      { src: '/imagens/advogacia2.png', alt: 'Advocacia Pro - Serviços' },
      { src: '/imagens/advogacia3.png', alt: 'Advocacia Pro - Contato' },
    ],
    tags: ['WordPress', 'PHP', 'MySQL', 'HTML5', 'CSS3', 'JavaScript'],
    categories: ['landing', 'commercial'],
    featured: true,
    highlight: 'WordPress Custom',
    links: {
      demo: 'https://advocaciapro.rf.gd/',
      github: 'https://github.com/DevAlex-full/advocacia-landing-wordpress',
    },
  },
  {
    id: 'barberless',
    title: 'BarberLess',
    description:
      'Site institucional para barbearia com catálogo de serviços, perfil de profissionais e agendamento direto pelo WhatsApp. Responsivo e otimizado para conversão mobile.',
    image: '/imagens/barbearia.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'WhatsApp API'],
    categories: ['landing', 'commercial'],
    links: {
      demo: 'https://devalex-full.github.io/projeto-barbearia/',
      github: 'https://github.com/DevAlex-full/projeto-barbearia',
    },
  },
  {
    id: 'ong-protecao-animal',
    title: 'ONG Proteção Animal',
    description:
      'Site institucional responsivo para ONG de proteção animal com foco em adoção e conscientização. Páginas de galeria, formulário de adoção e integração com redes sociais.',
    image: '/imagens/ong.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsivo'],
    categories: ['landing', 'commercial'],
    links: {
      demo: 'https://devalex-full.github.io/Projeto-Front-End-ONG/',
      github: 'https://github.com/DevAlex-full/Projeto-Front-End-ONG',
    },
  },

  // ─── E-COMMERCE ─────────────────────────────────────────────────────────────
  {
    id: 'luxestore',
    title: 'LuxeStore',
    description:
      'E-commerce completo com React e TypeScript. Catálogo de produtos via API, carrinho de compras, filtros por categoria e UI responsiva construída com TailwindCSS.',
    image: '/imagens/loja de luxo.png',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'REST API'],
    categories: ['web', 'commercial'],
    links: {
      demo: 'https://luxestore-premium.netlify.app/',
      github: 'https://github.com/DevAlex-full/Exerc-cio---Buscar-dados-de-uma-API',
    },
  },
  {
    id: 'lojatech',
    title: 'LojaTech E-commerce',
    description:
      'E-commerce de produtos tecnológicos com interface limpa, carrinho de compras e fluxo de checkout. Layout responsivo com foco em experiência de compra.',
    image: '/imagens/loja-virtual.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
    categories: ['web', 'commercial'],
    links: {
      demo: 'https://devalex-full.github.io/PROJETO-FRONT-END-WEB-VENDAS-CONCLUIDO/',
      github: 'https://github.com/DevAlex-full/PROJETO-FRONT-END-WEB-VENDAS-CONCLUIDO',
    },
  },

  // ─── INTERATIVOS / TÉCNICOS ─────────────────────────────────────────────────
  {
    id: 'cinematch',
    title: 'CineMatch',
    description:
      'Aplicação com IA para recomendação de filmes baseada no humor do usuário. Integração com N8N para orquestração dos fluxos de IA e chamadas a LLMs.',
    image: '/imagens/cineMatch.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'N8N', 'IA', 'LLM'],
    categories: ['web', 'interactive'],
    links: {
      demo: 'https://my-cinematch.netlify.app/',
      github: 'https://github.com/DevAlex-full/CineMatch',
    },
  },
  {
    id: 'mundo-invertido',
    title: 'Mundo Invertido',
    description:
      'Experiência web imersiva inspirada em Stranger Things, com alternância temática entre dois mundos, trilha sonora contextual e animações CSS avançadas.',
    image: '/imagens/mundo-invertido1.png',
    images: [
      { src: '/imagens/mundo-invertido1.png', alt: 'Mundo Normal' },
      { src: '/imagens/mundo-invertido2.png', alt: 'Mundo Invertido' },
      { src: '/imagens/mundo-invertido3.png', alt: 'Transição' },
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API', 'Animações'],
    categories: ['web', 'interactive'],
    links: {
      demo: 'https://devalex-full.github.io/semana-frontend-mundo-invertido/',
      github: 'https://github.com/DevAlex-full/semana-frontend-mundo-invertido',
    },
  },
  {
    id: 'pitadas-descobertas',
    title: 'Pitadas & Descobertas',
    description:
      'Catálogo de receitas com busca e filtros por categoria, consumindo a API TheMealDB. Ingredientes, instruções e modo preparo em interface responsiva.',
    image: '/imagens/receitas.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'REST API'],
    categories: ['web', 'interactive'],
    links: {
      demo: 'https://devalex-full.github.io/Suas-Receitas-Favoritas/',
      github: 'https://github.com/DevAlex-full/Suas-Receitas-Favoritas',
    },
  },
]

export const featuredProjects = projects.filter((p) => p.featured)

export const filterLabels: Record<string, string> = {
  all: 'Todos',
  web: 'Web Apps',
  landing: 'Landing Pages',
  interactive: 'Interativos',
  commercial: 'Comerciais',
  client: 'Vitrine de Clientes',
}