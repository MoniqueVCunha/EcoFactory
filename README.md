# 🏭 EcoFactory - Sistema de Gestão Industrial e Sustentabilidade

O **EcoFactory** é um sistema web integrado para monitoramento industrial focado em eficiência produtiva, sustentabilidade ambiental (redução de resíduos e consumo de recursos) e gerenciamento de Saúde e Segurança do Trabalho (SST).

---

## 📌 Sumário
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Modelagem do Banco de Dados](#-modelagem-do-banco-de-dados)
* [Como Executar o Projeto](#-como-executar-o-projeto)
* [Como Executar os Testes](#-como-executar-os-testes)
* [Endpoints da API](#-endpoints-da-api)
* [Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)

---

## 🚀 Funcionalidades
* **Dashboard Geral**: Indicadores consolidados da fábrica em tempo real (produtividade, reciclagem, status e SST).
* **Gestão de Máquinas**: CRUD completo para monitoramento de status, setor, tipo, consumo e temperatura.
* **Controle de Produção**: Monitoramento de metas e eficiência por máquina.
* **Gestão de Sustentabilidade**: Acompanhamento de consumo de água, energia e destinação de resíduos.
* **Segurança do Trabalho**: Registro de ocorrências, classificação de riscos e medidas preventivas.

---

## 🛠️ Tecnologias Utilizadas
* **Front-End**: React.js, Vite, Tailwind CSS, Lucide React, Axios, Recharts, Vitest.
* **Back-End**: Node.js, Express.js, PostgreSQL (pg), Jest, Supertest.
* **Banco de Dados**: PostgreSQL (Hospedado no Neon Tech).
* **Controle de Versão**: Git e GitHub.

---

## 🗄️ Modelagem do Banco de Dados
* `maquinas`: Armazena dados das máquinas, status, setor, consumo e temperatura.
* `producoes`: Registra histórico de produção, produto e metas atreladas às máquinas.
* `sustentabilidade`: Monitora consumo de energia, água, resíduos e taxa de reciclagem.
* `ocorrencias`: Gerencia eventos de SST, riscos, locais e ações preventivas.

---

## 💻 Como Executar o Projeto

### Pré-requisitos
* Node.js instalado (v18+)
* Banco PostgreSQL (Neon Tech)

### 1. Configurando e Executando o Back-End
```bash
cd backend
npm install
npm start