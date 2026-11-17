-- Marks automated sends so the daily cron never emails the same person twice.
ALTER TABLE public.subscribers
  ADD COLUMN welcome_sent_at timestamptz,   -- day 0, sent right after confirmation
  ADD COLUMN welcome2_sent_at timestamptz,  -- day 3
  ADD COLUMN reminder_sent_at timestamptz;  -- service reminder (compared with last_service_date to allow one per year)
