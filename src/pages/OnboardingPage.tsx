import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, ChevronLeft, CheckCircle, Users, CreditCard, MessageSquare, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { useAuth } from '@/contexts/AuthContext';

const onboardingSteps = [
  {
    title: "Welcome to PROJECT02!",
    description: "Let's get you started with a quick tour of our platform",
    icon: <CheckCircle className="h-12 w-12 text-primary" />,
    content: "PROJECT02 connects students with expert creators for academic projects, assignments, and custom work."
  },
  {
    title: "Browse & Discover",
    description: "Find projects that match your needs",
    icon: <Search className="h-12 w-12 text-primary" />,
    content: "Use our advanced filters to find projects by category, price range, delivery time, and creator ratings."
  },
  {
    title: "Connect with Creators",
    description: "Chat and collaborate with expert creators",
    icon: <MessageSquare className="h-12 w-12 text-primary" />,
    content: "Our messaging system lets you discuss requirements, share files, and track progress in real-time."
  },
  {
    title: "Secure Payments",
    description: "Safe and secure payment processing",
    icon: <CreditCard className="h-12 w-12 text-primary" />,
    content: "We use Paystack for secure payments. Your money is protected until you're satisfied with the work."
  },
  {
    title: "Join the Community",
    description: "Become part of our growing community",
    icon: <Users className="h-12 w-12 text-primary" />,
    content: "Rate creators, leave reviews, and help others make informed decisions. Build your reputation over time."
  }
];

export const OnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const navigate = useNavigate();
  const { profile } = useAuth();

  const nextStep = () => {
    if (currentStep < onboardingSteps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeOnboarding();
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeOnboarding = () => {
    // Mark onboarding as complete in localStorage
    localStorage.setItem('onboarding_completed', 'true');
    
    // Navigate based on user role
    if (profile?.role === 'student') {
      navigate('/student/dashboard');
    } else if (profile?.role === 'creator') {
      navigate('/creator/dashboard');
    } else if (profile?.role === 'admin') {
      navigate('/admin/dashboard');
    } else {
      navigate('/');
    }
  };

  const progress = ((currentStep + 1) / onboardingSteps.length) * 100;
  const step = onboardingSteps[currentStep];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-secondary/5 flex items-center justify-center p-4">
      <div className="w-full max-w-2xl">
        <Card className="border-0 shadow-xl">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              {step.icon}
            </div>
            <CardTitle className="text-2xl font-bold mb-2">{step.title}</CardTitle>
            <p className="text-muted-foreground">{step.description}</p>
            <div className="mt-4">
              <Progress value={progress} className="w-full" />
              <p className="text-sm text-muted-foreground mt-2">
                Step {currentStep + 1} of {onboardingSteps.length}
              </p>
            </div>
          </CardHeader>
          
          <CardContent className="pt-4">
            <div className="bg-muted/50 rounded-lg p-6 mb-8">
              <p className="text-center text-lg leading-relaxed">
                {step.content}
              </p>
            </div>
            
            <div className="flex justify-between items-center">
              <Button 
                variant="outline" 
                onClick={prevStep}
                disabled={currentStep === 0}
                className="flex items-center gap-2"
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              
              <div className="flex gap-2">
                {onboardingSteps.map((_, index) => (
                  <div
                    key={index}
                    className={`h-2 w-2 rounded-full transition-colors ${
                      index <= currentStep ? 'bg-primary' : 'bg-muted'
                    }`}
                  />
                ))}
              </div>
              
              <Button 
                onClick={nextStep}
                className="flex items-center gap-2"
              >
                {currentStep === onboardingSteps.length - 1 ? 'Get Started' : 'Next'}
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
            
            {currentStep === onboardingSteps.length - 1 && (
              <div className="mt-4 text-center">
                <Button 
                  variant="link" 
                  onClick={() => navigate('/')}
                  className="text-sm text-muted-foreground"
                >
                  Skip and go to homepage
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};