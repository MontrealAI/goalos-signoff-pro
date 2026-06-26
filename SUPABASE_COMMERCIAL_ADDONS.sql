-- Optional commercial tables for GoalOS Signoff v1.0.0.
-- Run after SUPABASE_SETUP.sql only if you want to record billing/subscription state.

create table if not exists public.billing_customers (
  user_id uuid primary key references public.profiles(id) on delete cascade,
  stripe_customer_id text unique,
  plan text not null default 'free' check (plan in ('free','pro','team','enterprise')),
  status text not null default 'inactive' check (status in ('inactive','trialing','active','past_due','cancelled')),
  current_period_end timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.billing_events (
  id text primary key,
  user_id uuid references public.profiles(id) on delete set null,
  stripe_customer_id text,
  event_type text not null,
  payload jsonb not null default '{}'::jsonb,
  received_at timestamptz not null default now()
);

drop trigger if exists billing_customers_set_updated_at on public.billing_customers;
create trigger billing_customers_set_updated_at before update on public.billing_customers for each row execute function public.set_updated_at();

alter table public.billing_customers enable row level security;
alter table public.billing_events enable row level security;

drop policy if exists billing_customers_select_own on public.billing_customers;
create policy billing_customers_select_own on public.billing_customers for select using (user_id = auth.uid());

drop policy if exists billing_events_select_own on public.billing_events;
create policy billing_events_select_own on public.billing_events for select using (user_id = auth.uid());
