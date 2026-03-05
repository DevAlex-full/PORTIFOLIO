import type { Project } from '@/types'

export const projects: Project[] = [

  {
    id: 'taskflow',
    title: 'TaskFlow',
    description:
      'Aplicação full-stack moderna de gerenciamento de tarefas desenvolvida com as tecnologias mais atuais do mercado. O sistema oferece uma experiência completa para organização pessoal e profissional, com interface intuitiva, autenticação segura e sincronização em tempo real.',
    image: '/imagens/tarefa-dashboard.jpeg',
    images: [
      { src: '/imagens/tarefa-dashboard.jpeg', alt: 'TaskFlow - Dashboard' },
      { src: '/imagens/tarefa-minhas-tarefas.jpeg', alt: 'TaskFlow - Minhas Tarefas' },
      { src: '/imagens/tarefa-analytics.jpeg', alt: 'TaskFlow - Analytics' },
    ],
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Lucide React', 'Node.js', 'Express', 'PostgreSQL', 'Supabase'],
    categories: ['web', 'interactive', 'personal'],
    featured: true,
    highlight: 'Full Stack',
    links: {
      demo: 'https://taskflowoficial.vercel.app/',
      githubFrontend: 'https://github.com/DevAlex-full/Todo-List-Pro',
      githubBackend: 'https://github.com/DevAlex-full/Todo-List-Pro-Back-end',
    },
  },

  {
    id: 'barberflow',
    title: 'BarberFlow',
    description:
      'SaaS completo para modernizar e otimizar a gestão de barbearias. Plataforma integrada que conecta proprietários, barbeiros e clientes, com agendamento de serviços, gestão financeira e operacional.',
    image: '/imagens/barberflow1.png',
    images: [
      { src: '/imagens/barberflow1.png', alt: 'BarberFlow - Tela 1' },
      { src: '/imagens/barberflow2.png', alt: 'BarberFlow - Tela 2' },
      { src: '/imagens/barberflow3.png', alt: 'BarberFlow - Tela 3' },
    ],
    tags: ['React', 'Next.js', 'TypeScript', 'Tailwind CSS', 'Node.js', 'Express', 'Prisma ORM', 'Context API'],
    categories: ['web', 'commercial', 'personal'],
    featured: true,
    highlight: 'SaaS • Full Stack',
    links: {
      demo: 'https://barberflowoficial.vercel.app/',
      githubFrontend: 'https://github.com/DevAlex-full/barbeflow-frontend',
      githubBackend: 'https://github.com/DevAlex-full/BarberFlow-Back-End',
    },
  },

  {
    id: 'advocacia-pro',
    title: 'Advocacia Pro',
    description:
      'Landing page profissional para escritórios de advocacia e consultoria empresarial, desenvolvida em WordPress com tema customizado do zero.',
    image: '/imagens/advogacia1.png',
    images: [
      { src: '/imagens/advogacia1.png', alt: 'Advocacia Pro - Tela 1' },
      { src: '/imagens/advogacia2.png', alt: 'Advocacia Pro - Tela 2' },
      { src: '/imagens/advogacia3.png', alt: 'Advocacia Pro - Tela 3' },
    ],
    tags: ['MySQL', 'PHP', 'WordPress', 'HTML5', 'CSS3', 'JavaScript'],
    categories: ['landing', 'commercial', 'personal'],
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
      'Aplicação web moderna para a barbearia Barber Less, com interface intuitiva para visualização de serviços, profissionais e agendamentos via WhatsApp.',
    image: '/imagens/barbearia.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'WhatsApp API'],
    categories: ['landing', 'commercial', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/projeto-barbearia/',
      github: 'https://github.com/DevAlex-full/projeto-barbearia',
    },
  },
  
  {
    id: 'portfolio',
    title: 'Portfólio Pessoal',
    description:
      'Meu portfólio pessoal desenvolvido com foco em performance, acessibilidade e design moderno. Apresenta meus projetos, habilidades e certificações de forma interativa.',
    image: '/imagens/portifolio.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsivo', 'Dark Mode'],
    categories: ['web', 'landing', 'personal'],
    links: {
      demo: 'https://portifoliodevalex.netlify.app/',
      github: 'https://github.com/DevAlex-full/PORTIFOLIO',
    },
  },
  
  {
    id: 'pitadas-descobertas',
    title: 'Pitadas & Descobertas',
    description:
      'Catálogo completo de receitas culinárias com busca e filtro por categorias, utilizando a API TheMealDB para receitas internacionais com ingredientes e instruções.',
    image: '/imagens/receitas.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'TheMealDB API'],
    categories: ['web', 'interactive', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/Suas-Receitas-Favoritas/',
      github: 'https://github.com/DevAlex-full/Suas-Receitas-Favoritas',
    },
  },
  
  {
    id: 'gerador-cores',
    title: 'Gerador de Paletas de Cores',
    description:
      'Aplicação moderna e intuitiva para gerar paletas de cores harmoniosas baseadas na teoria das cores.',
    image: '/imagens/gerador de cores.png',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    categories: ['web', 'interactive', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/Gerador-de-Paletas-de-Cores/',
      github: 'https://github.com/DevAlex-full/Gerador-de-Paletas-de-Cores',
    },
  },
  
  {
    id: 'conversor-moedas',
    title: 'Conversor de Moedas',
    description:
      'Aplicação web para conversão de moedas em tempo real, com suporte a múltiplas APIs de câmbio.',
    image: '/imagens/conversor de moedas (1).png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'ExchangeRate-API'],
    categories: ['web', 'interactive', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/Conversor-de-Moedas/',
      github: 'https://github.com/DevAlex-full/Conversor-de-Moedas',
    },
  },
  
  {
    id: 'gerador-senhas',
    title: 'Gerador de Senhas',
    description:
      'Gerador de senhas seguras com alta entropia, configurações personalizáveis e indicador de força.',
    image: '/imagens/gerador de senha.png',
    tags: ['HTML5', 'CSS3', 'JavaScript'],
    categories: ['web', 'interactive', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/GERADOR-DE-SENHAS/',
      github: 'https://github.com/DevAlex-full/GERADOR-DE-SENHAS',
    },
  },
  
  {
    id: 'ong-protecao-animal',
    title: 'ONG Proteção Animal',
    description:
      'Site responsivo para ONG de proteção animal focado na promoção de adoção responsável e conscientização sobre bem-estar animal.',
    image: '/imagens/ong.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'UX Design'],
    categories: ['web', 'landing', 'commercial', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/Projeto-Front-End-ONG/',
      github: 'https://github.com/DevAlex-full/Projeto-Front-End-ONG',
    },
  },
  
  {
    id: 'lojatech',
    title: 'LojaTech E-commerce',
    description:
      'E-commerce moderno com interface limpa e intuitiva, focada na experiência do usuário para compra de produtos tecnológicos.',
    image: '/imagens/loja-virtual.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'E-commerce'],
    categories: ['web', 'commercial', 'personal'],
    links: {
      demo: 'https://devalex-full.github.io/PROJETO-FRONT-END-WEB-VENDAS-CONCLUIDO/',
      github: 'https://github.com/DevAlex-full/PROJETO-FRONT-END-WEB-VENDAS-CONCLUIDO',
    },
  },
  
  {
    id: 'luxestore',
    title: 'LuxeStore',
    description:
      'E-commerce moderno desenvolvido com React, TypeScript e TailwindCSS, consumindo a Fake Store API para exibir produtos de forma elegante.',
    image: '/imagens/loja de luxo.png',
    tags: ['React', 'TypeScript', 'Vite', 'TailwindCSS', 'Fake Store API'],
    categories: ['web', 'interactive', 'commercial', 'course'],
    links: {
      demo: 'https://luxestore-premium.netlify.app/',
      github: 'https://github.com/DevAlex-full/Exerc-cio---Buscar-dados-de-uma-API',
    },
  },
  
  {
    id: 'cinematch',
    title: 'CineMatch',
    description:
      'Aplicação web com Inteligência Artificial para recomendar filmes personalizados baseados no humor e preferências do usuário. Desenvolvido na Imersão Dev do Futuro.',
    image: '/imagens/cineMatch.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'N8N', 'IA'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://my-cinematch.netlify.app/',
      github: 'https://github.com/DevAlex-full/CineMatch',
    },
  },
  
  {
    id: 'pokedex',
    title: 'Pokédex',
    description:
      'Pokédex com informações detalhadas dos primeiros 151 Pokémon, com design responsivo e interface moderna usando a PokéAPI.',
    image: '/imagens/pokedex.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'PokéAPI'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/js-developer-pokedex/',
      github: 'https://github.com/DevAlex-full/js-developer-pokedex',
    },
  },
  
  {
    id: 'buscador-ceps',
    title: 'Buscador de CEPs',
    description:
      'Aplicação para consultar informações de endereços brasileiros via CEP, consumindo a API ViaCEP.',
    image: '/imagens/buscador de CEPs.png',
    tags: ['React', 'JavaScript', 'CSS3', 'API ViaCEP', 'Vite'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://consulta-de-ceps.netlify.app/',
      github: 'https://github.com/DevAlex-full/Buscar-dados-de-uma-API-baseado-em-informa--es-do-usu-rio',
    },
  },
  
  {
    id: 'github-viewer',
    title: 'Visualizador de Perfil do GitHub',
    description:
      'Aplicação que consome a API pública do GitHub para buscar dados de usuários: avatar, bio, seguidores e repositórios.',
    image: '/imagens/visualizador-perfil-github.png',
    tags: ['JavaScript', 'API do GitHub', 'HTML5', 'CSS3'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/visualizador-perfil-github/',
      github: 'https://github.com/DevAlex-full/visualizador-perfil-github',
    },
  },
  
  {
    id: 'formulario-zod',
    title: 'Formulário com ZOD',
    description:
      'Formulário com validações usando Zod, garantindo segurança e eficiência na validação dos dados do usuário.',
    image: '/imagens/formulario com ZOD.png',
    tags: ['TypeScript', 'HTML5', 'Vite', 'CSS3', 'ZOD'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/Exerc-cio---Adicionando-novos-campos-de-valida--o-com-Zod/',
      github: 'https://github.com/DevAlex-full/Exerc-cio---Adicionando-novos-campos-de-valida--o-com-Zod',
    },
  },
  
  {
    id: 'todo-list',
    title: 'TODO-LIST',
    description:
      'Lista de tarefas desenvolvida em React com funcionalidade de remoção de tarefas individuais.',
    image: '/imagens/todo-list.png',
    tags: ['React', 'Vite', 'Lucide React', 'CSS3'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://removedor-tarefa-individual-todo-reac.netlify.app/',
      github: 'https://github.com/DevAlex-full/Remover-tarefa-individual-TODO-React',
    },
  },
  
  {
    id: 'formulario-texto',
    title: 'Formulário de Texto',
    description:
      'Projeto para praticar gerenciamento de estado com useState e manipulação de eventos em React.',
    image: '/imagens/formulario de texto.png',
    tags: ['React', 'Vite', 'CSS3'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://pegando-o-valor-de-um-input.netlify.app/',
      github: 'https://github.com/DevAlex-full/Pegando-o-valor-de-um-input-React',
    },
  },
  
  {
    id: 'formulario-login',
    title: 'Formulário de Login',
    description:
      'Formulário de login criado para praticar TailwindCSS, aplicando classes utilitárias para cores, espaçamento e tipografia.',
    image: '/imagens/formulario de login.png',
    tags: ['HTML5', 'TailwindCSS', 'Node.js'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/Exerc-cio-de-Tailwind---Formul-rio-de-Login/',
      github: 'https://github.com/DevAlex-full/Exerc-cio-de-Tailwind---Formul-rio-de-Login',
    },
  },
  
  {
    id: 'props-react',
    title: 'Exercício de Props em React',
    description:
      'Projeto para praticar Props em React, entendendo como passar informações entre componentes pai e filho.',
    image: '/imagens/exercicio de Props em React.png',
    tags: ['React', 'Vite', 'CSS Inline'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://recebendo-e-renderizando-props-react.netlify.app/',
      github: 'https://github.com/DevAlex-full/Recebendo-e-renderizando-props-React',
    },
  },
  
  {
    id: 'contador',
    title: 'Contador com Limite Personalizado',
    description:
      'Contador interativo em React que permite ao usuário definir valores iniciais e máximos, com controles de incremento e decremento.',
    image: '/imagens/contador-com-Limite-Personalizado-React.png',
    tags: ['React', 'Vite', 'CSS3', 'JavaScript'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://contador-com-limite-personalizado-rea.netlify.app/',
      github: 'https://github.com/DevAlex-full/Contador-com-Limite-Personalizado-React',
    },
  },
  
  {
    id: 'card',
    title: 'Card de Produto',
    description:
      'Cartão de produto responsivo e moderno desenvolvido como exercício de TailwindCSS.',
    image: '/imagens/Card.png',
    tags: ['HTML5', 'Tailwind CSS', 'CDN Tailwind'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/Exerc-cio-de-Tailwind---Card-de-produto/',
      github: 'https://github.com/DevAlex-full/Exerc-cio-de-Tailwind---Card-de-produto',
    },
  },
  
  {
    id: 'homem-aranha',
    title: 'Homem Aranha Multiversos',
    description:
      'Aplicação web interativa que celebra o universo cinematográfico do Homem-Aranha, apresentando os diferentes atores e suas interpretações.',
    image: '/imagens/homem-aranha1.png',
    images: [
      { src: '/imagens/homem-aranha1.png', alt: 'Spider-Man - Tela 1' },
      { src: '/imagens/homem-aranha2.png', alt: 'Spider-Man - Tela 2' },
      { src: '/imagens/homem-aranha3.png', alt: 'Spider-Man - Tela 3' },
    ],
    featured: false,
    highlight: 'Curso DIO',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Responsivo'],
    categories: ['web', 'interactive', 'landing', 'course'],
    links: {
      demo: 'https://spider-man-multiverses-dio-chi.vercel.app/',
      github: 'https://github.com/DevAlex-full/spider-man-multiverses',
    },
  },
  
  {
    id: 'mundo-invertido',
    title: 'Mundo Invertido',
    description:
      'Experiência web imersiva inspirada em Stranger Things, com alternância entre o mundo normal e o invertido, com visuais e sons únicos.',
    image: '/imagens/mundo-invertido1.png',
    images: [
      { src: '/imagens/mundo-invertido1.png', alt: 'Mundo Invertido - Tela 1' },
      { src: '/imagens/mundo-invertido2.png', alt: 'Mundo Invertido - Tela 2' },
      { src: '/imagens/mundo-invertido3.png', alt: 'Mundo Invertido - Tela 3' },
    ],
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Animações'],
    categories: ['web', 'interactive', 'landing', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/semana-frontend-mundo-invertido/',
      github: 'https://github.com/DevAlex-full/semana-frontend-mundo-invertido',
    },
  },
  
  {
    id: 'piano-virtual',
    title: 'Piano Virtual',
    description:
      'Simulador de piano interativo com sons reais de piano, totalmente responsivo para desktop, tablet e mobile.',
    image: '/imagens/piano virtual.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Web Audio API'],
    categories: ['web', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/Construindo-um-Simulador-de-Piano/',
      github: 'https://github.com/DevAlex-full/Construindo-um-Simulador-de-Piano',
    },
  },

  {
    id: 'trilha-css-dio',
    title: 'Trilha de CSS - DIO',
    description:
      'Landing page moderna para a Trilha de CSS da Digital Innovation One, com técnicas avançadas de CSS e design contemporâneo.',
    image: '/imagens/trilha-dio.png',
    tags: ['HTML5', 'CSS3', 'Flexbox', 'Grid Layout'],
    categories: ['web', 'landing', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/trilha-css-desafio-01/',
      github: 'https://github.com/DevAlex-full/trilha-css-desafio',
    },
  },

  {
    id: 'cibernetico',
    title: 'Cibernético',
    description:
      'Interface interativa com visual cyberpunk para exibição de personagens fictícios, desenvolvida na Semana do Desenvolvedor da DevQuest.',
    image: '/imagens/cibernetico.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Cyberpunk UI'],
    categories: ['web', 'interactive', 'landing', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/Projeto-Web-Front-End/',
      github: 'https://github.com/DevAlex-full/Projeto-Web-Front-End',
    },
  },

  {
    id: 'yugioh',
    title: 'Yu-Gi-Oh Jo-Ken-Po',
    description:
      'Jogo que combina o universo Yu-Gi-Oh com o clássico Pedra, Papel e Tesoura. Desafie o computador com cartas icônicas do anime!',
    image: '/imagens/yugioh.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Game Logic'],
    categories: ['game', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/js-yugioh-assets/',
      github: 'https://github.com/DevAlex-full/js-yugioh-assets',
    },
  },

  {
    id: 'detona-ralph',
    title: 'Detona Ralph',
    description:
      'Jogo inspirado no clássico "Whac-a-Mole" com temática do personagem Ralph da Disney. Clique no Ralph e acumule pontos!',
    image: '/imagens/detona-ralph.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Game Timer'],
    categories: ['game', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/DETONA-RALPH/',
      github: 'https://github.com/DevAlex-full/jsgame-detona-ralph',
    },
  },

  {
    id: 'jogo-memoria',
    title: 'Jogo da Memória',
    description:
      'Jogo da memória com emojis desenvolvido com HTML, CSS e JavaScript. Encontre todos os pares e teste sua memória!',
    image: '/imagens/jogo-da-memoria.png',
    tags: ['HTML5', 'CSS3', 'JavaScript', 'Logic Game'],
    categories: ['game', 'interactive', 'course'],
    links: {
      demo: 'https://devalex-full.github.io/Jogo-da-Memoria/',
      github: 'https://github.com/DevAlex-full/js-emoji-memory-game',
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
  game: 'Jogos',
  personal: 'Pessoais',
  course: 'Cursos',
}