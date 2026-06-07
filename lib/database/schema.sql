-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users table
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  full_name VARCHAR(255),
  phone VARCHAR(50),
  role VARCHAR(20) DEFAULT 'member' CHECK (role IN ('admin', 'member')),
  expire_date DATE NOT NULL DEFAULT CURRENT_DATE + INTERVAL '30 days',
  status VARCHAR(20) DEFAULT 'active' CHECK (status IN ('active', 'expired', 'disabled')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW())
);

-- Articles table
CREATE TABLE IF NOT EXISTS public.articles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  title VARCHAR(500) NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  cover_image TEXT,
  reading_time INTEGER DEFAULT 5,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  author_id UUID REFERENCES public.users(id) ON DELETE CASCADE
);

-- Article views table
CREATE TABLE IF NOT EXISTS public.article_views (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  article_id UUID REFERENCES public.articles(id) ON DELETE CASCADE,
  view_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  duration INTEGER DEFAULT 0,
  device VARCHAR(100),
  ip VARCHAR(50)
);

-- Login logs table
CREATE TABLE IF NOT EXISTS public.login_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES public.users(id) ON DELETE CASCADE,
  login_time TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  ip VARCHAR(50),
  device VARCHAR(255)
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON public.articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_article_views_user_id ON public.article_views(user_id);
CREATE INDEX IF NOT EXISTS idx_article_views_article_id ON public.article_views(article_id);
CREATE INDEX IF NOT EXISTS idx_login_logs_user_id ON public.login_logs(user_id);

-- Updated at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated at trigger
CREATE TRIGGER update_users_updated_at
  BEFORE UPDATE ON public.users
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_articles_updated_at
  BEFORE UPDATE ON public.articles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- Row Level Security Policies
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.article_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.login_logs ENABLE ROW LEVEL SECURITY;

-- Users policies
CREATE POLICY "Users can view own profile"
  ON public.users FOR SELECT
  USING (auth.uid()::text = id::text);

CREATE POLICY "Admins can view all users"
  ON public.users FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can insert users"
  ON public.users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

CREATE POLICY "Admins can update users"
  ON public.users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Articles policies
CREATE POLICY "Published articles are viewable by active members"
  ON public.articles FOR SELECT
  USING (
    published_at IS NOT NULL
    AND EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text
      AND status = 'active'
      AND expire_date >= CURRENT_DATE
    )
  );

CREATE POLICY "Admins can manage all articles"
  ON public.articles FOR ALL
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Article views policies
CREATE POLICY "Users can insert own views"
  ON public.article_views FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Users can view own views"
  ON public.article_views FOR SELECT
  USING (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all views"
  ON public.article_views FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Login logs policies
CREATE POLICY "Users can insert own login logs"
  ON public.login_logs FOR INSERT
  WITH CHECK (user_id::text = auth.uid()::text);

CREATE POLICY "Admins can view all login logs"
  ON public.login_logs FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.users
      WHERE id::text = auth.uid()::text AND role = 'admin'
    )
  );

-- Function to create user profile after auth signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.users (id, email, username, full_name, role, expire_date, status)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'username', NEW.email),
    NEW.raw_user_meta_data->>'full_name',
    COALESCE(NEW.raw_user_meta_data->>'role', 'member'),
    COALESCE(
      (NEW.raw_user_meta_data->>'expire_date')::date,
      CURRENT_DATE + INTERVAL '30 days'
    ),
    'active'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to create profile on signup
CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
