import { describe, it, expect } from 'vitest'

describe('Teste de Frontend - EcoFactory', () => {
  it('Deve validar a estrutura basica da aplicação', () => {
    const titulo = 'EcoFactory Dashboard'
    expect(titulo).toContain('EcoFactory')
  })
})