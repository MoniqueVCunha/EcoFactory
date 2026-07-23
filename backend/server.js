const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Dados simulados de fallback (offline)
const fallbackData = {
  maquinas: [
    { id: 1, nome: 'Torno CNC A1', setor: 'Usinagem', tipo: 'Torno', status: 'Em operação', consumo_energia: 45, temperatura: 68 },
    { id: 2, nome: 'Prensa Hidráulica P2', setor: 'Estamparia', tipo: 'Prensa', status: 'Em manutenção', consumo_energia: 80, temperatura: 75 },
    { id: 3, nome: 'Fresadora F1', setor: 'Usinagem', tipo: 'Fresadora', status: 'Em operação', consumo_energia: 30, temperatura: 60 }
  ],
  producoes: [
    { id: 1, maquina_id: 1, quantidade_produzida: 450, quantidade_esperada: 500, data_producao: '2026-07-23', nome_maquina: 'Torno CNC A1' },
    { id: 2, maquina_id: 3, quantidade_produzida: 300, quantidade_esperada: 300, data_producao: '2026-07-23', nome_maquina: 'Fresadora F1' }
  ],
  sustentabilidade: [
    { id: 1, quantidade_residuos: 150, quantidade_reciclada: 120, consumo_agua: 850, data_registro: '2026-07-23' }
  ],
  ocorrencias: [
    { id: 1, descricao: 'Vazamento leve de óleo na prensa P2', nivel_risco: 'Médio', status: 'Aberta', data_ocorrencia: '2026-07-23' }
  ]
};

// Instância do banco
let pool = null;
let isDbConnected = false;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000
  });

  // Tenta conectar de forma isolada sem travar o processo
  pool.connect()
    .then((client) => {
      console.log('🎉 Conexão com o PostgreSQL do Neon estabelecida!');
      isDbConnected = true;
      client.release();
    })
    .catch((err) => {
      console.log('⚠️ Banco Neon inacessível (senha/conexão). Usando dados locais de fallback.');
      isDbConnected = false;
    });
} else {
  console.log('⚠️ Nenhuma DATABASE_URL fornecida. Usando modo offline.');
}

// ==========================================
// ROTAS
// ==========================================

app.get('/maquinas', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.maquinas);
  try {
    const result = await pool.query('SELECT * FROM maquinas ORDER BY id ASC');
    res.json(result.rows);
  } catch {
    res.json(fallbackData.maquinas);
  }
});

app.post('/maquinas', async (req, res) => {
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), nome, setor, tipo, status: status || 'Em operação', consumo_energia, temperatura };
    fallbackData.maquinas.push(nova);
    return res.status(201).json(nova);
  }
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

