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

// ==========================================
// 1. ROTAS DO MÓDULO DE MÁQUINAS (CRUD)
// ==========================================

// Listar todas as máquinas (GET)
app.get('/maquinas', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM maquinas ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cadastrar máquina (POST)
app.post('/maquinas', async (req, res) => {
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [nome, setor, tipo, status || 'Em operação', consumo_energia, temperatura]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Editar máquina (PUT)
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

// Excluir máquina (DELETE)
app.delete('/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM maquinas WHERE id = $1', [id]);
    res.json({ message: 'Máquina removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 2. ROTAS DO MÓDULO DE PRODUÇÕES (CRUD)
// ==========================================

// Listar todas as produções (GET)
app.get('/producoes', async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT p.*, m.nome as nome_maquina 
      FROM producoes p 
      LEFT JOIN maquinas m ON p.maquina_id = m.id 
      ORDER BY p.data_producao DESC
    `);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar produção (POST com validação de FK)
app.post('/producoes', async (req, res) => {
  const { maquina_id, quantidade_produzida, quantidade_esperada, data_producao } = req.body;
  try {
    // Validação se a máquina existe
    const maquinaExiste = await pool.query('SELECT id FROM maquinas WHERE id = $1', [maquina_id]);
    if (maquinaExiste.rows.length === 0) {
      return res.status(400).json({ error: 'A máquina informada não existe.' });
    }

    const result = await pool.query(
      'INSERT INTO producoes (maquina_id, quantidade_produzida, quantidade_esperada, data_producao) VALUES ($1, $2, $3, $4) RETURNING *',
      [maquina_id, quantidade_produzida, quantidade_esperada, data_producao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir produção (DELETE)
app.delete('/producoes/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM producoes WHERE id = $1', [id]);
    res.json({ message: 'Registro de produção removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 3. ROTAS DO MÓDULO DE SUSTENTABILIDADE (CRUD)
// ==========================================

// Listar registros de sustentabilidade (GET)
app.get('/sustentabilidade', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM sustentabilidade ORDER BY data_registro DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Cadastrar sustentabilidade (POST)
app.post('/sustentabilidade', async (req, res) => {
  const { quantidade_residuos, quantidade_reciclada, consumo_agua, data_registro } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO sustentabilidade (quantidade_residuos, quantidade_reciclada, consumo_agua, data_registro) VALUES ($1, $2, $3, $4) RETURNING *',
      [quantidade_residuos, quantidade_reciclada, consumo_agua, data_registro]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir sustentabilidade (DELETE)
app.delete('/sustentabilidade/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM sustentabilidade WHERE id = $1', [id]);
    res.json({ message: 'Registro de sustentabilidade removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 4. ROTAS DO MÓDULO DE SEGURANÇA / OCORRÊNCIAS (CRUD)
// ==========================================

// Listar ocorrências (GET)
app.get('/ocorrencias', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM ocorrencias ORDER BY data_ocorrencia DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Registrar ocorrência (POST)
app.post('/ocorrencias', async (req, res) => {
  const { descricao, nivel_risco, status, data_ocorrencia } = req.body;
  try {
    const result = await pool.query(
      'INSERT INTO ocorrencias (descricao, nivel_risco, status, data_ocorrencia) VALUES ($1, $2, $3, $4) RETURNING *',
      [descricao, nivel_risco, status || 'Aberta', data_ocorrencia]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Atualizar status de ocorrência (PUT)
app.put('/ocorrencias/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, nivel_risco, status, data_ocorrencia } = req.body;
  try {
    const result = await pool.query(
      'UPDATE ocorrencias SET descricao=$1, nivel_risco=$2, status=$3, data_ocorrencia=$4 WHERE id=$5 RETURNING *',
      [descricao, nivel_risco, status, data_ocorrencia, id]
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Excluir ocorrência (DELETE)
app.delete('/ocorrencias/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM ocorrencias WHERE id = $1', [id]);
    res.json({ message: 'Ocorrência removida com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ==========================================
// 5. ROTA CONSOLIDADA DO DASHBOARD (MÉTRICAS)
// ==========================================

app.get('/dashboard', async (req, res) => {
  try {
    // Contagem de Máquinas por Status
    const maquinasRes = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Em operação' THEN 1 END) as operacao,
        COUNT(CASE WHEN status = 'Em manutenção' THEN 1 END) as manutencao
      FROM maquinas
    `);

    // Totais de Produção e Cálculo de Produtividade (%)
    const producaoRes = await pool.query(`
      SELECT 
        SUM(quantidade_produzida) as total_produzido,
        SUM(quantidade_esperada) as total_esperado
      FROM producoes
    `);

    // Totais de Sustentabilidade (% Reciclado)
    const sustentabilidadeRes = await pool.query(`
      SELECT 
        SUM(quantidade_residuos) as residuos_totais,
        SUM(quantidade_reciclada) as reciclado_total
      FROM sustentabilidade
    `);

    // Ocorrências em Aberto
    const ocorrenciasRes = await pool.query(`
      SELECT COUNT(*) as abertas 
      FROM ocorrencias 
      WHERE status != 'Resolvido'
    `);

    // Cálculos e tratamentos de nulos/divisão por zero
    const totalProduzido = Number(producaoRes.rows[0].total_produzido) || 0;
    const totalEsperado = Number(producaoRes.rows[0].total_esperado) || 1;
    const produtividadeMedia = Number(((totalProduzido / totalEsperado) * 100).toFixed(1));

    const residuosTotais = Number(sustentabilidadeRes.rows[0].residuos_totais) || 1;
    const recicladoTotal = Number(sustentabilidadeRes.rows[0].reciclado_total) || 0;
    const percentualReciclado = Number(((recicladoTotal / residuosTotais) * 100).toFixed(1));

    res.json({
      totalMaquinas: Number(maquinasRes.rows[0].total) || 0,
      maquinasEmOperacao: Number(maquinasRes.rows[0].operacao) || 0,
      maquinasEmManutencao: Number(maquinasRes.rows[0].manutencao) || 0,
      producaoTotal: totalProduzido,
      produtividadeMedia,
      percentualReciclado,
      ocorrenciasAbertas: Number(ocorrenciasRes.rows[0].abertas) || 0
    });
  } catch (err) {
    console.error('Erro na rota dashboard:', err);
    res.status(500).json({ error: 'Erro ao carregar dados do dashboard' });
  }
});

// Inicialização do Servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de API rodando na porta ${PORT}`);
});