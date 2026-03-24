-- uso opcional
-- rode no SQL Editor do Supabase
-- foco: Cliente + O.S. + Vendas + Empresa

create table if not exists public.clientes (
  id text primary key,
  tipo_cadastro text not null check (tipo_cadastro in ('PF', 'PJ')),
  nome_exibicao text not null,
  documento text not null,
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.ordens_servico (
  id text primary key,
  cliente_id text references public.clientes(id),
  status_servico text not null default 'Aberto',
  dados jsonb not null default '{}'::jsonb,
  total numeric(12,2) not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.vendas (
  numero text primary key,
  cliente_id text references public.clientes(id),
  origem_tipo text not null check (origem_tipo in ('Direta', 'OS')),
  origem_id text,
  status_recebimento text not null default 'Pendente' check (status_recebimento in ('Pendente', 'Parcial', 'Recebido')),
  dados jsonb not null default '{}'::jsonb,
  valor_total numeric(12,2) not null default 0,
  valor_recebido numeric(12,2) not null default 0,
  data_venda date,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.empresa (
  id text primary key default 'principal',
  dados jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists idx_os_cliente on public.ordens_servico (cliente_id);
create index if not exists idx_vendas_cliente on public.vendas (cliente_id);
create index if not exists idx_vendas_data on public.vendas (data_venda);

create or replace view public.vw_vendas_por_cliente as
select
  c.id as cliente_id,
  c.nome_exibicao,
  count(v.numero) as qtd_vendas,
  coalesce(sum(v.valor_total), 0) as total_vendido,
  coalesce(sum(v.valor_recebido), 0) as total_recebido,
  coalesce(sum(v.valor_total - v.valor_recebido), 0) as total_aberto
from public.clientes c
left join public.vendas v on v.cliente_id = c.id
group by c.id, c.nome_exibicao;

-- opcional: RLS basico
-- alter table public.clientes enable row level security;
-- alter table public.ordens_servico enable row level security;
-- alter table public.vendas enable row level security;
-- alter table public.empresa enable row level security;
-- create policy p_cli on public.clientes for all to authenticated using (true) with check (true);
-- create policy p_os on public.ordens_servico for all to authenticated using (true) with check (true);
-- create policy p_vd on public.vendas for all to authenticated using (true) with check (true);
-- create policy p_emp on public.empresa for all to authenticated using (true) with check (true);