app.put('/maquinas/:id', async (req, res) => {
  const { id } = req.params;
  const { nome, setor, tipo, status, consumo_energia, temperatura } = req.body;
  if (!isDbConnected || !pool) return res.json({ id, nome, setor, tipo, status, consumo_energia, temperatura });
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

app.delete('/maquinas/:id', async (req, res) => {
  if (!isDbConnected || !pool) return res.json({ message: 'Removido com sucesso!' });
  try {
    await pool.query('DELETE FROM maquinas WHERE id = $1', [req.params.id]);
    res.json({ message: 'Removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/producoes', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.producoes);
  try {
    const result = await pool.query(`
      SELECT p.*, m.nome as nome_maquina 
      FROM producoes p 
      LEFT JOIN maquinas m ON p.maquina_id = m.id 
      ORDER BY p.data_producao DESC
    `);
    res.json(result.rows);
  } catch {
    res.json(fallbackData.producoes);
  }
});

app.post('/producoes', async (req, res) => {
  const { maquina_id, quantidade_produzida, quantidade_esperada, data_producao } = req.body;
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), maquina_id, quantidade_produzida, quantidade_esperada, data_producao, nome_maquina: 'Máquina Demo' };
    fallbackData.producoes.push(nova);
    return res.status(201).json(nova);
  }
  try {
    const result = await pool.query(
      'INSERT INTO producoes (maquina_id, quantidade_produzida, quantidade_esperada, data_producao) VALUES ($1, $2, $3, $4) RETURNING *',
      [maquina_id, quantidade_produzida, quantidade_esperada, data_producao]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.delete('/producoes/:id', async (req, res) => {
  if (!isDbConnected || !pool) return res.json({ message: 'Removido com sucesso!' });
  try {
    await pool.query('DELETE FROM producoes WHERE id = $1', [req.params.id]);
    res.json({ message: 'Removido com sucesso!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/sustentabilidade', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.sustentabilidade);
  try {
    const result = await pool.query('SELECT * FROM sustentabilidade ORDER BY data_registro DESC');
    res.json(result.rows);
  } catch {
    res.json(fallbackData.sustentabilidade);
  }
});

app.post('/sustentabilidade', async (req, res) => {
  const { quantidade_residuos, quantidade_reciclada, consumo_agua, data_registro } = req.body;
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), quantidade_residuos, quantidade_reciclada, consumo_agua, data_registro };
    fallbackData.sustentabilidade.push(nova);
    return res.status(201).json(nova);
  }
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

app.delete('/sustentabilidade/:id', async (req, res) => {
  if (!isDbConnected || !pool) return res.json({ message: 'Removido!' });
  try {
    await pool.query('DELETE FROM sustentabilidade WHERE id = $1', [req.params.id]);
    res.json({ message: 'Removido!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/ocorrencias', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.ocorrencias);
  try {
    const result = await pool.query('SELECT * FROM ocorrencias ORDER BY data_ocorrencia DESC');
    res.json(result.rows);
  } catch {
    res.json(fallbackData.ocorrencias);
  }
});

app.post('/ocorrencias', async (req, res) => {
  const { descricao, nivel_risco, status, data_ocorrencia } = req.body;
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), descricao, nivel_risco, status: status || 'Aberta', data_ocorrencia };
    fallbackData.ocorrencias.push(nova);
    return res.status(201).json(nova);
  }
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

app.put('/ocorrencias/:id', async (req, res) => {
  const { id } = req.params;
  const { descricao, nivel_risco, status, data_ocorrencia } = req.body;
  if (!isDbConnected || !pool) return res.json({ id, descricao, nivel_risco, status, data_ocorrencia });
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

app.delete('/ocorrencias/:id', async (req, res) => {
  if (!isDbConnected || !pool) return res.json({ message: 'Removido!' });
  try {
    await pool.query('DELETE FROM ocorrencias WHERE id = $1', [req.params.id]);
    res.json({ message: 'Removido!' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/dashboard', async (req, res) => {
  if (!isDbConnected || !pool) {
    return res.json({
      totalMaquinas: 3,
      maquinasEmOperacao: 2,
      maquinasEmManutencao: 1,
      producaoTotal: 750,
      produtividadeMedia: 93.8,
      percentualReciclado: 80.0,
      ocorrenciasAbertas: 1
    });
  }

  try {
    const maquinasRes = await pool.query(`
      SELECT 
        COUNT(*) as total,
        COUNT(CASE WHEN status = 'Em operação' THEN 1 END) as operacao,
        COUNT(CASE WHEN status = 'Em manutenção' THEN 1 END) as manutencao
      FROM maquinas
    `);

    const producaoRes = await pool.query(`
      SELECT 
        SUM(quantidade_produzida) as total_produzido,
        SUM(quantidade_esperada) as total_esperado
      FROM producoes
    `);

    const sustentabilidadeRes = await pool.query(`
      SELECT 
        SUM(quantidade_residuos) as residuos_totais,
        SUM(quantidade_reciclada) as reciclado_total
      FROM sustentabilidade
    `);

    const ocorrenciasRes = await pool.query(`
      SELECT COUNT(*) as abertas 
      FROM ocorrencias 
      WHERE status != 'Resolvido'
    `);

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
  } catch {
    res.json({
      totalMaquinas: 3,
      maquinasEmOperacao: 2,
      maquinasEmManutencao: 1,
      producaoTotal: 750,
      produtividadeMedia: 93.8,
      percentualReciclado: 80.0,
      ocorrenciasAbertas: 1
    });
  }
});

// Inicialização permanente do servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Servidor de API rodando continuamente na porta ${PORT}`);
});

module.exports = app;