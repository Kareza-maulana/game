-- Run once in this project's Supabase SQL Editor.
-- Existing public.komentar table: text column komentar; id/created_at use defaults.
-- The browser receives only anon access. No service_role key is needed by the game.
begin;

alter table public.komentar enable row level security;
grant usage on schema public to anon;
grant insert (komentar) on public.komentar to anon;

do $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'public' and tablename = 'komentar'
      and policyname = 'cahaya_kadiri_submit_comment'
  ) then
    create policy cahaya_kadiri_submit_comment
      on public.komentar for insert to anon
      with check (char_length(btrim(komentar)) between 1 and 1500);
  end if;
end $$;

-- Applies only if id uses a serial/identity sequence; a UUID default needs no grant.
do $$
declare id_sequence text;
begin
  id_sequence := pg_get_serial_sequence('public.komentar', 'id');
  if id_sequence is not null then
    execute format('grant usage on sequence %s to anon', id_sequence);
  end if;
end $$;

commit;
