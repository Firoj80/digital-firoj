
-- Fix RLS policies to allow admin access to quiz leads and contact messages
CREATE POLICY "Admin can view all quiz leads" 
  ON public.quiz_leads 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can update quiz leads" 
  ON public.quiz_leads 
  FOR UPDATE 
  USING (true);

CREATE POLICY "Admin can view all contact messages" 
  ON public.contact_messages 
  FOR SELECT 
  USING (true);

CREATE POLICY "Admin can update contact messages" 
  ON public.contact_messages 
  FOR UPDATE 
  USING (true);
