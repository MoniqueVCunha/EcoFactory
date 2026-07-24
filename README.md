# 🌿 EcoFactory - Sistema de Gestão Industrial Sustentável

O **EcoFactory** é uma plataforma web completa para monitoramento em tempo real de chão de fábrica, com foco em eficiência operacional, acompanhamento de produção, segurança do trabalho e indicadores ambientais (ESG).

---

## 🚀 Como Executar o Projeto

### Pré-requisitos
* **Node.js** (versão 18 ou superior)
* **npm** ou **yarn**
* Conta ou instância no **PostgreSQL (Neon.tech)** *[opcional - o sistema possui fallback offline]*

---

### 1. Configurando e Executando o Back-End

```bash
# Entre na pasta do backend
cd backend

# Instale as dependências
npm install

# Configure o arquivo de variáveis de ambiente
cp .env.example .env

# Execute o servidor
npm start
# Servidor rodando em http://localhost:3000