import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Progress } from "@/components/ui/progress";
import { useState } from "react";
import { 
  Heart, 
  Calendar, 
  User, 
  Phone,
  MapPin,
  Baby,
  ArrowRight,
  CheckCircle
} from "lucide-react";
import { Link } from "react-router-dom";

const GetStarted = () => {
  const [step, setStep] = useState(1);
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  const nextStep = () => {
    if (step < totalSteps) {
      setStep(step + 1);
    }
  };

  const prevStep = () => {
    if (step > 1) {
      setStep(step - 1);
    }
  };

  const benefits = [
    {
      icon: Calendar,
      title: "Smart Reminders",
      description: "Never miss appointments or medications"
    },
    {
      icon: Heart,
      title: "Health Tracking",
      description: "Monitor your pregnancy progress weekly"
    },
    {
      icon: Baby,
      title: "Baby Development",
      description: "Track your baby's growth milestones"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-blue/5">
      {/* Navigation */}
      <nav className="fixed top-0 w-full bg-background/80 backdrop-blur-md border-b border-border/40 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-maternal rounded-full flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">MamaCare</span>
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/features" className="text-sm text-muted-foreground hover:text-primary transition-colors">Features</Link>
            <Link to="/support" className="text-sm text-muted-foreground hover:text-primary transition-colors">Support</Link>
          </div>
        </div>
      </nav>

      <div className="pt-24 pb-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {/* Progress Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Welcome to Your
              <span className="text-primary block">Pregnancy Journey</span>
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Let's set up your personalized pregnancy tracker in just a few steps
            </p>
            
            <div className="max-w-md mx-auto mb-8">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground mt-2">Step {step} of {totalSteps}</p>
            </div>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Form Section */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant">
                <CardContent className="p-8">
                  {step === 1 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-maternal rounded-full flex items-center justify-center mx-auto mb-4">
                          <User className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Personal Information</h2>
                        <p className="text-muted-foreground">Tell us about yourself</p>
                      </div>

                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="firstName">First Name</Label>
                          <Input id="firstName" placeholder="Enter your first name" />
                        </div>
                        <div>
                          <Label htmlFor="lastName">Last Name</Label>
                          <Input id="lastName" placeholder="Enter your last name" />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="email">Email Address</Label>
                        <Input id="email" type="email" placeholder="your.email@example.com" />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input id="phone" type="tel" placeholder="+254 700 123 456" />
                      </div>

                      <div>
                        <Label htmlFor="age">Age</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your age range" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="18-24">18-24 years</SelectItem>
                            <SelectItem value="25-29">25-29 years</SelectItem>
                            <SelectItem value="30-34">30-34 years</SelectItem>
                            <SelectItem value="35-39">35-39 years</SelectItem>
                            <SelectItem value="40+">40+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 2 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-maternal rounded-full flex items-center justify-center mx-auto mb-4">
                          <Calendar className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Pregnancy Details</h2>
                        <p className="text-muted-foreground">Help us create your timeline</p>
                      </div>

                      <div>
                        <Label>How would you like to calculate your due date?</Label>
                        <div className="grid md:grid-cols-2 gap-4 mt-3">
                          <Card className="cursor-pointer border-2 hover:border-primary transition-colors">
                            <CardContent className="p-4 text-center">
                              <Calendar className="w-8 h-8 mx-auto mb-2 text-primary" />
                              <h3 className="font-semibold">Due Date</h3>
                              <p className="text-sm text-muted-foreground">I know my due date</p>
                            </CardContent>
                          </Card>
                          <Card className="cursor-pointer border-2 hover:border-primary transition-colors">
                            <CardContent className="p-4 text-center">
                              <Heart className="w-8 h-8 mx-auto mb-2 text-primary" />
                              <h3 className="font-semibold">Last Period</h3>
                              <p className="text-sm text-muted-foreground">Last menstrual period</p>
                            </CardContent>
                          </Card>
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="date">Select Date</Label>
                        <Input id="date" type="date" />
                      </div>

                      <div>
                        <Label>Is this your first pregnancy?</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select option" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="first">Yes, first pregnancy</SelectItem>
                            <SelectItem value="second">Second pregnancy</SelectItem>
                            <SelectItem value="third">Third pregnancy</SelectItem>
                            <SelectItem value="more">More than three</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 3 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-maternal rounded-full flex items-center justify-center mx-auto mb-4">
                          <MapPin className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Health & Location</h2>
                        <p className="text-muted-foreground">Help us personalize your experience</p>
                      </div>

                      <div>
                        <Label htmlFor="location">Location (County)</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select your county" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="nairobi">Nairobi</SelectItem>
                            <SelectItem value="mombasa">Mombasa</SelectItem>
                            <SelectItem value="kisumu">Kisumu</SelectItem>
                            <SelectItem value="nakuru">Nakuru</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="hospital">Preferred Hospital/Clinic</Label>
                        <Input id="hospital" placeholder="Enter hospital or clinic name" />
                      </div>

                      <div>
                        <Label>Health Conditions (Optional)</Label>
                        <div className="space-y-3 mt-3">
                          {['Diabetes', 'High Blood Pressure', 'Previous Complications', 'Other'].map((condition) => (
                            <div key={condition} className="flex items-center space-x-2">
                              <Checkbox id={condition} />
                              <Label htmlFor={condition}>{condition}</Label>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <Label>Preferred Language</Label>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="Select language" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="english">English</SelectItem>
                            <SelectItem value="swahili">Swahili</SelectItem>
                            <SelectItem value="kikuyu">Kikuyu</SelectItem>
                            <SelectItem value="luo">Luo</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                  )}

                  {step === 4 && (
                    <div className="space-y-6">
                      <div className="text-center mb-6">
                        <div className="w-16 h-16 bg-gradient-maternal rounded-full flex items-center justify-center mx-auto mb-4">
                          <CheckCircle className="w-8 h-8 text-primary-foreground" />
                        </div>
                        <h2 className="text-2xl font-bold text-foreground mb-2">Almost Done!</h2>
                        <p className="text-muted-foreground">Choose your notification preferences</p>
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Reminder Preferences</h3>
                        {[
                          'Appointment reminders',
                          'Medication reminders', 
                          'Weekly health tips',
                          'Emergency notifications'
                        ].map((pref) => (
                          <div key={pref} className="flex items-center space-x-2">
                            <Checkbox id={pref} defaultChecked />
                            <Label htmlFor={pref}>{pref}</Label>
                          </div>
                        ))}
                      </div>

                      <div className="space-y-4">
                        <h3 className="font-semibold text-foreground">Communication Method</h3>
                        <Select>
                          <SelectTrigger>
                            <SelectValue placeholder="How would you like to receive reminders?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="app">App notifications only (Free)</SelectItem>
                            <SelectItem value="sms">SMS + App notifications (Premium)</SelectItem>
                            <SelectItem value="email">Email + App notifications (Free)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="border rounded-lg p-4 bg-primary/5">
                        <div className="flex items-start space-x-2">
                          <Checkbox id="terms" />
                          <div className="text-sm">
                            <Label htmlFor="terms">
                              I agree to the{' '}
                              <Link to="/terms-of-service" className="text-primary hover:underline">
                                Terms of Service
                              </Link>{' '}
                              and{' '}
                              <Link to="/privacy-policy" className="text-primary hover:underline">
                                Privacy Policy
                              </Link>
                            </Label>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6">
                    <Button 
                      variant="outline" 
                      onClick={prevStep}
                      disabled={step === 1}
                    >
                      Previous
                    </Button>
                    <Button 
                      onClick={step === totalSteps ? () => {} : nextStep}
                      variant="maternal"
                    >
                      {step === totalSteps ? 'Complete Setup' : 'Next'}
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Benefits Sidebar */}
            <div className="space-y-6">
              <Card className="shadow-gentle">
                <CardHeader>
                  <CardTitle className="text-xl text-foreground">Why Choose MamaCare?</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <div className="w-10 h-10 bg-gradient-maternal rounded-full flex items-center justify-center flex-shrink-0">
                        <benefit.icon className="w-5 h-5 text-primary-foreground" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-foreground">{benefit.title}</h4>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card className="shadow-gentle">
                <CardContent className="p-6 text-center">
                  <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
                  <p className="text-sm text-muted-foreground">Mothers trust MamaCare</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default GetStarted;