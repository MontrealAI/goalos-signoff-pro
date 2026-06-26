-- GoalOS Signoff MVP database
-- Paste this file into Supabase SQL Editor on a fresh project and click Run.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text check (display_name is null or char_length(display_name) <= 120),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.projects (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references public.profiles(id) on delete restrict,
  title text not null check (char_length(title) between 3 and 160),
  summary text not null check (char_length(summary) between 10 and 5000),
  status text not null default 'open' check (status in ('draft','open','submitted','changes_requested','accepted','rejected','archived')),
  deadline timestamptz,
  brief_version integer not null default 1 check (brief_version > 0),
  receipt_visibility text not null default 'private' check (receipt_visibility in ('private','link')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.project_members (
  project_id uuid not null references public.projects(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  role text not null check (role in ('client','builder','reviewer','observer')),
  invited_by uuid references public.profiles(id) on delete set null,
  joined_at timestamptz not null default now(),
  primary key (project_id, user_id)
);

create table if not exists public.acceptance_criteria (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  title text not null check (char_length(title) between 3 and 240),
  description text not null default '' check (char_length(description) <= 4000),
  required boolean not null default true,
  position integer not null default 0 check (position >= 0),
  created_at timestamptz not null default now()
);

create table if not exists public.invitations (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  email text not null,
  role text not null check (role in ('builder','reviewer','observer')),
  token_hash text not null unique check (token_hash ~ '^[a-f0-9]{64}$'),
  expires_at timestamptz not null,
  accepted_at timestamptz,
  created_by uuid not null references public.profiles(id) on delete restrict,
  created_at timestamptz not null default now()
);

create table if not exists public.upload_intents (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  created_by uuid not null references public.profiles(id) on delete cascade,
  storage_path text not null unique,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  expected_sha256 text not null check (expected_sha256 ~ '^[a-f0-9]{64}$'),
  description text not null default '' check (char_length(description) <= 1000),
  expires_at timestamptz not null,
  finalized_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists public.artifacts (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  uploaded_by uuid not null references public.profiles(id) on delete restrict,
  upload_intent_id uuid unique references public.upload_intents(id) on delete set null,
  storage_path text not null unique,
  filename text not null,
  mime_type text not null,
  size_bytes bigint not null check (size_bytes > 0 and size_bytes <= 26214400),
  sha256 text not null check (sha256 ~ '^[a-f0-9]{64}$'),
  description text not null default '' check (char_length(description) <= 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.submissions (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  version integer not null check (version > 0),
  submitted_by uuid not null references public.profiles(id) on delete restrict,
  summary text not null check (char_length(summary) between 20 and 10000),
  limitations text not null default '' check (char_length(limitations) <= 10000),
  ai_use_notes text not null default '' check (char_length(ai_use_notes) <= 10000),
  status text not null default 'submitted' check (status in ('submitted','changes_requested','accepted','rejected')),
  created_at timestamptz not null default now(),
  submitted_at timestamptz not null default now(),
  unique (project_id, version)
);

create table if not exists public.submission_artifacts (
  submission_id uuid not null references public.submissions(id) on delete cascade,
  artifact_id uuid not null references public.artifacts(id) on delete restrict,
  primary key (submission_id, artifact_id)
);

create table if not exists public.criterion_responses (
  submission_id uuid not null references public.submissions(id) on delete cascade,
  criterion_id uuid not null references public.acceptance_criteria(id) on delete restrict,
  status text not null check (status in ('met','partial','not_met','not_applicable')),
  response text not null check (char_length(response) between 1 and 10000),
  primary key (submission_id, criterion_id)
);

create table if not exists public.criterion_evidence (
  submission_id uuid not null references public.submissions(id) on delete cascade,
  criterion_id uuid not null references public.acceptance_criteria(id) on delete restrict,
  artifact_id uuid not null references public.artifacts(id) on delete restrict,
  primary key (submission_id, criterion_id, artifact_id)
);

create table if not exists public.mechanical_checks (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  code text not null,
  label text not null,
  status text not null check (status in ('pass','warning','fail')),
  detail text not null,
  created_at timestamptz not null default now(),
  unique (submission_id, code)
);

create table if not exists public.reviews (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null references public.submissions(id) on delete cascade,
  reviewer_id uuid not null references public.profiles(id) on delete restrict,
  recommendation text not null check (recommendation in ('accept','changes_requested','reject')),
  notes text not null check (char_length(notes) between 3 and 10000),
  created_at timestamptz not null default now(),
  unique (submission_id, reviewer_id)
);

create table if not exists public.decisions (
  id uuid primary key default gen_random_uuid(),
  submission_id uuid not null unique references public.submissions(id) on delete cascade,
  decided_by uuid not null references public.profiles(id) on delete restrict,
  decision text not null check (decision in ('accepted','changes_requested','rejected')),
  comment text not null check (char_length(comment) between 3 and 10000),
  created_at timestamptz not null default now()
);

create table if not exists public.receipts (
  id uuid primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  submission_id uuid not null unique references public.submissions(id) on delete restrict,
  public_id text not null unique,
  canonical_json jsonb not null,
  canonical_sha256 text not null check (canonical_sha256 ~ '^0x[a-f0-9]{64}$'),
  signature text not null,
  algorithm text not null default 'Ed25519' check (algorithm = 'Ed25519'),
  public_key_id text not null,
  public_key_pem text not null,
  issued_at timestamptz not null,
  revoked_at timestamptz,
  revocation_reason text check (revocation_reason is null or char_length(revocation_reason) between 3 and 1000),
  created_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  project_id uuid not null references public.projects(id) on delete cascade,
  actor_id uuid references public.profiles(id) on delete set null,
  event_type text not null,
  target_type text,
  target_id text,
  metadata jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists project_members_user_idx on public.project_members(user_id);
create index if not exists criteria_project_idx on public.acceptance_criteria(project_id, position);
create index if not exists invitations_project_idx on public.invitations(project_id, created_at desc);
create index if not exists artifacts_project_idx on public.artifacts(project_id, created_at desc);
create index if not exists submissions_project_idx on public.submissions(project_id, version desc);
create index if not exists checks_submission_idx on public.mechanical_checks(submission_id);
create index if not exists audit_project_idx on public.audit_events(project_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists projects_set_updated_at on public.projects;
create trigger projects_set_updated_at before update on public.projects for each row execute function public.set_updated_at();
drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at before update on public.profiles for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (new.id, new.email, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'participant'), '@', 1)))
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created after insert or update of email on auth.users for each row execute function public.handle_new_user();

create or replace function public.is_project_member(p_project_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select p_user_id is not null and p_user_id = auth.uid() and exists(select 1 from public.project_members pm where pm.project_id = p_project_id and pm.user_id = p_user_id);
$$;

create or replace function public.project_role(p_project_id uuid, p_user_id uuid default auth.uid())
returns text
language sql
stable
security definer set search_path = public
as $$
  select pm.role from public.project_members pm where p_user_id is not null and p_user_id = auth.uid() and pm.project_id = p_project_id and pm.user_id = p_user_id limit 1;
$$;

create or replace function public.can_manage_project(p_project_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select p_user_id is not null and p_user_id = auth.uid() and exists(
    select 1 from public.projects p
    where p.id = p_project_id and (p.owner_id = p_user_id or public.project_role(p_project_id, p_user_id) = 'client')
  );
$$;

create or replace function public.shares_project(p_other_user_id uuid, p_user_id uuid default auth.uid())
returns boolean
language sql
stable
security definer set search_path = public
as $$
  select p_user_id is not null and p_user_id = auth.uid() and exists(
    select 1 from public.project_members mine
    join public.project_members theirs on theirs.project_id = mine.project_id
    where mine.user_id = p_user_id and theirs.user_id = p_other_user_id
  );
$$;

create or replace function public.create_signoff_project(p_payload jsonb)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_project uuid;
  v_criterion jsonb;
  v_count integer := jsonb_array_length(coalesce(p_payload -> 'criteria', '[]'::jsonb));
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if v_count < 1 or v_count > 20 then raise exception 'Provide between 1 and 20 acceptance criteria'; end if;

  insert into public.projects(owner_id, title, summary, deadline, receipt_visibility)
  values (
    v_user,
    trim(p_payload ->> 'title'),
    trim(p_payload ->> 'summary'),
    nullif(p_payload ->> 'deadline', '')::timestamptz,
    coalesce(nullif(p_payload ->> 'receipt_visibility', ''), 'private')
  ) returning id into v_project;

  insert into public.project_members(project_id, user_id, role, invited_by)
  values (v_project, v_user, 'client', v_user);

  for v_criterion in select * from jsonb_array_elements(p_payload -> 'criteria')
  loop
    insert into public.acceptance_criteria(project_id, title, description, required, position)
    values (
      v_project,
      trim(v_criterion ->> 'title'),
      coalesce(trim(v_criterion ->> 'description'), ''),
      coalesce((v_criterion ->> 'required')::boolean, true),
      coalesce((v_criterion ->> 'position')::integer, 0)
    );
  end loop;

  insert into public.audit_events(project_id, actor_id, event_type, target_type, target_id, metadata)
  values (v_project, v_user, 'project.created', 'project', v_project::text, jsonb_build_object('briefVersion', 1));

  return v_project;
end;
$$;

drop function if exists public.create_signoff_submission(uuid,text,text,text,uuid[],jsonb,jsonb);
drop function if exists public.create_signoff_submission(uuid,text,text,text,uuid[],jsonb);
create or replace function public.create_signoff_submission(
  p_project_id uuid,
  p_summary text,
  p_limitations text,
  p_ai_use_notes text,
  p_artifact_ids uuid[],
  p_responses jsonb
)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_submission uuid;
  v_version integer;
  v_item jsonb;
  v_artifact text;
  v_role text;
  v_criteria_count integer;
  v_response_count integer;
  v_required_count integer;
  v_required_answered integer;
  v_required_evidenced integer;
  v_artifact_count integer;
  v_mapped_artifact_count integer;
  v_partial_count integer;
  v_not_met_count integer;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  v_role := public.project_role(p_project_id, v_user);
  if v_role not in ('client','builder') then raise exception 'Only the client or builder may submit work'; end if;

  perform 1 from public.projects where id = p_project_id for update;
  if not found then raise exception 'Project not found'; end if;
  if exists(select 1 from public.projects where id = p_project_id and status in ('accepted','archived')) then raise exception 'Project is closed'; end if;
  if exists(select 1 from public.submissions where project_id = p_project_id and status = 'submitted') then raise exception 'The current submission must receive a decision before a revision is created'; end if;
  if coalesce(array_length(p_artifact_ids, 1), 0) < 1 then raise exception 'At least one artifact is required'; end if;
  if (select count(*) from unnest(p_artifact_ids)) <> (select count(distinct aid) from unnest(p_artifact_ids) aid) then raise exception 'Duplicate artifact identifiers are not allowed'; end if;
  if exists(select 1 from unnest(p_artifact_ids) aid where not exists(select 1 from public.artifacts a where a.id = aid and a.project_id = p_project_id)) then raise exception 'Artifact does not belong to project'; end if;

  select count(*) into v_criteria_count from public.acceptance_criteria where project_id = p_project_id;
  select count(*), count(distinct (item ->> 'criterion_id')) into v_response_count, v_required_answered
  from jsonb_array_elements(coalesce(p_responses, '[]'::jsonb)) item;
  if v_response_count <> v_criteria_count or v_required_answered <> v_criteria_count then raise exception 'Answer every acceptance criterion exactly once'; end if;

  select coalesce(max(version), 0) + 1 into v_version from public.submissions where project_id = p_project_id;
  insert into public.submissions(project_id, version, submitted_by, summary, limitations, ai_use_notes)
  values (p_project_id, v_version, v_user, trim(p_summary), trim(p_limitations), trim(p_ai_use_notes))
  returning id into v_submission;

  insert into public.submission_artifacts(submission_id, artifact_id)
  select v_submission, aid from unnest(p_artifact_ids) aid;

  for v_item in select * from jsonb_array_elements(p_responses)
  loop
    if not exists(select 1 from public.acceptance_criteria c where c.id = (v_item ->> 'criterion_id')::uuid and c.project_id = p_project_id) then
      raise exception 'Criterion does not belong to project';
    end if;
    insert into public.criterion_responses(submission_id, criterion_id, status, response)
    values (v_submission, (v_item ->> 'criterion_id')::uuid, v_item ->> 'status', trim(v_item ->> 'response'));
    for v_artifact in select jsonb_array_elements_text(coalesce(v_item -> 'artifact_ids', '[]'::jsonb))
    loop
      if not (v_artifact::uuid = any(p_artifact_ids)) then raise exception 'Evidence artifact is not included in this submission'; end if;
      if not exists(select 1 from public.artifacts a where a.id = v_artifact::uuid and a.project_id = p_project_id) then raise exception 'Evidence artifact does not belong to project'; end if;
      insert into public.criterion_evidence(submission_id, criterion_id, artifact_id)
      values (v_submission, (v_item ->> 'criterion_id')::uuid, v_artifact::uuid);
    end loop;
  end loop;

  select count(*) into v_required_count from public.acceptance_criteria where project_id = p_project_id and required;
  select count(*) into v_required_answered
  from public.acceptance_criteria c join public.criterion_responses r on r.criterion_id = c.id and r.submission_id = v_submission
  where c.project_id = p_project_id and c.required and length(trim(r.response)) > 0 and r.status <> 'not_met';
  select count(*) into v_required_evidenced
  from public.acceptance_criteria c
  where c.project_id = p_project_id and c.required and exists(
    select 1 from public.criterion_evidence e where e.submission_id = v_submission and e.criterion_id = c.id
  );
  select count(*) into v_artifact_count from public.submission_artifacts where submission_id = v_submission;
  select count(*) into v_mapped_artifact_count from public.submission_artifacts sa where sa.submission_id = v_submission and exists(
    select 1 from public.criterion_evidence e where e.submission_id = v_submission and e.artifact_id = sa.artifact_id
  );
  select count(*) filter (where status = 'partial'), count(*) filter (where status = 'not_met')
  into v_partial_count, v_not_met_count from public.criterion_responses where submission_id = v_submission;

  if v_required_answered <> v_required_count then raise exception 'Every required criterion must have a substantive response and cannot be marked unmet'; end if;
  if v_required_evidenced <> v_required_count then raise exception 'Every required criterion must reference at least one artifact'; end if;
  if v_not_met_count > 0 then raise exception 'A package with an unmet criterion is not ready to submit'; end if;

  insert into public.mechanical_checks(submission_id, code, label, status, detail) values
    (v_submission, 'submission_summary', 'Delivery summary supplied', 'pass', 'The submission explains what was delivered.'),
    (v_submission, 'required_criteria_answered', 'Required criteria answered', 'pass', format('%s/%s required criteria have a substantive response and are not marked unmet.', v_required_answered, v_required_count)),
    (v_submission, 'required_criteria_evidence', 'Required criteria linked to evidence', 'pass', format('%s/%s required criteria reference at least one artifact.', v_required_evidenced, v_required_count)),
    (v_submission, 'artifact_integrity', 'Artifact fingerprints recorded', 'pass', format('%s artifact hashes are present and server-verified.', v_artifact_count)),
    (v_submission, 'artifact_mapping', 'Evidence is mapped to criteria', case when v_mapped_artifact_count = v_artifact_count then 'pass' else 'warning' end, format('%s/%s artifacts are linked to at least one acceptance criterion.', v_mapped_artifact_count, v_artifact_count)),
    (v_submission, 'limitations_disclosed', 'Limitations disclosed', case when length(trim(p_limitations)) >= 10 then 'pass' else 'warning' end, case when length(trim(p_limitations)) >= 10 then 'Limitations and unresolved issues were disclosed.' else 'No substantive limitations statement was supplied.' end),
    (v_submission, 'ai_use_disclosed', 'AI use disclosed', case when length(trim(p_ai_use_notes)) >= 10 then 'pass' else 'warning' end, case when length(trim(p_ai_use_notes)) >= 10 then 'The submission describes where AI was or was not used.' else 'No substantive AI-use statement was supplied.' end),
    (v_submission, 'criterion_exceptions', 'Criterion exceptions surfaced', case when v_partial_count > 0 then 'warning' else 'pass' end, case when v_partial_count > 0 then format('%s criterion responses are marked partial and require reviewer judgment.', v_partial_count) else 'No criterion is marked partial or unmet.' end);

  update public.projects set status = 'submitted' where id = p_project_id;
  insert into public.audit_events(project_id, actor_id, event_type, target_type, target_id, metadata)
  values (p_project_id, v_user, 'submission.created', 'submission', v_submission::text, jsonb_build_object('version', v_version));
  return v_submission;
end;
$$;

create or replace function public.record_final_decision(p_submission_id uuid, p_decision text, p_comment text)
returns uuid
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_project uuid;
  v_status text;
  v_decision_id uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  select project_id, status into v_project, v_status from public.submissions where id = p_submission_id for update;
  if v_project is null then raise exception 'Submission not found'; end if;
  if not public.can_manage_project(v_project, v_user) then raise exception 'Only the client may make the final decision'; end if;
  if v_status <> 'submitted' then raise exception 'This submission is no longer open for a decision'; end if;
  if p_submission_id <> (select id from public.submissions where project_id = v_project order by version desc limit 1) then raise exception 'Only the latest submission may receive a decision'; end if;
  if p_decision not in ('accepted','changes_requested','rejected') then raise exception 'Invalid decision'; end if;
  if exists(select 1 from public.decisions where submission_id = p_submission_id) then raise exception 'A final decision already exists for this submission'; end if;
  if p_decision = 'accepted' and exists(select 1 from public.mechanical_checks where submission_id = p_submission_id and status = 'fail') then raise exception 'A submission with failed mechanical checks cannot be accepted'; end if;

  insert into public.decisions(submission_id, decided_by, decision, comment)
  values (p_submission_id, v_user, p_decision, trim(p_comment)) returning id into v_decision_id;
  update public.submissions set status = p_decision where id = p_submission_id;
  update public.projects set status = p_decision where id = v_project;
  insert into public.audit_events(project_id, actor_id, event_type, target_type, target_id, metadata)
  values (v_project, v_user, 'decision.recorded', 'decision', v_decision_id::text, jsonb_build_object('decision', p_decision));
  return v_decision_id;
end;
$$;

create or replace function public.revoke_signoff_receipt(p_public_id text, p_reason text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  v_user uuid := auth.uid();
  v_project uuid;
  v_receipt uuid;
begin
  if v_user is null then raise exception 'Authentication required'; end if;
  if char_length(trim(p_reason)) < 3 or char_length(trim(p_reason)) > 1000 then raise exception 'Provide a revocation reason between 3 and 1000 characters'; end if;

  select r.id, r.project_id into v_receipt, v_project
  from public.receipts r
  where r.public_id = p_public_id
  for update;
  if v_receipt is null then raise exception 'Receipt not found'; end if;
  if public.project_role(v_project, v_user) <> 'client' then raise exception 'Only the client may revoke a receipt'; end if;
  if exists(select 1 from public.receipts where id = v_receipt and revoked_at is not null) then raise exception 'Receipt is already revoked'; end if;

  update public.receipts
  set revoked_at = now(), revocation_reason = trim(p_reason)
  where id = v_receipt;

  insert into public.audit_events(project_id, actor_id, event_type, target_type, target_id, metadata)
  values (v_project, v_user, 'receipt.revoked', 'receipt', v_receipt::text, jsonb_build_object('reason', trim(p_reason), 'publicId', p_public_id));
  return true;
end;
$$;

alter table public.profiles enable row level security;
alter table public.projects enable row level security;
alter table public.project_members enable row level security;
alter table public.acceptance_criteria enable row level security;
alter table public.invitations enable row level security;
alter table public.upload_intents enable row level security;
alter table public.artifacts enable row level security;
alter table public.submissions enable row level security;
alter table public.submission_artifacts enable row level security;
alter table public.criterion_responses enable row level security;
alter table public.criterion_evidence enable row level security;
alter table public.mechanical_checks enable row level security;
alter table public.reviews enable row level security;
alter table public.decisions enable row level security;
alter table public.receipts enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "profiles self or shared project" on public.profiles;
drop policy if exists "profiles update self" on public.profiles;
drop policy if exists "projects visible to members" on public.projects;
drop policy if exists "projects client updates" on public.projects;
drop policy if exists "members visible to members" on public.project_members;
drop policy if exists "criteria visible to members" on public.acceptance_criteria;
drop policy if exists "criteria managed by client" on public.acceptance_criteria;
drop policy if exists "invitations visible to client" on public.invitations;
drop policy if exists "upload intents visible to creator" on public.upload_intents;
drop policy if exists "artifacts visible to members" on public.artifacts;
drop policy if exists "submissions visible to members" on public.submissions;
drop policy if exists "submission artifacts visible to members" on public.submission_artifacts;
drop policy if exists "responses visible to members" on public.criterion_responses;
drop policy if exists "criterion evidence visible to members" on public.criterion_evidence;
drop policy if exists "checks visible to members" on public.mechanical_checks;
drop policy if exists "reviews visible to members" on public.reviews;
drop policy if exists "reviewers create review" on public.reviews;
drop policy if exists "decisions visible to members" on public.decisions;
drop policy if exists "receipts visible to members" on public.receipts;
drop policy if exists "audit visible to members" on public.audit_events;

create policy "profiles self or shared project" on public.profiles for select to authenticated using (id = auth.uid() or public.shares_project(id));
create policy "projects visible to members" on public.projects for select to authenticated using (public.is_project_member(id));
create policy "members visible to members" on public.project_members for select to authenticated using (public.is_project_member(project_id));
create policy "criteria visible to members" on public.acceptance_criteria for select to authenticated using (public.is_project_member(project_id));
create policy "invitations visible to client" on public.invitations for select to authenticated using (public.can_manage_project(project_id));
create policy "upload intents visible to creator" on public.upload_intents for select to authenticated using (created_by = auth.uid() and public.is_project_member(project_id));
create policy "artifacts visible to members" on public.artifacts for select to authenticated using (public.is_project_member(project_id));
create policy "submissions visible to members" on public.submissions for select to authenticated using (public.is_project_member(project_id));
create policy "submission artifacts visible to members" on public.submission_artifacts for select to authenticated using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));
create policy "responses visible to members" on public.criterion_responses for select to authenticated using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));
create policy "criterion evidence visible to members" on public.criterion_evidence for select to authenticated using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));
create policy "checks visible to members" on public.mechanical_checks for select to authenticated using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));
create policy "reviews visible to members" on public.reviews for select to authenticated using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));
create policy "reviewers create review" on public.reviews for insert to authenticated with check (
  reviewer_id = auth.uid() and exists(
    select 1 from public.submissions s where s.id = submission_id and s.status = 'submitted' and public.project_role(s.project_id) in ('reviewer','client')
  )
);
create policy "decisions visible to members" on public.decisions for select to authenticated using (exists(select 1 from public.submissions s where s.id = submission_id and public.is_project_member(s.project_id)));
create policy "receipts visible to members" on public.receipts for select to authenticated using (public.is_project_member(project_id));
create policy "audit visible to members" on public.audit_events for select to authenticated using (public.is_project_member(project_id));

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'signoff-artifacts',
  'signoff-artifacts',
  false,
  26214400,
  array[
    'application/pdf','application/json','application/zip','application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'text/plain','text/markdown','text/csv','image/png','image/jpeg','image/webp'
  ]
)
on conflict (id) do update set public = false, file_size_limit = excluded.file_size_limit, allowed_mime_types = excluded.allowed_mime_types;

revoke all on function public.set_updated_at() from public;
revoke all on function public.handle_new_user() from public;
revoke all on function public.is_project_member(uuid,uuid) from public;
revoke all on function public.project_role(uuid,uuid) from public;
revoke all on function public.can_manage_project(uuid,uuid) from public;
revoke all on function public.shares_project(uuid,uuid) from public;
grant execute on function public.is_project_member(uuid,uuid) to authenticated;
grant execute on function public.project_role(uuid,uuid) to authenticated;
grant execute on function public.can_manage_project(uuid,uuid) to authenticated;
grant execute on function public.shares_project(uuid,uuid) to authenticated;
revoke all on function public.create_signoff_project(jsonb) from public;
revoke all on function public.create_signoff_submission(uuid,text,text,text,uuid[],jsonb) from public;
revoke all on function public.record_final_decision(uuid,text,text) from public;
revoke all on function public.revoke_signoff_receipt(text,text) from public;
grant execute on function public.create_signoff_project(jsonb) to authenticated;
grant execute on function public.create_signoff_submission(uuid,text,text,text,uuid[],jsonb) to authenticated;
grant execute on function public.record_final_decision(uuid,text,text) to authenticated;
grant execute on function public.revoke_signoff_receipt(text,text) to authenticated;
