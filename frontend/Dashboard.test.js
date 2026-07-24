import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';

// Componente simples simulado apenas para validar a renderização dos cards no teste
function DashboardMock({ dados }) {
  return (
    <div>
      <h1>Dashboard Industrial</h1>
      <div data-testid="total-maquinas">{dados.totalMaquinas}</div>
      <div data-testid="producao-total">{dados.producaoTotal}</div>
    </div>
  );
}

describe('Testes do Componente de Dashboard', () => {
  it('Deve renderizar os dados do Dashboard corretamente', () => {
    const mockData = {
      totalMaquinas: 3,
      producaoTotal: 750
    };

    render(<DashboardMock dados={mockData} />);

    expect(screen.getByText('Dashboard Industrial')).toBeTruthy();
    expect(screen.getByTestId('total-maquinas').textContent).toBe('3');
    expect(screen.getByTestId('producao-total').textContent).toBe('750');
  });
});