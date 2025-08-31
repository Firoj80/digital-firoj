
import { Button } from "@/components/ui/button";
import { ArrowRight, Smartphone, Globe, Zap } from "lucide-react";

export const Hero = () => {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="home" className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/2 w-full h-full bg-gradient-to-br from-primary/20 to-accent/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-1/2 -left-1/2 w-full h-full bg-gradient-to-tr from-accent/20 to-primary/20 rounded-full blur-3xl"></div>
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-8 fade-in">
            <Zap className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm">Leading Digital Development Agency</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight fade-in">
            We Build{" "}
            <span className="gradient-text">Amazing</span>
            <br />
            Digital Experiences
          </h1>

          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto fade-in">
            Transforming ideas into stunning websites and mobile apps that drive results. 
            Expert development for web and mobile platforms.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12 fade-in">
            <Button 
              size="lg" 
              className="gradient-bg group"
              onClick={() => scrollToSection('quiz')}
            >
              Start Your Project
              <ArrowRight className="ml-2 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline"
              onClick={() => window.open('https://digitalfiroj.com/portfolio', '_blank')}
            >
              View Our Work
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="glass p-6 rounded-lg floating">
              <Globe className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Web Development</h3>
              <p className="text-muted-foreground">Modern, responsive websites that convert</p>
            </div>
            <div className="glass p-6 rounded-lg floating" style={{ animationDelay: '0.2s' }}>
              <Smartphone className="w-12 h-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Mobile Apps</h3>
              <p className="text-muted-foreground">Native iOS & Android applications</p>
            </div>
            <div className="glass p-6 rounded-lg floating" style={{ animationDelay: '0.4s' }}>
              <Zap className="w-12 h-12 text-primary mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Digital Strategy</h3>
              <p className="text-muted-foreground">Complete digital transformation</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
