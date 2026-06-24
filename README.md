# Portfólio CMS — Frontend

Interface pública e painel administrativo do **Portfólio CMS** de Alex Bueno, desenvolvido para apresentar projetos, clientes, feedbacks, certificações, habilidades, serviços e canais de contato de forma profissional.

> **Status:** produção  
> **Acesso público:** https://portifoliodevalex.vercel.app/  
> **Tipo de projeto:** proprietário / não open source

---

## Visão Geral

Este repositório contém o frontend do portfólio profissional, construído com **Next.js 14**, **TypeScript** e **Tailwind CSS**. A aplicação possui uma área pública otimizada para conversão e um painel administrativo completo para gerenciamento de conteúdo.

O projeto foi desenvolvido para funcionar como uma vitrine comercial real, com foco em performance, responsividade, autoridade profissional e facilidade de manutenção via CMS.

---

## Principais Recursos

### Site Público

- Home institucional com apresentação profissional.
- Seção Hero responsiva com CTA principal.
- Sobre, habilidades, certificações e serviços.
- Projetos em destaque com carrossel de imagens.
- Página de todos os projetos com busca e filtros.
- Vitrine de clientes com cases reais.
- Carrossel de imagens por cliente.
- Seção pública de feedbacks/depoimentos.
- Formulário de contato integrado ao WhatsApp.
- Botão flutuante de WhatsApp.
- Layout responsivo para desktop, tablet e mobile.

### Painel Administrativo

- Login administrativo com autenticação via JWT.
- Dashboard com indicadores do portfólio.
- CRUD de projetos.
- Upload múltiplo de imagens por projeto.
- CRUD de clientes/cases.
- Upload e carrossel de imagens para clientes.
- CRUD de feedbacks/depoimentos.
- Gestão de certificações.
- Gestão de habilidades.
- Gestão de serviços e pacotes.
- Gestão de leads.
- Biblioteca de mídias.
- Configurações de contato e SEO.
- Interface administrativa separada do layout público.

---

## Stack Técnica

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 14 |
| Linguagem | TypeScript |
| UI | React |
| Estilização | Tailwind CSS |
| Formulários | React Hook Form |
| Validação | Zod |
| Requisições HTTP | Axios |
| Notificações | Sonner |
| Autenticação Admin | JWT via backend |
| Deploy | Vercel |
| API | Fastify + Prisma + Supabase |

---

## Arquitetura

```txt
PORTIFOLIO/
├── app/
│   ├── (public)/
│   │   ├── page.tsx
│   │   ├── projects/page.tsx
│   │   └── vitrine-clientes/page.tsx
│   ├── admin/
│   │   ├── login/page.tsx
│   │   └── (protected)/
│   │       ├── dashboard/page.tsx
│   │       ├── projetos/
│   │       ├── clientes/
│   │       ├── feedbacks/
│   │       ├── certificados/
│   │       ├── habilidades/
│   │       ├── servicos/
│   │       ├── leads/
│   │       ├── midias/
│   │       └── configuracoes/
│   ├── globals.css
│   ├── layout.tsx
│   └── providers.tsx
├── components/
│   ├── admin/
│   ├── layout/
│   ├── sections/
│   └── ui/
├── contexts/
├── hooks/
├── lib/
├── services/
├── types/
└── public/
```

---

## Integração com Backend

O frontend consome uma API própria hospedada no Render.

Variável necessária:

```env
NEXT_PUBLIC_API_URL=https://portf-lio-backend.onrender.com
```

Em desenvolvimento local, essa URL pode apontar para a API local:

```env
NEXT_PUBLIC_API_URL=http://localhost:3001
```

---

## Scripts Disponíveis

```bash
# Instalar dependências
npm install

# Rodar em desenvolvimento
npm run dev

# Build de produção
npm run build

# Iniciar build localmente
npm start
```

---

## Deploy

O deploy é realizado na **Vercel**, com integração contínua via GitHub.

Fluxo recomendado:

```bash
npm run build
git add .
git commit -m "mensagem do commit"
git push
```

Após o push na branch principal, a Vercel executa o build e publica a nova versão automaticamente.

---

## Módulos do CMS

| Módulo | Descrição |
|---|---|
| Dashboard | Indicadores gerais do portfólio |
| Projetos | Gerenciamento de projetos e carrosséis |
| Clientes | Cases reais e vitrine de clientes |
| Feedbacks | Depoimentos e prova social |
| Certificados | Certificações profissionais |
| Habilidades | Stack técnica e níveis |
| Serviços | Pacotes e ofertas comerciais |
| Leads | Contatos capturados pelo site |
| Mídias | Biblioteca de uploads |
| Configurações | Dados globais, SEO e contato |

---

## Qualidade e Boas Práticas

- Componentização por responsabilidade.
- Separação entre layout público e layout administrativo.
- Tipagem compartilhada para dados da API.
- Upload de imagens com suporte a FormData.
- Componentes reutilizáveis para cards, modais, formulários e carrosséis.
- Interface mobile-first.
- Build validado antes de deploy.

---

## Licença e Uso

Este projeto é **proprietário** e **não é open source**.

O código, layout, textos, estrutura de CMS, componentes e lógica de negócio pertencem ao autor. Não é permitido copiar, redistribuir, revender, republicar ou reutilizar partes deste projeto sem autorização expressa.

---

## Autor

**Alex Bueno**  
Desenvolvedor Full Stack

- Portfólio: https://portifoliodevalex.vercel.app/
- GitHub: https://github.com/DevAlex-full
- LinkedIn: https://www.linkedin.com/in/alexander-bueno-43823a358/
- Instagram: https://www.instagram.com/alexbueno.dev/
