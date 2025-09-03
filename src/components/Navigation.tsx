
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { name: "Home", href: "#home" },
    { name: "Services", href: "#services" },
    { name: "Quiz", href: "#quiz" },
    { name: "Contact", href: "#contact" },
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId.replace('#', ''));
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
    setIsOpen(false);
  };

  const openWhatsApp = () => {
    const message = "Hi! I'm interested in scheduling a free consultation for my project.";
    const whatsappUrl = `https://wa.me/919279066556?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 glass">
      <div className="container mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          <div className="flex items-center space-x-4">
            <div className="w-12 h-12 gradient-bg rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-xl">DF</span>
            </div>
            <div>
              <div className="text-3xl font-bold gradient-text">
                Digital Firoj
              </div>
              <div className="text-sm text-muted-foreground">
                Premium Development Agency
              </div>
            </div>
          </div>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="text-foreground/80 hover:text-foreground transition-colors font-medium px-4 py-2 rounded-lg hover:bg-white/5"
              >
                {item.name}
              </button>
            ))}
            <Button variant="outline" className="ml-6 bg-gradient-to-r from-primary to-accent text-white border-0 hover:shadow-lg transition-all duration-300" onClick={openWhatsApp}>
              Free Consultation
            </Button>
          </div>

          {/* Mobile Navigation */}
          <div className="lg:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsOpen(!isOpen)}
              className="hover:bg-white/10"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isOpen && (
          <div className="lg:hidden py-6 border-t border-border">
            {navItems.map((item) => (
              <button
                key={item.name}
                onClick={() => scrollToSection(item.href)}
                className="block py-3 text-foreground/80 hover:text-foreground transition-colors w-full text-left font-medium hover:bg-white/5 rounded-lg px-4"
              >
                {item.name}
              </button>
            ))}
            <Button variant="outline" className="mt-6 w-full bg-gradient-to-r from-primary to-accent text-white border-0" onClick={openWhatsApp}>
              Free Consultation
            </Button>
          </div>
        )}
      </div>
    </nav>
  );
};
