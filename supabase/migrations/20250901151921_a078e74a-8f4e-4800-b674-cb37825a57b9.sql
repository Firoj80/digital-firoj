
-- Create table for portfolio items
CREATE TABLE public.portfolios (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL,
  project_url TEXT,
  github_url TEXT,
  technologies TEXT[], -- Array of technology names
  category TEXT NOT NULL,
  featured BOOLEAN DEFAULT false,
  display_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.portfolios ENABLE ROW LEVEL SECURITY;

-- Create policy to allow public read access to portfolios
CREATE POLICY "Allow public read access to portfolios" ON public.portfolios FOR SELECT USING (true);

-- Create trigger for updated_at
CREATE TRIGGER update_portfolios_updated_at BEFORE UPDATE ON public.portfolios 
    FOR EACH ROW EXECUTE PROCEDURE update_updated_at_column();

-- Insert 6 sample portfolio items
INSERT INTO public.portfolios (title, description, image_url, project_url, github_url, technologies, category, featured, display_order) VALUES
('E-Commerce Platform', 'Full-stack e-commerce solution with React, Node.js, and Stripe integration', 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?w=500', 'https://example.com/ecommerce', 'https://github.com/user/ecommerce', ARRAY['React', 'Node.js', 'MongoDB', 'Stripe'], 'Web Development', true, 1),
('Task Management App', 'Collaborative task management application with real-time updates', 'https://images.unsplash.com/photo-1611224923853-80b023f02d71?w=500', 'https://example.com/taskapp', 'https://github.com/user/taskapp', ARRAY['React', 'Firebase', 'Material-UI'], 'Web Development', true, 2),
('Mobile Fitness Tracker', 'React Native fitness tracking app with health analytics', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=500', 'https://example.com/fitness', 'https://github.com/user/fitness', ARRAY['React Native', 'Redux', 'Chart.js'], 'Mobile Development', false, 3),
('AI Chat Bot', 'Intelligent chatbot powered by OpenAI with custom training', 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=500', 'https://example.com/chatbot', 'https://github.com/user/chatbot', ARRAY['Python', 'OpenAI', 'Flask', 'React'], 'AI/ML', true, 4),
('Restaurant Website', 'Modern restaurant website with online ordering system', 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=500', 'https://example.com/restaurant', 'https://github.com/user/restaurant', ARRAY['Next.js', 'Tailwind CSS', 'Sanity'], 'Web Development', false, 5),
('Cryptocurrency Dashboard', 'Real-time crypto portfolio tracker with market analytics', 'https://images.unsplash.com/photo-1621761191319-c6fb62004040?w=500', 'https://example.com/crypto', 'https://github.com/user/crypto', ARRAY['React', 'TypeScript', 'CoinGecko API', 'Recharts'], 'Web Development', false, 6);
