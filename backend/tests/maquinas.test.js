const request = require('supertest');

// Simula a conexão com o banco de dados (mock do PG) antes de carregar o app
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn((cb) => cb && cb(null, {}, jest.fn())),
    query: jest.fn().mockResolvedValue({
      rows: [
        { id: 1, nome: 'Torno CNC', setor: 'Usinagem', tipo: 'Torno', status: 'Em operação', consumo_energia: 45, temperatura: 68 }
      ]
    }),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const app = require('../server');

describe('Testes das Rotas de Máquinas', () => {

  // ==========================================
  // GET /maquinas
  // ==========================================
  describe('GET /maquinas', () => {
    it('deve retornar status 200 e uma lista de máquinas', async () => {
      const response = await request(app).get('/maquinas');

      expect(response.statusCode).toBe(200);
      expect(Array.isArray(response.body)).toBe(true);
    });

    it('cada máquina retornada deve ter os campos esperados', async () => {
      const response = await request(app).get('/maquinas');

      expect(response.body[0]).toHaveProperty('id');
      expect(response.body[0]).toHaveProperty('nome');
      expect(response.body[0]).toHaveProperty('setor');
      expect(response.body[0]).toHaveProperty('status');
    });
  });

  // ==========================================
  // POST /maquinas
  // ==========================================
  describe('POST /maquinas', () => {
    it('deve cadastrar uma nova máquina com dados válidos e retornar 201', async () => {
      const novaMaquina = {
        nome: 'Prensa P3',
        setor: 'Estamparia',
        tipo: 'Prensa',
        status: 'Em operação',
        consumo_energia: 60,
        temperatura: 70
      };

      const response = await request(app).post('/maquinas').send(novaMaquina);

      expect(response.statusCode).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('deve retornar 400 se faltar o campo "nome"', async () => {
      const maquinaInvalida = {
        setor: 'Estamparia',
        tipo: 'Prensa'
      };

      const response = await request(app).post('/maquinas').send(maquinaInvalida);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 400 se faltar o campo "setor"', async () => {
      const maquinaInvalida = {
        nome: 'Prensa P3',
        tipo: 'Prensa'
      };

      const response = await request(app).post('/maquinas').send(maquinaInvalida);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 400 se faltar o campo "tipo"', async () => {
      const maquinaInvalida = {
        nome: 'Prensa P3',
        setor: 'Estamparia'
      };

      const response = await request(app).post('/maquinas').send(maquinaInvalida);

      expect(response.statusCode).toBe(400);
      expect(response.body).toHaveProperty('error');
    });

    it('deve retornar 400 ao enviar um corpo vazio', async () => {
      const response = await request(app).post('/maquinas').send({});

      expect(response.statusCode).toBe(400);
    });
  });

  // ==========================================
  // PUT /maquinas/:id
  // ==========================================
  describe('PUT /maquinas/:id', () => {
    it('deve atualizar uma máquina existente e retornar 200', async () => {
      const dadosAtualizados = {
        nome: 'Torno CNC A1 - Revisado',
        setor: 'Usinagem',
        tipo: 'Torno',
        status: 'Em manutenção',
        consumo_energia: 50,
        temperatura: 65
      };

      const response = await request(app).put('/maquinas/1').send(dadosAtualizados);

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('id');
    });
  });

  // ==========================================
  // DELETE /maquinas/:id
  // ==========================================
  describe('DELETE /maquinas/:id', () => {
    it('deve excluir uma máquina e retornar 200 com mensagem de confirmação', async () => {
      const response = await request(app).delete('/maquinas/1');

      expect(response.statusCode).toBe(200);
      expect(response.body).toHaveProperty('message');
      expect(response.body.message).toBe('Removido com sucesso!');
    });
  });

});