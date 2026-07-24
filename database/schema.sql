-- Apaga as tabelas antigas se existirem (para evitar conflitos)
DROP TABLE IF EXISTS producoes CASCADE;
DROP TABLE IF EXISTS ocorrencias CASCADE;
DROP TABLE IF EXISTS sustentabilidade CASCADE;
DROP TABLE IF EXISTS maquinas CASCADE;

-- 1. TABELA DE MÁQUINAS
CREATE TABLE maquinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    setor VARCHAR(50) NOT NULL,
    tipo VARCHAR(50) NOT NULL,
    status VARCHAR(30) DEFAULT 'Parada',
    consumo_energia NUMERIC(10, 2) DEFAULT 0.00,
    temperatura NUMERIC(5, 2) DEFAULT 0.00,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. TABELA DE PRODUÇÕES
CREATE TABLE producoes (
    id SERIAL PRIMARY KEY,
    maquina_id INT REFERENCES maquinas(id) ON DELETE CASCADE,
    produto VARCHAR(100) NOT NULL,
    quantidade_produzida INT NOT NULL,
    quantidade_esperada INT NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. TABELA DE SUSTENTABILIDADE
CREATE TABLE sustentabilidade (
    id SERIAL PRIMARY KEY,
    consumo_energia NUMERIC(10, 2) DEFAULT 0.00,
    consumo_agua NUMERIC(10, 2) DEFAULT 0.00,
    residuos NUMERIC(10, 2) DEFAULT 0.00,
    quantidade_reciclada NUMERIC(10, 2) DEFAULT 0.00,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. TABELA DE OCORRÊNCIAS (SST)
CREATE TABLE ocorrencias (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    local VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    nivel_risco VARCHAR(20) NOT NULL,
    descricao TEXT NOT NULL,
    medida_preventiva TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- DADOS INICIAIS DE TESTE (POPULAR O BANCO)
INSERT INTO maquinas (nome, setor, tipo, status, consumo_energia, temperatura) VALUES
('Torno CNC A1', 'Usinagem', 'Torno', 'Em operação', 45.00, 68.00),
('Prensa Hidráulica P2', 'Estamparia', 'Prensa', 'Em manutenção', 80.00, 75.00),
('Fresadora F1', 'Usinagem', 'Fresadora', 'Em operação', 30.00, 60.00);

INSERT INTO producoes (maquina_id, produto, quantidade_produzida, quantidade_esperada, data) VALUES
(1, 'Eixo Metálico', 450, 500, '2026-07-23'),
(3, 'Engrenagem B', 300, 300, '2026-07-23');

INSERT INTO sustentabilidade (consumo_energia, consumo_agua, residuos, quantidade_reciclada, data) VALUES
(150.00, 850.00, 150.00, 120.00, '2026-07-23');

INSERT INTO ocorrencias (tipo, local, data, nivel_risco, descricao, medida_preventiva) VALUES
('Manutenção Preventiva', 'Setor de Prensas', '2026-07-23', 'Médio', 'Vazamento leve de óleo na prensa P2', 'Troca de vedação');