create or replace function create_config_table()
returns void
language plpgsql
security definer
as $$
begin
  create table if not exists config (
    id integer primary key,
    gelato_api_key text not null,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
  );
end;
$$; 