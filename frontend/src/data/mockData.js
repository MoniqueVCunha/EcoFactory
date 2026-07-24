// Dados fixos (mock) para a fase de Front-End (Encontro 4/5).
// A partir do Encontro 8 esses dados serão substituídos por chamadas reais à API.

export const maquinasIniciais = [
  { id: 1, nome: 'Torno CNC T-01', setor: 'Fundição', tipo: 'CNC', status: 'Operando', temperatura: 68, energia: 42 },
  { id: 2, nome: 'Fresadora F-03', setor: 'Montagem', tipo: 'Fresadora', status: 'Manutenção', temperatura: 45, energia: 28 },
  { id: 3, nome: 'Prensa P-07', setor: 'Pintura', tipo: 'Prensa', status: 'Parada', temperatura: 32, energia: 0 },
  { id: 4, nome: 'Robô Soldador R-12', setor: 'Montagem', tipo: 'Robótico', status: 'Operando', temperatura: 72, energia: 58 },
  { id: 5, nome: 'Compressor C-04', setor: 'Fundição', tipo: 'Compressor', status: 'Operando', temperatura: 55, energia: 35 },
  { id: 6, nome: 'Injetora I-09', setor: 'Embalagem', tipo: 'Injetora', status: 'Desativada', temperatura: 22, energia: 0 },
]

export const setores = ['Fundição', 'Montagem', 'Pintura', 'Embalagem', 'Logística', 'Admin']
export const tiposMaquina = ['CNC', 'Fresadora', 'Prensa', 'Robótico', 'Compressor', 'Injetora']
export const statusMaquina = ['Operando', 'Manutenção', 'Parada', 'Desativada']

export const producoesIniciais = [
  { id: 1, produto: 'Válvula V-200', quantidadeProduzida: 1240, quantidadeEsperada: 1200, maquinaId: 1, data: '2026-07-15' },
  { id: 2, produto: 'Eixo E-450', quantidadeProduzida: 890, quantidadeEsperada: 1000, maquinaId: 2, data: '2026-07-15' },
  { id: 3, produto: 'Engrenagem G-80', quantidadeProduzida: 2100, quantidadeEsperada: 2000, maquinaId: 4, data: '2026-07-14' },
  { id: 4, produto: 'Tampa T-15', quantidadeProduzida: 3400, quantidadeEsperada: 3500, maquinaId: 3, data: '2026-07-14' },
  { id: 5, produto: 'Flange F-22', quantidadeProduzida: 780, quantidadeEsperada: 800, maquinaId: 1, data: '2026-07-13' },
]

export const producaoMensal = [
  { mes: 'Jan', producao: 3800, meta: 4000 },
  { mes: 'Fev', producao: 3500, meta: 4000 },
  { mes: 'Mar', producao: 4200, meta: 4000 },
  { mes: 'Abr', producao: 4600, meta: 4300 },
  { mes: 'Mai', producao: 4400, meta: 4300 },
  { mes: 'Jun', producao: 4800, meta: 4500 },
  { mes: 'Jul', producao: 4750, meta: 4500 },
]

export const sustentabilidadeIniciais = [
  { id: 1, consumoEnergia: 800, consumoAgua: 310, residuos: 3.68, quantidadeReciclada: 3.2, data: '2026-07-15' },
]

export const consumoAguaMensal = [
  { mes: 'Jan', valor: 420 }, { mes: 'Fev', valor: 400 }, { mes: 'Mar', valor: 430 },
  { mes: 'Abr', valor: 380 }, { mes: 'Mai', valor: 350 }, { mes: 'Jun', valor: 320 }, { mes: 'Jul', valor: 310 },
]

export const consumoEnergiaMensal = [
  { mes: 'Jan', valor: 980 }, { mes: 'Fev', valor: 960 }, { mes: 'Mar', valor: 1000 },
  { mes: 'Abr', valor: 950 }, { mes: 'Mai', valor: 900 }, { mes: 'Jun', valor: 850 }, { mes: 'Jul', valor: 800 },
]

export const ocorrenciasIniciais = [
  { id: 1, tipo: 'Vazamento de óleo', local: 'Setor Fundição', data: '2026-07-14', risco: 'Alto', descricao: 'Vazamento detectado em tubulação', medidaPreventiva: 'Isolamento e reparo imediato' },
  { id: 2, tipo: 'Ruído excessivo', local: 'Montagem A3', data: '2026-07-13', risco: 'Médio', descricao: 'Nível acima de 85 dB permitidos', medidaPreventiva: 'EPI obrigatório e ajuste do maquinário' },
  { id: 3, tipo: 'Sobrecarga elétrica', local: 'Painel Elétrico B', data: '2026-07-12', risco: 'Crítico', descricao: 'Disjuntor disparou 3x em 2 horas', medidaPreventiva: 'Inspeção elétrica urgente' },
  { id: 4, tipo: 'Queda de objeto', local: 'Logística', data: '2026-07-11', risco: 'Baixo', descricao: 'Caixa caiu de prateleira alta', medidaPreventiva: 'Reforço das travas de segurança' },
  { id: 5, tipo: 'Temperatura elevada', local: 'Setor Pintura', data: '2026-07-10', risco: 'Médio', descricao: 'Forno acima de 200°C', medidaPreventiva: 'Calibração e monitoramento contínuo' },
]

export const niveisRisco = ['Baixo', 'Médio', 'Alto', 'Crítico']
