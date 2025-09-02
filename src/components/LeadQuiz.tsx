
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { ArrowRight, ArrowLeft, CheckCircle, Star } from "lucide-react";
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
    projectType: "",
    budget: "",
    timeline: "",
    features: [] as string[]
  });

  const questions = [
    {
      id: "contact",
      title: "Let's get to know you",
      description: "Tell us about yourself and your project",
      type: "contact"
    },
    {
      id: "project",
      title: "What type of project do you need?",
      description: "Select the type of digital solution you're looking for",
      type: "radio",
      options: [
        "Website Development",
        "Mobile App Development",
        "E-commerce Platform",
        "Custom Software",
        "Digital Marketing",
        "UI/UX Design",
        "Other"
      ]
    },
    {
      id: "budget",
      title: "What's your project budget?",
      description: "This helps us tailor our recommendations",
      type: "radio",
      options: [
        "Under $5,000",
        "$5,000 - $15,000",
        "$15,000 - $50,000",
        "$50,000 - $100,000",
        "Above $100,000"
      ]
    },
    {
      id: "timeline",
      title: "When do you need this completed?",
      description: "Select your preferred timeline",
      type: "radio",
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
        return formData.name && formData.email;
      case "project":
        return formData.projectType;
      case "budget":
        return formData.budget;
      case "timeline":
        return formData.timeline;
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
          name: formData.name,
          email: formData.email,
          company: formData.company || null,
          project_type: formData.projectType,
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
Project: ${formData.projectType}
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
          <Card className="max-w-2xl mx-auto glass border-0">
            <CardContent className="p-8 text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <CheckCircle className="w-8 h-8 text-green-600" />
              </div>
              <h2 className="text-2xl font-bold mb-4">Thank You!</h2>
              <p className="text-muted-foreground mb-6">
                We've received your project details and will prepare a custom proposal for you. 
                Our team will contact you within 24 hours.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button className="gradient-bg" onClick={openWhatsApp}>
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

  return (
    <section id="quiz" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your <span className="gradient-text">Free Quote</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few quick questions to receive a personalized proposal for your project
          </p>
        </div>

        <Card className="max-w-2xl mx-auto glass border-0">
          <CardHeader>
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-muted-foreground">
                Step {currentStep + 1} of {questions.length}
              </span>
              <span className="text-sm text-muted-foreground">
                {Math.round(progress)}% Complete
              </span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2 mb-4">
              <div 
                className="gradient-bg h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
            <CardTitle className="text-xl">{currentQuestion.title}</CardTitle>
            <CardDescription>{currentQuestion.description}</CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {currentQuestion.type === "contact" && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Full Name *</Label>
                    <Input
                      id="name"
                      placeholder="John Doe"
                      value={formData.name}
                      onChange={(e) => handleInputChange("name", e.target.value)}
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="email">Email Address *</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      required
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="company">Company Name (Optional)</Label>
                  <Input
                    id="company"
                    placeholder="Your Company"
                    value={formData.company}
                    onChange={(e) => handleInputChange("company", e.target.value)}
                  />
                </div>
              </div>
            )}

            {currentQuestion.type === "radio" && (
              <RadioGroup
                value={formData[currentQuestion.id as keyof typeof formData] as string}
                onValueChange={(value) => handleInputChange(currentQuestion.id, value)}
              >
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            )}

            {currentQuestion.type === "checkbox" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {currentQuestion.options?.map((option) => (
                  <div key={option} className="flex items-center space-x-2">
                    <Checkbox
                      id={option}
                      checked={formData.features.includes(option)}
                      onCheckedChange={() => handleFeatureToggle(option)}
                    />
                    <Label htmlFor={option} className="cursor-pointer text-sm">
                      {option}
                    </Label>
                  </div>
                ))}
              </div>
            )}

            <div className="flex justify-between pt-6">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 0}
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Previous
              </Button>

              {currentStep === questions.length - 1 ? (
                <Button
                  className="gradient-bg"
                  onClick={submitQuiz}
                  disabled={!isStepValid() || isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Get My Quote"}
                  <Star className="w-4 h-4 ml-2" />
                </Button>
              ) : (
                <Button
                  className="gradient-bg"
                  onClick={nextStep}
                  disabled={!isStepValid()}
                >
                  Next
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-8">
          <p className="text-sm text-muted-foreground">
            🔒 Your information is secure and will never be shared with third parties
          </p>
        </div>
      </div>
    </section>
  );
};
