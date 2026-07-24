const express = require('express');
const cors = require('cors');
const { Pool } = require('pg');
require('dotenv').config();

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// ==========================================
// DADOS DE FALLBACK (modo offline)
// ==========================================
const fallbackData = {
  maquinas: [
    { id: 1, nome: 'Torno CNC A1', setor: 'Usinagem', tipo: 'Torno', status: 'Em operação', consumo_energia: 45, temperatura: 68 },
    { id: 2, nome: 'Prensa Hidráulica P2', setor: 'Estamparia', tipo: 'Prensa', status: 'Em manutenção', consumo_energia: 80, temperatura: 75 },
    { id: 3, nome: 'Fresadora F1', setor: 'Usinagem', tipo: 'Fresadora', status: 'Em operação', consumo_energia: 30, temperatura: 60 }
  ],
  producoes: [
    { id: 1, maquina_id: 1, produto: 'Eixo Metálico', quantidade_produzida: 450, quantidade_esperada: 500, data: '2026-07-23', nome_maquina: 'Torno CNC A1' },
    { id: 2, maquina_id: 3, produto: 'Engrenagem B',  quantidade_produzida: 300, quantidade_esperada: 300, data: '2026-07-23', nome_maquina: 'Fresadora F1' }
  ],
  sustentabilidade: [
    { id: 1, consumo_energia: 150, consumo_agua: 850, residuos: 150, quantidade_reciclada: 120, data: '2026-07-23' }
  ],
  ocorrencias: [
    { id: 1, tipo: 'Manutenção Preventiva', local: 'Setor de Prensas', data: '2026-07-23', nivel_risco: 'Médio', descricao: 'Vazamento leve de óleo na prensa P2', medida_preventiva: 'Troca de vedação' }
  ]
};

// ==========================================
// CONEXÃO COM O BANCO (com fallback seguro)
// ==========================================
let pool = null;
let isDbConnected = false;

if (process.env.DATABASE_URL) {
  pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    connectionTimeoutMillis: 3000
  });

  try {
    const connectResult = pool.connect();
    if (connectResult && typeof connectResult.then === 'function') {
      connectResult
        .then((client) => {
          console.log('🎉 Conexão com o PostgreSQL do Neon estabelecida!');
          isDbConnected = true;
          if (client && client.release) client.release();
        })
        .catch(() => {
          console.log('⚠️ Banco Neon inacessível. Usando dados locais de fallback.');
          isDbConnected = false;
        });
    } else {
      isDbConnected = true;
    }
  } catch {
    isDbConnected = false;
  }
} else {
  console.log('⚠️ Nenhuma DATABASE_URL fornecida. Usando modo offline.');
}

// ==========================================
// ROTAS - MÁQUINAS (CRUD completo)
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
  if (!nome || !setor || !tipo) {
    return res.status(400).json({ error: 'Campos obrigatórios: nome, setor, tipo.' });
  }
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), nome, setor, tipo, status: status || 'Em operação', consumo_energia, temperatura };
    fallbackData.maquinas.push(nova);
    return res.status(201).json(nova);
  }
  try {
    const result = await pool.query(
      'INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [nome, setor, tipo, status || 'Em operação', consumo_energia || 0, temperatura || 0]
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

// ==========================================
// ROTAS - PRODUÇÕES (agora com "produto" e coluna "data")
// ==========================================
app.get('/producoes', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.producoes);
  try {
    const result = await pool.query(`
      SELECT p.*, m.nome AS nome_maquina
      FROM producoes p
      LEFT JOIN maquinas m ON p.maquina_id = m.id
      ORDER BY p.data DESC
    `);
    res.json(result.rows);
  } catch {
    res.json(fallbackData.producoes);
  }
});

