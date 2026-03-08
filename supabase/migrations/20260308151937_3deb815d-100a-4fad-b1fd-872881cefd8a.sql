
-- Projects table
CREATE TABLE public.projects (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'draft',
  duration INTEGER DEFAULT 60,
  audience TEXT[] DEFAULT '{}',
  keywords TEXT[] DEFAULT '{}',
  script TEXT,
  seo_content JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;

-- Users can only see their own projects
CREATE POLICY "Users can view own projects" ON public.projects
  FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create own projects" ON public.projects
  FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own projects" ON public.projects
  FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own projects" ON public.projects
  FOR DELETE TO authenticated
  USING (auth.uid() = user_id);

-- Assets storage bucket
INSERT INTO storage.buckets (id, name, public) VALUES ('assets', 'assets', true);

-- Storage RLS: users can upload to their own folder
CREATE POLICY "Users can upload own assets" ON storage.objects
  FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Users can view own assets" ON storage.objects
  FOR SELECT TO authenticated
  USING (bucket_id = 'assets' AND (storage.foldername(name))[1] = auth.uid()::text);

CREATE POLICY "Public can view assets" ON storage.objects
  FOR SELECT TO anon
  USING (bucket_id = 'assets');

CREATE POLICY "Users can delete own assets" ON storage.objects
  FOR DELETE TO authenticated
  USING (bucket_id = 'assets' AND (storage.foldername(name))[1] = auth.uid()::text);

-- Updated_at trigger
CREATE OR REPLACE FUNCTION public.update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER projects_updated_at
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at();

-- Enable realtime for projects
ALTER PUBLICATION supabase_realtime ADD TABLE public.projects;
