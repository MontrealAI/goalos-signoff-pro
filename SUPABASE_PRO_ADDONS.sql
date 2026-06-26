-- GoalOS Signoff Pro v1.1.0 commercial workflow additions.
-- Run after SUPABASE_SETUP.sql and SUPABASE_HYBRID_ADDONS.sql.

create table if not exists public.signoff_templates (
  id text primary key,
  category text not null,
  title text not null,
  summary text not null,
  payload jsonb not null,
  active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.change_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  submission_id uuid references public.submissions(id) on delete set null,
  requested_by uuid not null references public.profiles(id) on delete restrict,
  status text not null default 'open' check (status in ('open','addressed','cancelled')),
  summary text not null check (char_length(summary) between 3 and 2000),
  created_at timestamptz not null default now(),
  resolved_at timestamptz
);

create table if not exists public.change_request_items (
  id uuid primary key default gen_random_uuid(),
  change_request_id uuid not null references public.change_requests(id) on delete cascade,
  criterion_id uuid references public.acceptance_criteria(id) on delete set null,
  severity text not null default 'normal' check (severity in ('minor','normal','major','blocker')),
  description text not null check (char_length(description) between 3 and 3000),
  suggested_fix text not null default '' check (char_length(suggested_fix) <= 3000),
  addressed_by_submission_id uuid references public.submissions(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists public.evidence_assistant_reports (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  readiness_score integer not null check (readiness_score between 0 and 100),
  status text not null check (status in ('ready_for_review','needs_attention','blocked')),
  report jsonb not null,
  generated_by text not null default 'deterministic-v1.1',
  created_at timestamptz not null default now()
);

create table if not exists public.pilot_events (
  id bigint generated always as identity primary key,
  organization_id uuid,
  project_id uuid references public.projects(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_name text not null,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create table if not exists public.invoice_records (
  id uuid primary key default gen_random_uuid(),
  project_id uuid references public.projects(id) on delete set null,
  receipt_id uuid references public.receipts(id) on delete set null,
  client_id uuid references public.profiles(id) on delete set null,
  amount_cents integer not null check (amount_cents >= 0),
  currency text not null default 'usd' check (char_length(currency) = 3),
  status text not null default 'draft' check (status in ('draft','sent','paid','void','uncollectible')),
  external_invoice_url text,
  memo text not null default '' check (char_length(memo) <= 2000),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

drop trigger if exists invoice_records_set_updated_at on public.invoice_records;
create trigger invoice_records_set_updated_at before update on public.invoice_records for each row execute function public.set_updated_at();

alter table public.signoff_templates enable row level security;
alter table public.change_requests enable row level security;
alter table public.change_request_items enable row level security;
alter table public.evidence_assistant_reports enable row level security;
alter table public.pilot_events enable row level security;
alter table public.invoice_records enable row level security;

drop policy if exists signoff_templates_select_active on public.signoff_templates;
create policy signoff_templates_select_active on public.signoff_templates for select using (active = true);

drop policy if exists change_requests_project_members on public.change_requests;
create policy change_requests_project_members on public.change_requests for select using (public.is_project_member(project_id));
drop policy if exists change_requests_create_reviewers_clients on public.change_requests;
create policy change_requests_create_reviewers_clients on public.change_requests for insert with check (public.project_role(project_id) in ('client','reviewer'));

drop policy if exists change_request_items_project_members on public.change_request_items;
create policy change_request_items_project_members on public.change_request_items for select using (exists(select 1 from public.change_requests cr where cr.id = change_request_id and public.is_project_member(cr.project_id)));

drop policy if exists evidence_assistant_reports_project_members on public.evidence_assistant_reports;
create policy evidence_assistant_reports_project_members on public.evidence_assistant_reports for select using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));

drop policy if exists pilot_events_insert_own on public.pilot_events;
create policy pilot_events_insert_own on public.pilot_events for insert with check (actor_id = auth.uid() or actor_id is null);
drop policy if exists pilot_events_select_project_members on public.pilot_events;
create policy pilot_events_select_project_members on public.pilot_events for select using (project_id is null or public.is_project_member(project_id));

drop policy if exists invoice_records_project_members on public.invoice_records;
create policy invoice_records_project_members on public.invoice_records for select using (project_id is null or public.is_project_member(project_id));

insert into public.signoff_templates (id, category, title, summary, payload)
values
('ai_research','AI research and strategy','AI Research & Strategy Signoff','Decision-ready report with current sources and visible uncertainty','{}'::jsonb),
('ai_automation','AI automation delivery','AI Workflow Automation Signoff','Automation pilot with happy path, failure path, human override, and rollback','{}'::jsonb),
('software_delivery','Software and product delivery','Software Feature Acceptance Signoff','Software delivery with tests, setup steps, screenshots, and known issues','{}'::jsonb),
('content_marketing','Content and marketing','Content Campaign Signoff','AI-assisted content with brand, factual, source, and publication-readiness checks','{}'::jsonb),
('grant_milestone','Grant and milestone review','Grant / Milestone Acceptance Signoff','Milestone acceptance with scope, evidence, and public/private boundaries','{}'::jsonb)
on conflict (id) do update set category = excluded.category, title = excluded.title, summary = excluded.summary, active = true;
