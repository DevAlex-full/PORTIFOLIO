# 💻 Portfólio Alexander Bueno Santiago — v2.0

Bem-vindo ao repositório do meu portfólio pessoal! Esta é a **versão 2.0**, completamente reescrita com uma stack moderna e arquitetura profissional, apresentando minha jornada como desenvolvedor Full Stack de forma elegante e performática.

## 🌟 Sobre o Projeto

Portfólio pessoal **v2.0** desenvolvido com **Next.js 14 + TypeScript + Tailwind CSS**, com tema **Dark/Tech Premium**. Esta versão substitui completamente a versão anterior (HTML/CSS/JS vanilla), trazendo carrossel automático nos projetos, filtros com busca, animações modernas e arquitetura de componentes profissional.

**🔗 [Visualizar Portfólio Online](https://portifoliodevalex.netlify.app/)**

![Typing SVG](https://readme-typing-svg.demolab.com?font=Fira+Code&size=18&duration=4000&pause=500&color=9615F7&center=true&width=600&lines=Seja+Bem-Vindo+ao+meu+Portfólio!;Sou+Desenvolvedor+Web+FullStack;E+Estudante+de+Sistemas+para+Internet)

---

## ✨ O que há de novo na v2.0

- ⚡ Migrado de HTML/CSS/JS para **Next.js 14 + TypeScript**
- 🎨 Design **Dark/Tech Premium** com gradientes roxo e ciano
- 🎠 **Carrossel automático** nos projetos (troca a cada 3s + setas manuais)
- 🔍 **Filtros + busca** na página de todos os projetos
- 📱 Totalmente **responsivo** para todos os dispositivos
- 🧩 Arquitetura em **componentes reutilizáveis**
- 📂 Dados centralizados em `/data` — fácil manutenção
- 🚀 Deploy automático via **Vercel**

---

## 🚀 Tecnologias Utilizadas

### Front-End
![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=flat-square&logo=react&logoColor=black)
![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=nextdotjs&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)

### Back-End
![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)
![Java](https://img.shields.io/badge/Java-ED8B00?style=flat-square&logo=openjdk&logoColor=white)
![PHP](https://img.shields.io/badge/PHP-777BB4?style=flat-square&logo=php&logoColor=white)

### Database
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat-square&logo=mysql&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=flat-square&logo=prisma&logoColor=white)

### DevOps & Ferramentas
![Git](https://img.shields.io/badge/Git-F05032?style=flat-square&logo=git&logoColor=white)
![GitHub](https://img.shields.io/badge/GitHub-181717?style=flat-square&logo=github&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white)
![Vercel](https://img.shields.io/badge/Vercel-000000?style=flat-square&logo=vercel&logoColor=white)
![WordPress](https://img.shields.io/badge/WordPress-21759B?style=flat-square&logo=wordpress&logoColor=white)
![Figma](https://img.shields.io/badge/Figma-F24E1E?style=flat-square&logo=figma&logoColor=white)

---

## 📁 Estrutura do Projeto

```
portfolio/
│
├── 📄 package.json
├── 📄 next.config.js
├── 📄 tailwind.config.ts
├── 📄 tsconfig.json
├── 📄 postcss.config.js
│
├── 📁 public/
│   ├── 🖼️ favicon.ico
│   ├── 🖼️ favicon-32x32.png
│   └── 📁 imagens/           ← Screenshots e assets visuais
│
├── 📁 app/
│   ├── 📄 globals.css
│   ├── 📄 layout.tsx          ← Root layout + SEO metadata
│   ├── 📄 page.tsx            ← Home (todas as seções)
│   └── 📁 projects/
│       └── 📄 page.tsx        ← Rota /projects (todos os projetos)
│
├── 📁 components/
│   ├── 📁 layout/
│   │   ├── 📄 Header.tsx      ← Nav responsiva com active section
│   │   └── 📄 Footer.tsx      ← Footer com redes sociais
│   ├── 📁 sections/
│   │   ├── 📄 Hero.tsx        ← Typing SVG + foto + CTAs
│   │   ├── 📄 About.tsx       ← Sobre + cards de destaque
│   │   ├── 📄 Skills.tsx      ← Grid de habilidades com filtro
│   │   ├── 📄 Certifications.tsx
│   │   ├── 📄 Projects.tsx    ← 3 projetos em destaque com carrossel
│   │   ├── 📄 AllProjects.tsx ← Todos os projetos + filtros + busca
│   │   └── 📄 Contact.tsx     ← Formulário + info de contato
│   └── 📁 ui/
│       ├── 📄 Button.tsx
│       ├── 📄 Carousel.tsx    ← Auto-play 3s + setas manuais + dots
│       ├── 📄 ProjectCard.tsx
│       └── 📄 SectionHeader.tsx
│
├── 📁 data/
│   ├── 📄 projects.ts         ← ⭐ Arquivo principal — adicione projetos aqui
│   ├── 📄 skills.ts
│   └── 📄 certifications.ts
│
├── 📁 types/
│   └── 📄 index.ts            ← Interfaces TypeScript
│
├── 📁 lib/
│   └── 📄 utils.ts
│
└── 📁 hooks/
    └── 📄 useScrollAnimation.ts
```

---

## ⚡ Principais Funcionalidades

- **Design Responsivo** — Compatível com todos os dispositivos
- **Carrossel Automático** — Troca de imagens a cada 3s com pausa no hover
- **Filtros e Busca** — Filtre projetos por categoria ou busque por nome/tecnologia
- **Animações de Scroll** — Seções animam ao entrar na viewport
- **Performance Otimizada** — Next.js com SSR e otimização de imagens
- **SEO Friendly** — Metadata configurada no layout raiz
- **TypeScript Strict** — Tipagem forte em todos os componentes

---

## 🎯 Como Adicionar um Novo Projeto

Abra apenas o arquivo `data/projects.ts` e adicione um novo objeto no array:

```ts
{
  id: 'meu-projeto',
  title: 'Nome do Projeto',
  description: 'Descrição completa do projeto...',
  image: '/imagens/screenshot1.png',
  images: [                                         // opcional — para carrossel
    { src: '/imagens/screenshot1.png', alt: 'Tela 1' },
    { src: '/imagens/screenshot2.png', alt: 'Tela 2' },
    { src: '/imagens/screenshot3.png', alt: 'Tela 3' },
  ],
  tags: ['React', 'TypeScript', 'Node.js'],
  categories: ['web', 'commercial'],                // web | landing | interactive | commercial | game | personal | course
  featured: false,                                  // true = aparece nos destaques da home
  highlight: 'SaaS • Full Stack',                   // badge no card (opcional)
  links: {
    demo: 'https://...',
    github: 'https://...',
    // githubFrontend: 'https://...',               // se tiver repositórios separados
    // githubBackend: 'https://...',
  },
},
```

---

## 🚀 Como Executar o Projeto

**Pré-requisitos:** Node.js 18+ e npm

```bash
# 1. Clone o repositório
git clone https://github.com/DevAlex-full/PORTIFOLIO.git

# 2. Acesse o diretório
cd PORTIFOLIO

# 3. Instale as dependências
npm install

# 4. Inicie o servidor de desenvolvimento
npm run dev
```

Acesse **http://localhost:3000** no seu navegador.

```bash
# Build para produção
npm run build

# Iniciar em produção
npm start
```

---

## 🎓 Formação e Certificações

| Curso | Instituição | Horas | Status |
|---|---|---|---|
| Tecnológico em Sistemas para Internet | Unifatecie | 17.532h | 🔄 Em andamento |
| DevQuest 2.0 — Back-End | DevQuest | 90h+ | ✅ Concluído |
| DevQuest 2.0 — Front-End | DevQuest | 90h+ | ✅ Concluído |
| DevQuest 2.0 — IA para Devs 2.0 | DevQuest | 16h | ✅ Concluído |
| DevQuest 2.0 — Marketing Pessoal | DevQuest | 40h | ✅ Concluído |
| Java Cloud Native | DIO | 90h | ✅ Concluído |
| Formação Front-end Web Developer | DIO | 75h | ✅ Concluído |
| Imersão Dev do Futuro | Dev do Futuro | 16h | ✅ Concluído |
| Análise de Dados e BI | Gran Faculdade | 30h | ✅ Concluído |

---

## 🤝 Contribuições

Feedback e sugestões são sempre bem-vindos! Sinta-se à vontade para:

- 🐛 Reportar bugs
- 💡 Sugerir melhorias
- 🔧 Propor novas funcionalidades

---

## 📞 Contato

Entre em contato para discutirmos projetos e oportunidades:

- 🌐 **Portfólio**: [portifoliodevalex.netlify.app](https://portifoliodevalex.netlify.app/)
- 💼 **LinkedIn**: [alexander-bueno-43823a358](https://www.linkedin.com/in/alexander-bueno-43823a358/)
- 📧 **Email**: [alex.bueno22@hotmail.com](mailto:alex.bueno22@hotmail.com)
- 💻 **GitHub**: [DevAlex-full](https://github.com/DevAlex-full)
- 📸 **Instagram**: [@devalex_fullstack](https://www.instagram.com/devalex_fullstack/)

---

⭐ Se este projeto te ajudou de alguma forma, considere dar uma estrela no repositório!

**Desenvolvido com ❤️ e muito código por Alexander Bueno Santiago — v2.0**