# EcoFactory

O **EcoFactory** é um sistema web integrado para monitoramento industrial focado em eficiência produtiva, sustentabilidade ambiental (redução de resíduos e consumo de recursos) e gerenciamento de Saúde e Segurança do Trabalho (SST).

---

## Sumário
* [Funcionalidades](#-funcionalidades)
* [Tecnologias Utilizadas](#-tecnologias-utilizadas)
* [Modelagem do Banco de Dados](#-modelagem-do-banco-de-dados)
* [Como Executar o Projeto](#-como-executar-projeto)
* [Endpoints da API](#-endpoints-da-api)
* [Equipe de Desenvolvimento](#-equipe-de-desenvolvimento)

---

## Funcionalidades
* **Dashboard Geral**: Indicadores consolidados de toda a fábrica em tempo real.
* **Controle de Produção**: Monitoramento de metas e eficiência por máquina.
* **Gestão de Sustentabilidade**: Gráficos de consumo de água, energia e destinação correta de resíduos.
* **Segurança do Trabalho**: Registro de ocorrências, classificação de riscos e medidas preventivas.

---

## Tecnologias Utilizadas
* **Front-End**: React.js, Tailwind CSS, Recharts, Axios.
* **Back-End**: Node.js, Express.js.
* **Banco de Dados**: PostgreSQL (Hospedado no Neon).
* **Controle de Versão**: Git e GitHub.

---

## Modelagem do Banco de Dados
O sistema utiliza um banco de dados relacional com as seguintes tabelas principais:
* `maquinas`: Armazena os dados das linhas de produção.
* `producao`: Registra o histórico de produtos e eficiência das metas.
* `ocorrencias`: Gerencia os eventos de SST e ações preventivas.
* `sustentabilidade`: Monitora o consumo mensal de recursos ecológicos.

---

## Como Executar o Projeto

### Pré-requisitos
* Node.js instalado.
* Conta ou credenciais do banco PostgreSQL (Neon).

### 1. Configurando o Back-End
```bash
cd backend
npm install
npm run dev