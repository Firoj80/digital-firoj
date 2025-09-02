
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, CheckCircle, Star, Zap, Target, Award } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";

export const LeadQuiz = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    company: "",
    projectType: [] as string[],
    budget: "",
    timeline: "",
    features: [] as string[]
  });

  const questions = [
    {
      id: "contact",
      title: "Let's get to know you",
      description: "Tell us about yourself and your project",
      type: "contact",
      icon: Target
    },
    {
      id: "project",
      title: "What services do you need?",
      description: "Select all the services that apply to your project",
      type: "checkbox",
      icon: Zap,
      options: [
        "Website Development",
        "Mobile App Development", 
        "E-commerce Platform",
        "Custom Software",
        "Digital Marketing",
        "UI/UX Design",
        "SEO Optimization",
        "Social Media Management",
        "Content Creation",
        "Branding & Logo Design"
      ]
    },
    {
      id: "budget",
      title: "What's your project budget?",
      description: "This helps us tailor our recommendations",
      type: "radio",
      icon: Award,
      options: [
        "Under ₹50,000",
        "₹50,000 - ₹1,50,000",
        "₹1,50,000 - ₹5,00,000",
        "₹5,00,000 - ₹10,00,000",
        "Above ₹10,00,000"
      ]
    },
    {
      id: "timeline",
      title: "When do you need this completed?",
      description: "Select your preferred timeline",
      type: "radio",
      icon: Target,
      options: [
        "ASAP (Rush project)",
        "Within 1 month",
        "2-3 months",
        "3-6 months",
        "6+ months",
        "Flexible timeline"
      ]
    },
    {
      id: "features",
      title: "What features do you need?",
      description: "Select all that apply to your project",
      type: "checkbox",
      icon: Star,
      options: [
        "User Authentication",
        "Payment Integration",
        "Database Management",
        "Real-time Features",
        "API Integration",
        "Admin Dashboard",
        "Mobile Responsive",
        "SEO Optimization",
        "Analytics & Reporting",
        "Content Management",
        "Social Media Integration",
        "Multi-language Support"
      ]
    }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProjectTypeToggle = (service: string) => {
    setFormData(prev => ({
      ...prev,
      projectType: prev.projectType.includes(service)
        ? prev.projectType.filter(s => s !== service)
        : [...prev.projectType, service]
    }));
  };

  const handleFeatureToggle = (feature: string) => {
    setFormData(prev => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter(f => f !== feature)
        : [...prev.features, feature]
    }));
  };

  const nextStep = () => {
    if (currentStep < questions.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const isStepValid = () => {
    const currentQuestion = questions[currentStep];
    switch (currentQuestion.id) {
      case "contact":
        return formData.name.trim() !== "" && formData.email.trim() !== "";
      case "project":
        return formData.projectType.length > 0;
      case "budget":
        return formData.budget !== "";
      case "timeline":
        return formData.timeline !== "";
      case "features":
        return formData.features.length > 0;
      default:
        return true;
    }
  };

  const submitQuiz = async () => {
    if (!isStepValid()) {
      toast({
        title: "Please complete all required fields",
        variant: "destructive"
      });
      return;
    }

    setIsSubmitting(true);

    try {
      console.log('Submitting quiz lead with data:', formData);
      
      const { error } = await supabase
        .from('quiz_leads')
        .insert({
          name: formData.name.trim(),
          email: formData.email.trim(),
          company: formData.company.trim() || null,
          project_type: formData.projectType.join(', '),
          budget: formData.budget,
          timeline: formData.timeline,
          features: formData.features.join(', '),
          status: 'new'
        });

      if (error) {
        console.error('Error saving quiz lead:', error);
        throw error;
      }

      console.log('Quiz lead saved successfully');

      // Log email notification
      await supabase
        .from('email_notifications')
        .insert({
          recipient_email: 'contact@digitalfiroj.com',
          subject: `New Quiz Lead: ${formData.name}`,
          template_type: 'quiz_lead',
          status: 'pending'
        });

      toast({
        title: "Thank you for your submission!",
        description: "We'll contact you within 24 hours with a custom proposal."
      });

      // Move to success step
      setCurrentStep(questions.length);

    } catch (error) {
      console.error('Error submitting quiz:', error);
      toast({
        title: "Submission failed",
        description: "Please try again or contact us directly.",
        variant: "destructive"
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const openWhatsApp = () => {
    const message = `Hi! I just completed your project quiz. Here are my details:
Name: ${formData.name}
Email: ${formData.email}
Services: ${formData.projectType.join(', ')}
Budget: ${formData.budget}
Timeline: ${formData.timeline}

I'd like to discuss my project further.`;
    
    const whatsappUrl = `https://wa.me/919279066553?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  // Success screen
  if (currentStep >= questions.length) {
    return (
      <section id="quiz" className="py-20 relative">
        <div className="container mx-auto px-4">
          <Card className="max-w-2xl mx-auto glass border-0 bg-gradient-to-br from-green-50 to-blue-50">
            <CardContent className="p-8 text-center">
              <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-10 h-10 text-white" />
              </div>
              <h2 className="text-3xl font-bold mb-4 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
                Thank You!
              </h2>
              <p className="text-muted-foreground mb-6 text-lg">
                We've received your project details and will prepare a custom proposal for you. 
                Our team will contact you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700" onClick={openWhatsApp}>
                  Chat on WhatsApp
                </Button>
                <Button variant="outline" onClick={() => window.location.reload()}>
                  Start New Quiz
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>
    );
  }

  const currentQuestion = questions[currentStep];
  const progress = ((currentStep + 1) / questions.length) * 100;
  const IconComponent = currentQuestion.icon;

  return (
    <section id="quiz" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your <span className="bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">Free Quote</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few quick questions to receive a personalized proposal for your project
          </p>
        </div>

        <Card className="max-w-2xl mx-auto glass border-0 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground font-medium">
                Step {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground font-medium">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-3 mb-6">
              <div 
                className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-100 to-blue-100 rounded-full flex items-center justify-center">
                <IconComponent className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
                <CardDescription className="text-base">{currentQuestion.description}</CardDescription>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentQuestion.type === "contact" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name" className="text-sm font-medium">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="email" className="text-sm font-medium">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                      className="mt-1"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company" className="text-sm font-medium">Company Name (Optional)</Label>
                  <Input
                    id="company"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
            )}

            {currentQuestion.type === "radio" && (
              <RadioGroup
                value={formData[currentQuestion.id as keyof typeof formData] as string}
                onValueChange={(value) => handleInputChange(currentQuestion.id, value)}
                className="space-y-3"
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer font-medium flex-1">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "checkbox" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {currentQuestion.id === "project" ? (
                  currentQuestion.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                      <Checkbox
                        id={option}
                        checked={formData.projectType.includes(option)}
                        onCheckedChange={() => handleProjectTypeToggle(option)}
                      />
                      <Label htmlFor={option} className="cursor-pointer text-sm font-medium flex-1">
                        {option}
                      </Label>
                    </div>
                  ))
                ) : (
                  currentQuestion.options?.map((option) => (
                    <div key={option} className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-secondary/50 transition-colors">
                      <Checkbox
                        id={option}
                        checked={formData.features.includes(option)}
                        onCheckedChange={() => handleFeatureToggle(option)}
                      />
                      <Label htmlFor={option} className="cursor-pointer text-sm font-medium flex-1">
                        {option}
                      </Label>
                    </div>
                  ))
                )}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Previous
              </Button>

              {currentStep === questions.length - 1 ? (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center gap-2"
                  onClick={submitQuiz}
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Get My Quote"}
                  <Star className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  className="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 flex items-center gap-2"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Next
                  <ArrowRight className="w-4 h-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
            🔒 Your information is secure and will never be shared with third parties
          </p>
        </div>
      </div>
    </section>
  );
};
