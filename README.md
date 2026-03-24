# Helpdesk Support System

![Status](https://img.shields.io/badge/status-em%20desenvolvimento-yellow)

Sistema web para gestão de `Clientes`, `O.S.`, `Vendas` e `Financeiro`.

## Estado Atual
- Projeto funcional para uso local.
- Projeto ainda **não está 100% concluído**.
- Fluxo principal está ativo e usável.
- Persistência atual do front-end é via `LocalStorage`.
- Backend local com SQLite já existe, mas integração completa front/API ainda é etapa de evolução.

## Módulos Disponíveis
- `Dashboard`: visão de O.S., vendas e financeiro por período (`De`/`Até`).
- `Cliente`: cadastro PF/PJ, busca, edição e visualização.
- `O.S.`: abertura, edição, visualização, peças/serviços, status técnico e status comercial.
- `Vendas`: criação direta ou via O.S. aprovada, cálculo de total/desconto e acompanhamento.
- `Financeiro`: baixa de recebimento, quitação, filtros e impressão de relatório.
- `Empresa`: dados da empresa, logo e assinatura PNG para documentos.
- `Documentos`: impressão de recibo com layout customizado.

## Fluxo de Trabalho
1. Cadastrar cliente.
2. Abrir O.S.
3. Definir status comercial da O.S.:
- `Em orçamento`: não gera venda.
- `Aprovado`: habilita geração/abertura de venda.
- `Reprovado`: arquiva O.S. (com reativação manual).
4. Fechar venda e acompanhar recebimento no financeiro.

## Estrutura de Arquivos
- Entrada:
`index.html` (tela inicial), `dashboard.html` (sistema).
- Front-end:
`style.css`, `chamados.html`, `clientes.html`, `vendas.html`, `financeiro.html`, `js/`.
- Backend:
`backend/` (API Node.js com SQLite/PostgreSQL).
- SQL base:
`supabase/simple_schema.sql`.
- Aviso de status para GitHub:
`AVISO_GITHUB.md`.

## Como Rodar Local (Rápido)
1. Abra `index.html`.
2. Clique em `Entrar no sistema`.
3. Use normalmente os menus do sistema.

## Persistência Atual (Front)
Dados salvos no navegador, chaves:
- `helpdesk.chamados`
- `helpdesk.clientes`
- `helpdesk.vendas`
- `helpdesk.empresa`

Se limpar dados do navegador, os dados locais são perdidos.

## Backend Local (Opcional, preparado)
1. Entre em `backend/`.
2. Copie `backend/.env.local.example` para `backend/.env`.
3. Instale dependências:
`npm install`
4. Inicie a API:
`npm start`

Arquivo local do banco SQLite:
`backend/data/helpdesk.db`

## Opções de Banco de Dados
### 1) Local no PC (SQLite)
- Melhor para uso individual/local.
- Simples de instalar e manter.
- Arquivo único do banco em:
`backend/data/helpdesk.db`
- Arquivo de exemplo:
`backend/.env.local.example`

### 2) Online (Supabase/PostgreSQL)
- Melhor para uso remoto e compartilhado.
- Banco gerenciado online.
- Arquivo de exemplo:
`backend/.env.supabase.example`
- Campos principais:
- `DB_PROVIDER=postgres`
- `DATABASE_URL=<string do Supabase>`
- `PGSSL=true`
- `PGSSL_REJECT_UNAUTHORIZED=false`

Observação:
- Neste momento o front ainda usa `LocalStorage`.
- O backend já está pronto para evolução do projeto e integração completa.

## Limitações Conhecidas
- Sem autenticação de usuários.
- Sem sincronização multiusuário no modo LocalStorage.
- Sem integração completa front/API no fluxo padrão atual.
- Ajustes visuais e refinamentos ainda em andamento.

## Melhorias Planejadas
- Integrar front-end diretamente à API local.
- Melhorar trilha de auditoria de recebimentos e ações.
- Expandir testes de regressão por fluxo.
- Refinar documentos de impressão (layout e conteúdo).

## Aviso para Repositório Público
Use na descrição do GitHub:

`Projeto em desenvolvimento (não 100% concluído). Funcional para uso local, com melhorias em andamento.`

Arquivo pronto:
`AVISO_GITHUB.md`

## Segurança
- Não versionar segredos/chaves.
- A pasta `.local-keys/` deve permanecer local (já ignorada no `.gitignore`).
- Se alguma chave foi exposta, gere/rotacione uma nova imediatamente.
