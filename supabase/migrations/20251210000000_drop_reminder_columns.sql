-- Service reminders were removed; these columns are no longer used.
ALTER TABLE public.subscribers
  DROP COLUMN last_service_date,
  DROP COLUMN product_type,
  DROP COLUMN reminder_sent_at;
