
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft, CheckCircle, Target } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export const LeadQuiz = () => {
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState({
    projectType: "",
    budget: "",
    timeline: "",
    features: "",
    name: "",
    email: "",
    company: ""
  });

  const questions = [
    {
      id: "projectType",
      title: "What type of project do you need?",
      type: "radio",
      options: [
        "Website Development",
        "Mobile App (iOS/Android)",
        "E-commerce Store",
        "Web Application",
        "Complete Digital Solution"
      ]
    },
    {
      id: "budget",
      title: "What's your budget range?",
      type: "radio",
      options: [
        "Under $5,000",
        "$5,000 - $15,000",
        "$15,000 - $30,000",
        "$30,000 - $50,000",
        "Above $50,000"
      ]
    },
    {
      id: "timeline",
      title: "When do you need it completed?",
      type: "radio",
      options: [
        "ASAP (Rush Job)",
        "Within 1 month",
        "2-3 months",
        "3-6 months",
        "No specific deadline"
      ]
    },
    {
      id: "features",
      title: "Which features are most important?",
      type: "radio",
      options: [
        "User Authentication & Profiles",
        "Payment Processing",
        "Admin Dashboard",
        "Real-time Features (Chat, Notifications)",
        "Third-party Integrations"
      ]
    }
  ];

  const handleAnswer = (questionId: string, value: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: value }));
  };

  const handleNext = () => {
    if (currentStep < questions.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = () => {
    if (!answers.name || !answers.email) {
      toast({
        title: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    // Here you would typically send the data to your backend
    console.log("Quiz submitted:", answers);
    
    toast({
      title: "Thank you for your submission!",
      description: "We'll contact you within 24 hours with a personalized proposal."
    });

    // Reset form
    setCurrentStep(0);
    setAnswers({
      projectType: "",
      budget: "",
      timeline: "",
      features: "",
      name: "",
      email: "",
      company: ""
    });
  };

  const progress = ((currentStep + 1) / (questions.length + 1)) * 100;

  return (
    <section id="quiz" className="py-20 relative">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 rounded-full glass mb-6">
            <Target className="w-4 h-4 mr-2 text-accent" />
            <span className="text-sm">Free Project Assessment</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Get Your <span className="gradient-text">Custom Quote</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Answer a few quick questions to receive a personalized proposal and timeline for your project
          </p>
        </div>

        <div className="max-w-2xl mx-auto">
          <Card className="glass border-0">
            <CardHeader>
              <div className="w-full bg-secondary rounded-full h-2 mb-4">
                <div 
                  className="gradient-bg h-2 rounded-full transition-all duration-300"
                  style={{ width: `${progress}%` }}
                ></div>
              </div>
              <CardTitle className="text-center">
                Step {currentStep + 1} of {questions.length + 1}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {currentStep < questions.length ? (
                <>
                  <div className="text-center">
                    <h3 className="text-2xl font-semibold mb-6">
                      {questions[currentStep].title}
                    </h3>
                    
                    <RadioGroup
                      value={answers[questions[currentStep].id as keyof typeof answers]}
                      onValueChange={(value) => handleAnswer(questions[currentStep].id, value)}
                      className="text-left space-y-4"
                    >
                      {questions[currentStep].options.map((option, index) => (
                        <div key={index} className="flex items-center space-x-3 p-3 rounded-lg hover:bg-secondary/50 transition-colors">
                          <RadioGroupItem value={option} id={`option-${index}`} />
                          <Label htmlFor={`option-${index}`} className="cursor-pointer flex-1">
                            {option}
                          </Label>
                        </div>
                      ))}
                    </RadioGroup>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button 
                      variant="outline" 
                      onClick={handleBack}
                      disabled={currentStep === 0}
                    >
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button 
                      onClick={handleNext}
                      disabled={!answers[questions[currentStep].id as keyof typeof answers]}
                      className="gradient-bg"
                    >
                      Next
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              ) : (
                <>
                  <div className="text-center">
                    <CheckCircle className="w-16 h-16 text-accent mx-auto mb-6" />
                    <h3 className="text-2xl font-semibold mb-6">
                      Almost Done! Tell us about yourself
                    </h3>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        value={answers.name}
                        onChange={(e) => handleAnswer("name", e.target.value)}
                        placeholder="Enter your full name"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={answers.email}
                        onChange={(e) => handleAnswer("email", e.target.value)}
                        placeholder="Enter your email address"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label htmlFor="company">Company Name</Label>
                      <Input
                        id="company"
                        value={answers.company}
                        onChange={(e) => handleAnswer("company", e.target.value)}
                        placeholder="Enter your company name (optional)"
                        className="mt-1"
                      />
                    </div>
                  </div>

                  <div className="flex justify-between pt-6">
                    <Button variant="outline" onClick={handleBack}>
                      <ArrowLeft className="w-4 h-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleSubmit} className="gradient-bg">
                      Get My Custom Quote
                      <CheckCircle className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};
