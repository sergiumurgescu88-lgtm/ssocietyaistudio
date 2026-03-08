
-- Add missing columns to projects
ALTER TABLE public.projects
  ADD COLUMN IF NOT EXISTS url text,
  ADD COLUMN IF NOT EXISTS current_step integer DEFAULT 1,
  ADD COLUMN IF NOT EXISTS published_at timestamptz,
  ADD COLUMN IF NOT EXISTS thumbnail_url text,
  ADD COLUMN IF NOT EXISTS analytics jsonb DEFAULT '{"views":0,"likes":0,"comments":0,"shares":0,"clicks":0}'::jsonb,
  ADD COLUMN IF NOT EXISTS platforms jsonb DEFAULT '{}'::jsonb;

-- Add security fields to user_preferences
ALTER TABLE public.user_preferences
  ADD COLUMN IF NOT EXISTS last_login timestamptz,
  ADD COLUMN IF NOT EXISTS last_login_ip text,
  ADD COLUMN IF NOT EXISTS last_login_location text,
  ADD COLUMN IF NOT EXISTS failed_login_attempts integer DEFAULT 0;

-- Add resolved_at to activity_logs
ALTER TABLE public.activity_logs
  ADD COLUMN IF NOT EXISTS resolved_at timestamptz;
