# EcoFactory - Sistema de Monitoramento e Gestão de Indústria Inteligente

Projeto Integrador Full Stack — Curso Técnico em Informática para Internet (SENAI).

O EcoFactory é uma aplicação web Full Stack para centralizar o monitoramento de máquinas, produção, sustentabilidade e ocorrências de segurança de uma indústria fictícia, substituindo planilhas soltas por um sistema único com dashboard de indicadores.

## Tecnologias

• **Front-End:** React 19, Vite, TailwindCSS, Axios, Recharts, React Router
• **Back-End:** Node.js, Express, CORS, dotenv
• **Banco de dados:** PostgreSQL (Neon)
• **Testes:** Vitest + React Testing Library (front) / Jest + Supertest (back)
• **Versionamento:** Git e GitHub
• **Prototipação:** Figma

## Arquitetura

[ Front-End (React + Vite) ]  <--->  [ Back-End (Express API) ]  <--->  [ PostgreSQL (Neon) ]

• **Front-End:** Interface SPA reativa para exibição de métricas, gráficos e formulários de cadastro/edição.
• **Back-End:** API REST com lógica de negócios, agregações SQL e suporte a fallback offline.
• **Banco de Dados:** Modelagem relacional para máquinas, produção, sustentabilidade e ocorrências de segurança.

## Como Executar

### 1. Clonar o repositório

git clone [https://github.com/MoniqueVCunha/EcoFactory.git](https://github.com/MoniqueVCunha/EcoFactory.git)
cd EcoFactory

### 2. Configurar o Banco de Dados

Execute o script database/schema.sql em seu ambiente PostgreSQL (Neon).

### 3. Executar o Back-End

cd backend
npm install

# Crie o arquivo .env com a DATABASE_URL

npm start

### 4. Executar o Front-End

cd frontend
npm install
npm run dev

## Endpoints da API

• **Máquinas:** GET, POST, PUT, DELETE em /maquinas
• **Produção:** GET, POST, PUT, DELETE em /producoes
• **Sustentabilidade:** GET, POST, PUT, DELETE em /sustentabilidade
• **Ocorrências:** GET, POST, PUT, DELETE em /ocorrencias
• **Dashboard:** GET /dashboard (indicadores consolidados)

## Estrutura do Repositório

EcoFactory/
├─ backend/        # Servidor Express, rotas e testes Jest
├─ database/       # Schema SQL e Dicionário de Dados
├─ documentacao/   # Escopo, Arquitetura, Endpoints e Protótipos
└─ frontend/       # Interface React, componentes e páginas

## Autora

**Monique Cunha** — Desenvolvimento Full Stack
Projeto Integrador · Curso Técnico em Informática para Internet · SENAI