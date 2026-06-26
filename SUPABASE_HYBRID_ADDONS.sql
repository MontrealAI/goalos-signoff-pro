-- GoalOS Signoff Hybrid add-ons: optional IPFS + blockchain anchoring records.
-- Run after SUPABASE_SETUP.sql. This adds no custody, no escrow, and no token flows.

create table if not exists public.ipfs_objects (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete cascade,
  receipt_id uuid references public.receipts(id) on delete cascade,
  object_type text not null check (object_type in ('brief','evidence','review','decision','receipt','bundle')),
  cid text not null,
  sha256 text not null check (sha256 ~ '^sha256:[0-9a-f]{64}$'),
  encrypted boolean not null default false,
  metadata jsonb not null default '{}'::jsonb,
  created_by uuid references auth.users(id),
  created_at timestamptz not null default now()
);

create table if not exists public.blockchain_anchor_requests (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references public.receipts(id) on delete cascade,
  receipt_hash text not null check (receipt_hash ~ '^0x[0-9a-fA-F]{64}$'),
  public_id_hash text not null check (public_id_hash ~ '^0x[0-9a-fA-F]{64}$'),
  evidence_root text not null check (evidence_root ~ '^0x[0-9a-fA-F]{64}$'),
  receipt_cid text,
  evidence_cid text,
  accepted_at_unix bigint not null,
  requested_by uuid references auth.users(id),
  status text not null default 'queued' check (status in ('queued','anchored','failed','cancelled')),
  transaction_hash text,
  last_error text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.blockchain_anchors (
  id uuid primary key default gen_random_uuid(),
  receipt_id uuid not null references public.receipts(id) on delete cascade,
  receipt_hash text not null check (receipt_hash ~ '^0x[0-9a-fA-F]{64}$'),
  chain_id integer not null,
  contract_address text not null check (contract_address ~ '^0x[0-9a-fA-F]{40}$'),
  transaction_hash text not null check (transaction_hash ~ '^0x[0-9a-fA-F]{64}$'),
  block_number bigint,
  receipt_cid text,
  evidence_cid text,
  status text not null default 'anchored' check (status in ('anchored','revoked','superseded')),
  explorer_url text,
  created_at timestamptz not null default now(),
  unique(chain_id, contract_address, receipt_hash)
);

alter table public.ipfs_objects enable row level security;
alter table public.blockchain_anchor_requests enable row level security;
alter table public.blockchain_anchors enable row level security;

create policy "ipfs objects visible to project members"
  on public.ipfs_objects for select
  using (public.is_project_member(project_id, auth.uid()) or exists (select 1 from public.receipts r join public.projects p on p.id = r.project_id where r.id = receipt_id and p.receipt_visibility = 'link'));

create policy "project members can create ipfs object records"
  on public.ipfs_objects for insert
  with check (public.is_project_member(project_id, auth.uid()));

create policy "anchor requests visible to receipt project members"
  on public.blockchain_anchor_requests for select
  using (exists (select 1 from public.receipts r join public.projects p on p.id = r.project_id where r.id = receipt_id and public.is_project_member(p.id, auth.uid())));

create policy "anchor requests insert by receipt project members"
  on public.blockchain_anchor_requests for insert
  with check (exists (select 1 from public.receipts r join public.projects p on p.id = r.project_id where r.id = receipt_id and public.is_project_member(p.id, auth.uid())));

create policy "anchors visible for public verification and members"
  on public.blockchain_anchors for select
  using (true);

-- Writes to blockchain_anchors should use only the Supabase service-role key from the anchor relayer.
-- Do not grant ordinary user INSERT/UPDATE policies for blockchain_anchors.

create index if not exists ipfs_objects_project_idx on public.ipfs_objects(project_id);
create index if not exists ipfs_objects_receipt_idx on public.ipfs_objects(receipt_id);
create index if not exists blockchain_anchor_requests_receipt_idx on public.blockchain_anchor_requests(receipt_id);
create index if not exists blockchain_anchor_requests_status_idx on public.blockchain_anchor_requests(status, created_at);
create index if not exists blockchain_anchors_receipt_idx on public.blockchain_anchors(receipt_id);
create index if not exists blockchain_anchors_tx_idx on public.blockchain_anchors(transaction_hash);
