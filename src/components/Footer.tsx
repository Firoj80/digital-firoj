import { Button } from "@/components/ui/button";
import { Mail, Phone, MapPin, Linkedin, Twitter } from "lucide-react";

export const Footer = () => {
  const currentYear = new Date().getFullYear();

  const openWhatsApp = () => {
    const message = "Hi! I'm interested in your services and would like to discuss my project.";
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
    <footer className="relative py-16 mt-20">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-background to-background/50"></div>
      
      <div className="container mx-auto px-6 relative z-10">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          
          {/* Brand section */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-4 mb-6">
              <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-xl">DF</span>
              </div>
              <div>
                <div className="text-2xl font-bold gradient-text">Digital Firoj</div>
                <div className="text-sm text-muted-foreground">Premium Development Agency</div>
              </div>
            </div>
            <p className="text-muted-foreground leading-relaxed mb-6 max-w-md">
              Transforming ideas into stunning digital experiences. We specialize in creating modern websites and mobile applications that drive results for businesses worldwide.
            </p>
            <Button 
              className="gradient-bg shadow-lg hover:shadow-primary/20 transition-all duration-300"
              onClick={openWhatsApp}
            >
              Start Your Project
            </Button>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
            <div className="space-y-3">
              {[
                { name: "Home", id: "home" },
                { name: "Services", id: "services" },
                { name: "Portfolio", id: "portfolio" },
                { name: "Quiz", id: "quiz" },
                { name: "Contact", id: "contact" }
              ].map((link) => (
                <button
                  key={link.id}
                  onClick={() => scrollToSection(link.id)}
                  className="block text-muted-foreground hover:text-primary transition-colors hover:translate-x-1 duration-300"
                >
                  {link.name}
                </button>
              ))}
            </div>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Get in Touch</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Phone className="w-5 h-5 text-primary" />
                <span>+91 9279066553</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <Mail className="w-5 h-5 text-accent" />
                <span>hello@digitalfiroj.com</span>
              </div>
              <div className="flex items-center space-x-3 text-muted-foreground">
                <MapPin className="w-5 h-5 text-primary" />
                <span>India</span>
              </div>
            </div>

            {/* Social Links */}
            <div className="flex space-x-4 mt-6">
              {[
                { icon: Linkedin, href: "https://linkedin.com/company/digitalfiroj", label: "LinkedIn" },
                { icon: Twitter, href: "https://twitter.com/digitalfiroj", label: "Twitter" }
              ].map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={social.label}
                  className="w-10 h-10 rounded-lg bg-white/5 flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-all duration-300 hover:scale-110"
                >
                  <social.icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-border pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <p className="text-muted-foreground text-sm">
              © {currentYear} Digital Firoj. All rights reserved.
            </p>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <button className="hover:text-primary transition-colors">Privacy Policy</button>
              <button className="hover:text-primary transition-colors">Terms of Service</button>
              <button className="hover:text-primary transition-colors">Cookie Policy</button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
