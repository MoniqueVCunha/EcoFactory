# Documentação Detalhada de Endpoints

## 1. Máquinas (`/maquinas`)
* **GET `/maquinas`**: Lista todas as máquinas.
  * *Response (200 OK)*: `[{"id": 1, "nome": "Torno CNC A1", "setor": "Usinagem", "tipo": "Torno", "status": "Em operação", "consumo_energia": 45, "temperatura": 68}]`
* **POST `/maquinas`**: Cadastra nova máquina.
  * *Request*: `{"nome": "Prensa P3", "setor": "Estamparia", "tipo": "Prensa", "status": "Em operação", "consumo_energia": 60, "temperatura": 70}`
  * *Response (201 Created)*: `{"id": 4, "nome": "Prensa P3", ...}`
* **PUT `/maquinas/:id`**: Atualiza dados de uma máquina.
* **DELETE `/maquinas/:id`**: Exclui uma máquina.

## 2. Produção (`/producoes`)
* **GET `/producoes`**: Lista registros de produção.
* **POST `/producoes`**: Cria novo registro.
* **DELETE `/producoes/:id`**: Apaga registro.

## 3. Sustentabilidade (`/sustentabilidade`)
* **GET `/sustentabilidade`**: Lista métricas ambientais.
* **POST `/sustentabilidade`**: Adiciona registro de resíduos/água.

## 4. Ocorrências (`/ocorrencias`)
* **GET `/ocorrencias`**: Lista ocorrências de segurança.
* **POST `/ocorrencias`**: Registra nova ocorrência.

## 5. Dashboard (`/dashboard`)
* **GET `/dashboard`**: Consolida todos os indicadores da fábrica.