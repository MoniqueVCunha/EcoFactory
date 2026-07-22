const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Configuração do Banco de Dados Neon
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Exigido pelo Neon para conexão segura
  }
});

// Teste de conexão rápida com o banco do Neon
pool.connect((err, client, release) => {
  if (err) {
    return console.error('Erro ao conectar ao banco do Neon:', err.stack);
  }
  console.log('Conexão com o PostgreSQL do Neon estabelecida com sucesso! 🎉');
  release();
});

// ROTAS DO MÓDULO DE MÁQUINAS (CRUD)

// 1. Listar todas as máquinas (GET)
app.get('/maquinas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 2. Cadastrar máquina (POST)
app.post('/maquinas', async (req, res) => {
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, setor, tipo, status, consumo_energia, temperatura]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 3. Editar máquina (PUT)
app.put('/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const result = await pool.query(
      'UPDATE maquinas SET nome=$1, setor=$2, tipo=$3, status=$4, consumo_energia=$5, temperatura=$6 WHERE id=$7 RETURNING *',
      [nome, setor, tipo, status, consumo_energia, temperatura, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// 4. Excluir máquina (DELETE)
app.delete('/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM maquinas WHERE id = $1', [id]);
    res.json({ message: 'Máquina removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS DO MÓDULO DE PRODUÇÃO

// Listar todas as produções (com nome da máquina via JOIN)
app.get('/producoes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.nome AS maquina_nome 
      FROM producoes p
      LEFT JOIN maquinas m ON p.maquina_id = m.id
      ORDER BY p.data DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cadastrar produção
app.post('/producoes', async (req, res) => {
  const { maquina_id, produto, quantidade_produzida, quantidade_esperada, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO producoes (maquina_id, produto, quantidade_produzida, quantidade_esperada, data) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [maquina_id, produto, quantidade_produzida, quantidade_esperada, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS DO MÓDULO DE SUSTENTABILIDADE

app.get('/sustentabilidade', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sustentabilidade ORDER BY data DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/sustentabilidade', async (req, res) => {
  const { consumo_energia, consumo_agua, residuos, quantidade_reciclada, data } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sustentabilidade (consumo_energia, consumo_agua, residuos, quantidade_reciclada, data) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [consumo_energia, consumo_agua, residuos, quantidade_reciclada, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ROTAS DO MÓDULO DE OCORRÊNCIAS (SST)

app.get('/ocorrencias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ocorrencias ORDER BY data DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.post('/ocorrencias', async (req, res) => {
  const { tipo, local, data, nivel_risco, descricao, medida_preventiva } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ocorrencias (tipo, local, data, nivel_risco, descricao, medida_preventiva) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [tipo, local, data, nivel_risco, descricao, medida_preventiva]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de API rodando na porta ${PORT}`);
});