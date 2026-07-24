# Arquitetura do Sistema - EcoFactory

## Diagrama da Arquitetura

[React + Vite + Tailwind]  ⇄  [Node.js / Express API]  ⇄  [PostgreSQL Neon]
      Front-End                     Back-End               Banco de Dados

---

## 🏢 Descrição das Camadas

### 1. Front-End (`/frontend`)
* **Tecnologias:** React, Vite, Tailwind CSS, Lucide React, Axios.
* **Responsabilidade:** Interface SPA responsiva para navegação entre as telas (Dashboard, Máquinas, Produção, Sustentabilidade, Segurança e Login) e consumo das APIs REST.

### 2. Back-End (`/backend`)
* **Tecnologias:** Node.js, Express, Jest, Supertest, pg, dotenv.
* **Responsabilidade:** Regras de negócio, cálculo de métricas do Dashboard, rotas CRUD e fallback offline em memória.

### 3. Banco de Dados (`/database`)
* **Tecnologias:** PostgreSQL (Neon.tech).
* **Responsabilidade:** Persistência relacional dos dados das entidades do sistema.