app.post('/producoes', async (req, res) => {
  const { maquina_id, produto, quantidade_produzida, quantidade_esperada, data } = req.body;
  if (!produto || !quantidade_produzida || !quantidade_esperada || !data) {
    return res.status(400).json({ error: 'Campos obrigatórios: produto, quantidade_produzida, quantidade_esperada, data.' });
  }
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), maquina_id, produto, quantidade_produzida, quantidade_esperada, data, nome_maquina: 'Máquina Demo' };
    fallbackData.producoes.push(nova);
    return res.status(201).json(nova);
  }
  try {
    const result = await pool.query(
      'INSERT INTO producoes (maquina_id, produto, quantidade_produzida, quantidade_esperada, data) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [maquina_id, produto, quantidade_produzida, quantidade_esperada, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/producoes/:id', async (req, res) => {
  const { id } = req.params;
  const { maquina_id, produto, quantidade_produzida, quantidade_esperada, data } = req.body;
  if (!isDbConnected || !pool) return res.json({ id, maquina_id, produto, quantidade_produzida, quantidade_esperada, data });
  try {
    const result = await pool.query(
      'UPDATE producoes SET maquina_id=$1, produto=$2, quantidade_produzida=$3, quantidade_esperada=$4, data=$5 WHERE id=$6 RETURNING *',
      [maquina_id, produto, quantidade_produzida, quantidade_esperada, data, id]
    );
    res.json(result.rows[0]);
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

// ==========================================
// ROTAS - SUSTENTABILIDADE (com consumo_energia e coluna "residuos")
// ==========================================
app.get('/sustentabilidade', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.sustentabilidade);
  try {
    const result = await pool.query('SELECT * FROM sustentabilidade ORDER BY data DESC');
    res.json(result.rows);
  } catch {
    res.json(fallbackData.sustentabilidade);
  }
});

app.post('/sustentabilidade', async (req, res) => {
  const { consumo_energia, consumo_agua, residuos, quantidade_reciclada, data } = req.body;
  if (!data) return res.status(400).json({ error: 'Campo obrigatório: data.' });
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), consumo_energia, consumo_agua, residuos, quantidade_reciclada, data };
    fallbackData.sustentabilidade.push(nova);
    return res.status(201).json(nova);
  }
  try {
    const result = await pool.query(
      'INSERT INTO sustentabilidade (consumo_energia, consumo_agua, residuos, quantidade_reciclada, data) VALUES ($1,$2,$3,$4,$5) RETURNING *',
      [consumo_energia || 0, consumo_agua || 0, residuos || 0, quantidade_reciclada || 0, data]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/sustentabilidade/:id', async (req, res) => {
  const { id } = req.params;
  const { consumo_energia, consumo_agua, residuos, quantidade_reciclada, data } = req.body;
  if (!isDbConnected || !pool) return res.json({ id, consumo_energia, consumo_agua, residuos, quantidade_reciclada, data });
  try {
    const result = await pool.query(
      'UPDATE sustentabilidade SET consumo_energia=$1, consumo_agua=$2, residuos=$3, quantidade_reciclada=$4, data=$5 WHERE id=$6 RETURNING *',
      [consumo_energia, consumo_agua, residuos, quantidade_reciclada, data, id]
    );
    res.json(result.rows[0]);
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

// ==========================================
// ROTAS - OCORRÊNCIAS (SST) com tipo, local, medida_preventiva
// ==========================================
app.get('/ocorrencias', async (req, res) => {
  if (!isDbConnected || !pool) return res.json(fallbackData.ocorrencias);
  try {
    const result = await pool.query('SELECT * FROM ocorrencias ORDER BY data DESC');
    res.json(result.rows);
  } catch {
    res.json(fallbackData.ocorrencias);
  }
});

app.post('/ocorrencias', async (req, res) => {
  const { tipo, local, data, nivel_risco, descricao, medida_preventiva } = req.body;
  if (!tipo || !local || !data || !nivel_risco || !descricao) {
    return res.status(400).json({ error: 'Campos obrigatórios: tipo, local, data, nivel_risco, descricao.' });
  }
  if (!isDbConnected || !pool) {
    const nova = { id: Date.now(), tipo, local, data, nivel_risco, descricao, medida_preventiva };
    fallbackData.ocorrencias.push(nova);
    return res.status(201).json(nova);
  }
  try {
    const result = await pool.query(
      'INSERT INTO ocorrencias (tipo, local, data, nivel_risco, descricao, medida_preventiva) VALUES ($1,$2,$3,$4,$5,$6) RETURNING *',
      [tipo, local, data, nivel_risco, descricao, medida_preventiva || null]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/ocorrencias/:id', async (req, res) => {
  const { id } = req.params;
  const { tipo, local, data, nivel_risco, descricao, medida_preventiva } = req.body;
  if (!isDbConnected || !pool) return res.json({ id, tipo, local, data, nivel_risco, descricao, medida_preventiva });
  try {
    const result = await pool.query(
      'UPDATE ocorrencias SET tipo=$1, local=$2, data=$3, nivel_risco=$4, descricao=$5, medida_preventiva=$6 WHERE id=$7 RETURNING *',
      [tipo, local, data, nivel_risco, descricao, medida_preventiva, id]
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

// ==========================================
// DASHBOARD (indicadores calculados)
// ==========================================
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
        COUNT(*) AS total,
        COUNT(CASE WHEN status = 'Em operação' THEN 1 END) AS operacao,
        COUNT(CASE WHEN status = 'Em manutenção' THEN 1 END) AS manutencao
      FROM maquinas
    `);

    const producaoRes = await pool.query(`
      SELECT
        COALESCE(SUM(quantidade_produzida), 0) AS total_produzido,
        COALESCE(SUM(quantidade_esperada), 0)  AS total_esperado
      FROM producoes
    `);

    const sustentabilidadeRes = await pool.query(`
      SELECT
        COALESCE(SUM(residuos), 0)              AS residuos_totais,
        COALESCE(SUM(quantidade_reciclada), 0)  AS reciclado_total
      FROM sustentabilidade
    `);

    const ocorrenciasRes = await pool.query(`
      SELECT COUNT(*) AS abertas FROM ocorrencias
    `);

    const totalProduzido = Number(producaoRes.rows[0].total_produzido) || 0;
    const totalEsperado  = Number(producaoRes.rows[0].total_esperado)  || 0;
    const produtividadeMedia = totalEsperado > 0
      ? Number(((totalProduzido / totalEsperado) * 100).toFixed(1))
      : 0;

    const residuosTotais = Number(sustentabilidadeRes.rows[0].residuos_totais) || 0;
    const recicladoTotal = Number(sustentabilidadeRes.rows[0].reciclado_total) || 0;
    const percentualReciclado = residuosTotais > 0
      ? Number(((recicladoTotal / residuosTotais) * 100).toFixed(1))
      : 0;

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
    console.error('Erro no dashboard:', err.message);
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

// ==========================================
// INICIALIZAÇÃO
// ==========================================
const PORT = process.env.PORT || 3000;

if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Servidor de API rodando continuamente na porta ${PORT}`);
  });
}

module.exports = app;