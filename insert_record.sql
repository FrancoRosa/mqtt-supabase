-- 1. Create the function to archive the old record
create or replace function public.archive_sensecap_record()
returns trigger
language plpgsql
as $$
begin
  -- Check if the 'updated_at' column was actually changed.
  -- This prevents the trigger from running unnecessarily.
  if new.updated_at is distinct from old.updated_at then
    -- Insert the complete old row into the 'sensecap_records' table.
    -- It maps the 'id' from 'sensecap_latest' to 'sensecap_id' in 'sensecap_records'.
    -- This assumes all other relevant columns exist in both tables.
    insert into public.sensecap_records (sensecap_id, created_at, battery, motion, lat, lng, sos, position_status)
    values(old.id, old.updated_at, old.battery, old.motion, old.lat, old.lng, old.sos, old.position_status);
  end if;
  
  return new;
end;
$$;

-- 2. Create the trigger that calls the function
-- First, drop the existing trigger if you are re-creating it
drop trigger if exists on_sensecap_latest_update on public.sensecap_latest;

-- Create the trigger
create trigger on_sensecap_latest_update
  after update on public.sensecap_latest
  for each row execute function public.archive_sensecap_record();