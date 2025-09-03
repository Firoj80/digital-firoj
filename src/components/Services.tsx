
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Code, Smartphone, Palette, Search, ShoppingCart, Users } from "lucide-react";

export const Services = () => {
  const services = [
    {
      icon: Code,
      title: "Web Development",
      description: "Custom websites built with modern technologies like React, Next.js, and TypeScript",
      features: ["Responsive Design", "SEO Optimized", "Fast Loading", "Secure"]
    },
    {
      icon: Smartphone,
      title: "Mobile App Development",
      description: "Native iOS and Android apps that deliver exceptional user experiences",
      features: ["Native Performance", "Cross-Platform", "App Store Ready", "Push Notifications"]
    },
    {
      icon: Palette,
      title: "UI/UX Design",
      description: "Beautiful, intuitive designs that convert visitors into customers",
      features: ["User Research", "Wireframing", "Prototyping", "Design Systems"]
    },
    {
      icon: Search,
      title: "SEO Optimization",
      description: "Boost your online visibility with comprehensive SEO strategies",
      features: ["Keyword Research", "On-Page SEO", "Technical SEO", "Analytics"]
    },
    {
      icon: ShoppingCart,
      title: "E-commerce Solutions",
      description: "Complete online stores that maximize sales and customer satisfaction",
      features: ["Payment Integration", "Inventory Management", "Order Tracking", "Analytics"]
    },
    {
      icon: Users,
      title: "Consulting & Strategy",
      description: "Expert guidance to help you make the right technology decisions",
      features: ["Technology Audit", "Roadmap Planning", "Team Training", "Ongoing Support"]
    }
  ];

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <section id="services" className="py-8 md:py-12 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12 md:mb-20">
          <div className="inline-flex items-center px-6 py-3 rounded-full glass mb-6 md:mb-8 fade-in">
            <div className="w-3 h-3 bg-gradient-to-r from-primary to-accent rounded-full mr-3 animate-pulse"></div>
            <span className="text-sm font-medium">Premium Services Portfolio</span>
          </div>
          <h2 className="text-4xl md:text-6xl font-bold mb-6">
            Our <span className="gradient-text">Services</span>
          </h2>
          <p className="text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
            From concept to launch, we provide end-to-end digital solutions that help your business grow and succeed in the digital landscape
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <Card key={index} className="premium-card border-2 border-blue-500/40 hover:border-blue-400/60 hover:scale-105 transition-all duration-300">
                <CardHeader className="pb-4">
                  <div className="w-16 h-16 gradient-bg rounded-xl flex items-center justify-center mb-6 mx-auto">
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  <CardTitle className="text-2xl text-center">{service.title}</CardTitle>
                  <CardDescription className="text-muted-foreground text-center text-base leading-relaxed">
                    {service.description}
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  <ul className="space-y-3 mb-8">
                    {service.features.map((feature, idx) => (
                      <li key={idx} className="flex items-center text-sm text-muted-foreground">
                        <div className="w-2 h-2 bg-gradient-to-r from-primary to-accent rounded-full mr-4 flex-shrink-0"></div>
                        {feature}
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant="outline" 
                    className="w-full border-2 border-primary/30 hover:border-primary/60 hover:bg-primary/10 transition-all duration-300"
                    onClick={() => scrollToSection('contact')}
                  >
                    Learn More
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <div className="text-center mt-20">
          <div className="premium-card p-8 rounded-2xl max-w-2xl mx-auto">
            <h3 className="text-2xl md:text-3xl font-bold mb-4">Ready to Start Your Project?</h3>
            <p className="text-muted-foreground mb-6 text-lg">Get a free consultation and discover how we can transform your digital presence</p>
            <Button 
              size="lg" 
              className="gradient-bg text-lg px-8 py-6 shadow-2xl hover:shadow-primary/20 transition-all duration-300"
              onClick={() => scrollToSection('quiz')}
            >
              Get Free Consultation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
