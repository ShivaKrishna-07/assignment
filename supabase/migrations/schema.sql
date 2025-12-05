
create extension if not exists "uuid-ossp";

create table leads (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  owner_id uuid,
  stage text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_leads_owner_id on leads(owner_id);
create index idx_leads_stage on leads(stage);
create index idx_leads_created_at on leads(created_at);

create table applications (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  lead_id uuid not null references leads(id) on delete cascade,
  status text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_applications_lead_id on applications(lead_id);

create table tasks (
  id uuid primary key default uuid_generate_v4(),
  tenant_id uuid not null,
  related_id uuid not null references applications(id) on delete cascade,
  title text,
  type text not null,
  status text default 'open',
  due_at timestamptz not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),

  constraint chk_due_date check (due_at >= created_at),

  constraint chk_task_type check (type in ('call', 'email', 'review'))
);

create index idx_tasks_due_at on tasks(due_at);


create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger trg_update_leads
before update on leads
for each row execute procedure set_updated_at();

create trigger trg_update_applications
before update on applications
for each row execute procedure set_updated_at();

create trigger trg_update_tasks
before update on tasks
for each row execute procedure set_updated_at();
