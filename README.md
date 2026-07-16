# EcoFactory

> **Sistema de Monitoramento e Gestão de uma Indústria Inteligente**
> 
> Projeto Integrador desenvolvido para o Curso Técnico em Informática para Internet (SENAI). Um sistema Full Stack projetado para centralizar e otimizar o acompanhamento de processos industriais, com foco em produtividade, sustentabilidade e segurança.

---

## Sumário
* [Sobre o Projeto](#-sobre-o-projeto)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Arquitetura e Estrutura de Pastas](#-arquitetura-e-estrutura-de-pastas)
* [Funcionalidades](#-funcionalidades)
* [Modelagem do Banco de Dados](#-modelagem-do-banco-de-dados)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Endpoints da API](#-endpoints-da-api)
* [Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)

---

## Sobre o Projeto
A **EcoFactory** resolve um problema real de indústrias que ainda dependem de planilhas de papel e processos manuais. O sistema consolida dados operacionais cruciais em uma única plataforma web responsiva, facilitando a tomada de decisões rápidas e sustentáveis.

---

## Tecnologias Utilizadas

### Front-End
* React (Vite)
* CSS / Styled Components (ou Tailwind, se usou)
* Axios / Fetch API

### Back-End & Banco de Dados
* Node.js
* Express
* PostgreSQL (Neon / Supabase ou Local)

### Qualidade & Ferramentas
* Git & GitHub (Fluxo de Git Flow)
* Testes: Vitest / Jest / Supertest
* Prototipação: Figma

---

## Arquitetura e Estrutura de Pastas
Fluxo de comunicação:
`Usuário ➔ Interface React ➔ API REST Node.js/Express ➔ Banco de dados PostgreSQL`

```text
ecofactory/
├── frontend/        # Interface do usuário (React)
├── backend/         # API REST (Node.js + Express)
├── database/        # Scripts SQL e modelagem de dados
├── documentacao/    # Diagramas, PDF de escopo e protótipos
└── README.md        # Documentação principal