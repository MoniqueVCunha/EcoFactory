const request = require('supertest');

// Simula a conexão com o banco de dados (mock do PG) antes de carregar o app
jest.mock('pg', () => {
  const mPool = {
    connect: jest.fn((cb) => cb && cb(null, {}, jest.fn())),
    query: jest.fn().mockResolvedValue({
      rows: [
        { id: 1, nome: 'Torno CNC', setor: 'Usinagem', status: 'Em operação' }
      ]
    }),
    on: jest.fn(),
  };
  return { Pool: jest.fn(() => mPool) };
});

const app = require('../server');

describe('Testes das Rotas de Máquinas', () => {
  it('GET /maquinas deve retornar status 200 e uma lista', async () => {
    const response = await request(app).get('/maquinas');
    
    expect(response.statusCode).toBe(200);
    expect(Array.isArray(response.body)).toBe(true);
  });
});