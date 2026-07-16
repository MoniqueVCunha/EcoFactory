# EcoFactory — Front-End (Encontro 4)

Interface React construída com Vite + Tailwind CSS, seguindo a identidade visual do
protótipo (v0.dev): fundo verde escuro no login, sidebar branca, cards e gráficos
em tons de verde.

## Telas incluídas
- **Login** — autenticação simulada (qualquer e-mail/senha preenchidos libera o acesso)
- **Dashboard** — indicadores gerais + gráficos (produção, status das máquinas)
- **Máquinas** — CRUD completo (cadastrar, listar, editar, excluir) com validação
- **Produção** — cadastro, filtro por máquina e cálculo automático de produtividade
- **Sustentabilidade** — indicadores ambientais e destinação de resíduos
- **Segurança** — registro de ocorrências com nível de risco

Todos os dados vêm de `src/data/mockData.js` (estado local via `useState`) —
não há chamada de API ainda. Isso é proposital: o cronograma do projeto só
integra com o back-end no Encontro 8.

## Como rodar

```bash
cd frontend
npm install
npm run dev
```

Acesse **http://localhost:5173**

## Onde colocar no repositório
Copie o conteúdo desta pasta para dentro de `EcoFactory/frontend/` no seu repositório
(substituindo a pasta `frontend/` vazia que já existe lá).

## Estrutura
```
src/
  components/   -> Sidebar, Topbar, StatCard, Badge, Modal (reutilizáveis)
  pages/        -> Login, Dashboard, Maquinas, Producao, Sustentabilidade, Seguranca
  data/         -> mockData.js (dados fixos, simulando o banco)
  App.jsx       -> rotas + controle simples de login
  main.jsx      -> ponto de entrada
```

## Próximos passos (conforme cronograma do PDF)
- Encontro 5: mais lógica local (filtros extras, mais cálculos)
- Encontro 6: modelagem do banco (DER + script SQL)
- Encontro 7/8: API Node/Express + troca dos dados mockados por dados reais do PostgreSQL
