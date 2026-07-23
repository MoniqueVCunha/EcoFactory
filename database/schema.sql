-- Criação da tabela de Máquinas
CREATE TABLE maquinas (
    id SERIAL PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    setor VARCHAR(50) NOT NULL,
    tipo VARCHAR(50),
    status VARCHAR(20) DEFAULT 'Ativa',
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Produções (Relacionamento 1:N com Máquinas)
CREATE TABLE producoes (
    id SERIAL PRIMARY KEY,
    maquina_id INTEGER NOT NULL,
    produto VARCHAR(100) NOT NULL,
    quantidade_produzida INTEGER NOT NULL,
    quantidade_esperada INTEGER NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_maquina FOREIGN KEY (maquina_id) REFERENCES maquinas(id) ON DELETE CASCADE
);

-- Criação da tabela de Sustentabilidade
CREATE TABLE sustentabilidade (
    id SERIAL PRIMARY KEY,
    consumo_energia NUMERIC(10, 2) NOT NULL,
    consumo_agua NUMERIC(10, 2) NOT NULL,
    residuos NUMERIC(10, 2) NOT NULL,
    quantidade_reciclada NUMERIC(10, 2) NOT NULL,
    data DATE NOT NULL,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Criação da tabela de Ocorrências (SST)
CREATE TABLE ocorrencias (
    id SERIAL PRIMARY KEY,
    tipo VARCHAR(100) NOT NULL,
    local VARCHAR(100) NOT NULL,
    data DATE NOT NULL,
    nivel_risco VARCHAR(20) NOT NULL,
    descricao TEXT,
    medida_preventiva TEXT,
    criado_em TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);