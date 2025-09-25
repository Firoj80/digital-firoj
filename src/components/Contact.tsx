
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MessageCircle, Clock, Star } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const Contact = () => {
  const { toast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    company: "",
    projectType: "",
    message: ""
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({
      ...formData,
      [e.target.id]: e.target.value
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.message) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting contact form with data:', formData);
      
      // Save contact message to database
      const { error } = await supabase
        .from('contact_messages')
        .insert({
          first_name: formData.firstName,
          last_name: formData.lastName,
          email: formData.email,
          company: formData.company || null,
          project_type: formData.projectType || null,
          message: formData.message,
          status: 'new'
        });

      if (error) {
        console.error('Error saving contact message:', error);
        throw error;
      }

      console.log('Contact message saved successfully');

      // Log email notification request
      await supabase
        .from('email_notifications')
        .insert({
          recipient_email: 'contact@digitalfiroj.com',
          subject: `New Contact Message: ${formData.firstName} ${formData.lastName}`,
          template_type: 'contact_form',
          status: 'pending'
        });

      toast({
        title: "Message sent successfully!",
        description: "We'll get back to you within 24 hours."
      });

      // Reset form
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        company: "",
        projectType: "",
        message: ""
      });

    } catch (error) {
      console.error('Error submitting contact form:', error);
      
      // Fallback to mailto if database fails
      const subject = `New Project Inquiry from ${formData.firstName} ${formData.lastName}`;
      const body = `
Name: ${formData.firstName} ${formData.lastName}
Email: ${formData.email}
Company: ${formData.company || 'Not specified'}
Project Type: ${formData.projectType || 'Not specified'}

Message:
${formData.message}
      `;
      
      const mailtoLink = `mailto:contact@digitalfiroj.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
      window.location.href = mailtoLink;

      toast({
        title: "Opening email client",
        description: "Your email client will open with the pre-filled message."
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = "Hi! I'm interested in your digital services. Can we schedule a free consultation?";
    const whatsappUrl = `https://wa.me/919279066553?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="contact" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Ready to Start Your <span className="gradient-text">Project?</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Get in touch for a free consultation and let's turn your ideas into reality
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-6xl mx-auto">
          {/* Contact Information */}
          <div className="space-y-8">
            <div>
              <h3 className="text-2xl font-semibold mb-6">Get in Touch</h3>
              <p className="text-muted-foreground mb-8">
                We're here to help you build something amazing. Reach out to us for a free consultation 
                and let's discuss your project requirements.
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <Mail className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Email Us</h4>
                  <a 
                    href="mailto:contact@digitalfiroj.com" 
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    contact@digitalfiroj.com
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <Phone className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Call Us</h4>
                  <a 
                    href="tel:+919279066553" 
                    className="text-muted-foreground hover:text-accent transition-colors"
                  >
                    +91 92790 66553
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 gradient-bg rounded-lg flex items-center justify-center">
                  <Clock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h4 className="font-semibold">Response Time</h4>
                  <p className="text-muted-foreground">Within 2-4 hours</p>
                </div>
              </div>
            </div>

            <div className="glass p-6 rounded-lg">
              <div className="flex items-center mb-4">
                <Star className="w-5 h-5 text-accent mr-2" />
                <span className="font-semibold">Free Consultation</span>
              </div>
              <p className="text-sm text-muted-foreground mb-4">
                Schedule a free 30-minute consultation call to discuss your project requirements, 
                timeline, and get an initial quote.
              </p>
              <Button 
                className="w-full gradient-bg"
                onClick={openWhatsApp}
              >
                Chat on WhatsApp
              </Button>
            </div>
          </div>

          {/* Contact Form */}
          <Card className="glass border-2 border-blue-500/40">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageCircle className="w-5 h-5 mr-2 text-accent" />
                Send us a Message
              </CardTitle>
              <CardDescription>
                Fill out the form below and we'll get back to you within 24 hours
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="firstName">First Name *</Label>
                    <Input 
                      id="firstName" 
                      placeholder="John" 
                      value={formData.firstName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="lastName">Last Name *</Label>
                    <Input 
                      id="lastName" 
                      placeholder="Doe" 
                      value={formData.lastName}
                      onChange={handleInputChange}
                      disabled={isSubmitting}
                      required
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    placeholder="john@example.com" 
                    value={formData.email}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="company">Company (Optional)</Label>
                  <Input 
                    id="company" 
                    placeholder="Your Company Name" 
                    value={formData.company}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="projectType">Project Type</Label>
                  <Input 
                    id="projectType" 
                    placeholder="Website, Mobile App, E-commerce, etc." 
                    value={formData.projectType}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <Label htmlFor="message">Message *</Label>
                  <Textarea 
                    id="message" 
                    placeholder="Tell us about your project requirements, timeline, and any specific features you need..."
                    rows={5}
                    value={formData.message}
                    onChange={handleInputChange}
                    disabled={isSubmitting}
                    required
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gradient-bg" 
                  size="lg"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Sending..." : "Send Message"}
                </Button>

                <p className="text-xs text-muted-foreground text-center">
                  By submitting this form, you agree to our privacy policy and terms of service.
                </p>
              </form>
            </CardContent>
          </Card>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-20">
          <div className="glass p-8 rounded-lg max-w-2xl mx-auto">
            <h3 className="text-2xl font-semibold mb-4">
              Ready to Transform Your Digital Presence?
            </h3>
            <p className="text-muted-foreground mb-6">
              Join 100+ satisfied clients who've trusted us with their digital transformation
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                className="gradient-bg"
                onClick={() => scrollToSection('quiz')}
              >
                Schedule Free Consultation
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
