# Helpdesk Support System

Sistema web para controle de O.S., clientes, orçamentos, vendas e financeiro.

## Funcionalidades
- Cadastro de cliente PF/PJ com consulta de CEP.
- O.S. com peças/serviços, status e financeiro.
- Orçamento com impressão e integração com O.S.
- Vendas com origem (`Direta`, `O.S.`, `Orçamento`) e recebimentos.
- Financeiro com total vendido, recebido e em aberto.
- Persistência atual no navegador (LocalStorage).

## Estrutura
- Front-end:
`index.html`, `style.css`, `script.js`, `chamados.html`, `clientes.html`, `orcamento.html`, `vendas.html`, `financeiro.html`
- Back-end local (novo):
`backend/`
- Script para Supabase:
`supabase/simple_schema.sql`

## Uso rápido (front atual)
1. Abra `index.html` no navegador.
2. Use o menu para acessar `Cliente`, `O.S.`, `Orçamento`, `Vendas` e `Financeiro`.

## Banco local (Opção 1: SQLite + API local)
1. Entre em `backend/`.
2. Copie `.env.example` para `.env`.
3. Deixe:
`DB_PROVIDER=sqlite`
4. Instale dependências:
`npm install`
5. Rode a API:
`npm start`

Banco será criado em:
`backend/data/helpdesk.db`

## Banco local em rede (Opção 2: PostgreSQL + API local)
1. Instale PostgreSQL na máquina servidor da rede.
2. Crie banco `helpdesk`.
3. No `backend/.env`, configure:
- `DB_PROVIDER=postgres`
- `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`
4. Rode:
`npm start`

Com isso, vários computadores da rede podem usar o mesmo backend (apontando para IP da máquina servidor).

## Supabase (para deixar online)
- Arquivo de criação simples:
`supabase/simple_schema.sql`
- Passos:
1. Crie o projeto no Supabase.
2. Abra SQL Editor.
3. Execute `supabase/simple_schema.sql`.

Esse script cria tabelas base (`clientes`, `ordens_servico`, `orcamentos`, `vendas`, `empresa`) e uma view simples de vendas por cliente.

## Observações
- Hoje o front ainda usa LocalStorage.
- O backend foi adicionado para evolução de uso local/rede e migração futura.
- Próximo passo natural: trocar `script.js` para consumir a API (`/api/...`) em vez do LocalStorage.

