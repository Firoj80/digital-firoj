
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
    )

    const { type, leadData } = await req.json()

    // Create email content based on type
    let subject = ''
    let htmlContent = ''

    if (type === 'quiz_lead') {
      subject = `🎯 New Quiz Lead: ${leadData.name}`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Quiz Lead Received!</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${leadData.name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            ${leadData.company ? `<p><strong>Company:</strong> ${leadData.company}</p>` : ''}
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Project Details</h3>
            <p><strong>Project Type:</strong> ${leadData.project_type}</p>
            <p><strong>Budget:</strong> ${leadData.budget}</p>
            <p><strong>Timeline:</strong> ${leadData.timeline}</p>
            <p><strong>Important Features:</strong> ${leadData.features}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${leadData.email}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply to ${leadData.name}
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            Lead received on ${new Date().toLocaleString()}
          </p>
        </div>
      `
    } else if (type === 'contact_form') {
      subject = `💬 New Contact Message: ${leadData.first_name} ${leadData.last_name}`
      htmlContent = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Message Received!</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Contact Information</h3>
            <p><strong>Name:</strong> ${leadData.first_name} ${leadData.last_name}</p>
            <p><strong>Email:</strong> ${leadData.email}</p>
            ${leadData.company ? `<p><strong>Company:</strong> ${leadData.company}</p>` : ''}
            ${leadData.project_type ? `<p><strong>Project Type:</strong> ${leadData.project_type}</p>` : ''}
          </div>

          <div style="background: #f0f9ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0;">Message</h3>
            <p style="white-space: pre-wrap;">${leadData.message}</p>
          </div>

          <div style="text-align: center; margin: 30px 0;">
            <a href="mailto:${leadData.email}" style="background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block;">
              Reply to ${leadData.first_name}
            </a>
          </div>

          <p style="color: #64748b; font-size: 14px;">
            Message received on ${new Date().toLocaleString()}
          </p>
        </div>
      `
    }

    // Log the email notification
    const { error: dbError } = await supabaseClient
      .from('email_notifications')
      .update({ 
        status: 'sent', 
        sent_at: new Date().toISOString() 
      })
      .eq('recipient_email', 'contact@digitalfiroj.com')
      .eq('template_type', type)
      .eq('status', 'pending')

    if (dbError) {
      console.error('Database error:', dbError)
    }

    // For now, we'll just log the email content
    // In production, you would integrate with an email service like SendGrid, Resend, etc.
    console.log('Email would be sent:', {
      to: 'contact@digitalfiroj.com',
      subject,
      html: htmlContent
    })

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Email notification processed successfully' 
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      },
    )

  } catch (error) {
    console.error('Error:', error)
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      },
    )
  }
})
