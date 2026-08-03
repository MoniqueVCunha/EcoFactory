## Relacionamentos

- maquinas (1) → producoes (N): uma máquina pode ter várias produções registradas.
  A tabela producoes possui a chave estrangeira maquina_id, que referencia maquinas.id.
- sustentabilidade: tabela independente, sem chave estrangeira.
- ocorrencias: tabela independente, sem chave estrangeira.