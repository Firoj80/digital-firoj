
-- Create portfolios table
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[] NOT NULL DEFAULT '{}',
  category TEXT NOT NULL,
  featured BOOLEAN NOT NULL DEFAULT false,
  display_order INTEGER NOT NULL DEFAULT 0,
  enabled BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access (for main portfolio display)
CREATE POLICY "Public can view enabled portfolios" 
  ON public.portfolios 
  FOR SELECT 
  USING (enabled = true);

-- Create policy for admin access (for management)
CREATE POLICY "Admin can manage all portfolios" 
  ON public.portfolios 
  FOR ALL 
  USING (true)
  WITH CHECK (true);

-- Create storage bucket for portfolio images
INSERT INTO storage.buckets (id, name, public) 
VALUES ('portfolio-images', 'portfolio-images', true);

-- Create storage policy for portfolio images
CREATE POLICY "Public can view portfolio images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'portfolio-images');

CREATE POLICY "Admin can upload portfolio images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Admin can update portfolio images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'portfolio-images')
  WITH CHECK (bucket_id = 'portfolio-images');

CREATE POLICY "Admin can delete portfolio images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'portfolio-images');

-- Insert demo portfolio items
INSERT INTO public.portfolios (title, description, image_url, project_url, github_url, technologies, category, featured, display_order, enabled) VALUES
('E-commerce Platform', 'A full-stack e-commerce solution with React, Node.js, and Stripe integration. Features include user authentication, product catalog, shopping cart, and payment processing.', 'https://razvxhphfdbbhakaiskm.supabase.co/storage/v1/object/public/portfolio-images/ecommerce-demo.jpg', 'https://demo-ecommerce.example.com', 'https://github.com/example/ecommerce', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe', 'Tailwind CSS'], 'E-commerce', true, 1, true),
('Task Management App', 'A collaborative task management application with real-time updates, drag-and-drop functionality, and team collaboration features.', 'https://razvxhphfdbbhakaiskm.supabase.co/storage/v1/object/public/portfolio-images/task-app-demo.jpg', 'https://demo-tasks.example.com', 'https://github.com/example/task-manager', ARRAY['React', 'TypeScript', 'Supabase', 'Real-time', 'Drag & Drop'], 'Web Development', true, 2, true),
('AI Chat Assistant', 'An intelligent chat assistant powered by OpenAI GPT, featuring context-aware conversations and custom training capabilities.', 'https://razvxhphfdbbhakaiskm.supabase.co/storage/v1/object/public/portfolio-images/ai-chat-demo.jpg', 'https://demo-ai-chat.example.com', 'https://github.com/example/ai-chat', ARRAY['React', 'OpenAI', 'Python', 'FastAPI', 'WebSocket'], 'AI/ML', true, 3, true),
('Mobile Fitness App', 'A React Native fitness tracking app with workout planning, progress tracking, and social features for fitness enthusiasts.', 'https://razvxhphfdbbhakaiskm.supabase.co/storage/v1/object/public/portfolio-images/fitness-app-demo.jpg', 'https://apps.apple.com/app/fitness-demo', 'https://github.com/example/fitness-app', ARRAY['React Native', 'Redux', 'Firebase', 'Health Kit', 'Social Features'], 'Mobile Development', false, 4, true),
('Restaurant Management System', 'A comprehensive restaurant management system with POS integration, inventory management, and analytics dashboard.', 'https://razvxhphfdbbhakaiskm.supabase.co/storage/v1/object/public/portfolio-images/restaurant-demo.jpg', 'https://demo-restaurant.example.com', 'https://github.com/example/restaurant-pos', ARRAY['Vue.js', 'Laravel', 'MySQL', 'POS Integration', 'Analytics'], 'Web Development', false, 5, true),
('Cryptocurrency Tracker', 'A real-time cryptocurrency portfolio tracker with price alerts, market analysis, and trading insights.', 'https://razvxhphfdbbhakaiskm.supabase.co/storage/v1/object/public/portfolio-images/crypto-demo.jpg', 'https://demo-crypto.example.com', 'https://github.com/example/crypto-tracker', ARRAY['Next.js', 'Chart.js', 'WebSocket', 'API Integration', 'Real-time'], 'Web Development', false, 6, true);
