import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import {
  Calendar,
  Baby,
  Heart,
  MapPin,
  Phone,
  Mail,
  Hospital,
  Clock,
  Loader2,
  AlertCircle,
  User,
  LogOut,
  Edit,
  CheckCircle,
  Globe,
  Bell,
  ShieldCheck,
  FileText,
} from "lucide-react";

const PROFILE_STORAGE_KEY = "mamacare.profile";

interface PregnancyProfile {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  age: string;
  calculationMethod: "dueDate" | "lastMenstrualPeriod";
  dueDate?: string;
  lastMenstrualPeriod?: string;
  pregnancyNumber: string;
  location: string;
  hospital: string;
  healthConditions: string[];
  language: string;
  reminders: {
    appointments: boolean;
    medications: boolean;
    tips: boolean;
    emergency: boolean;
  };
  communicationMethod: string;
  createdAt?: string;
  updatedAt?: string;
}

const Dashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Load from localStorage - automatically refreshes when coming from Get Started form
    const loadProfile = () => {
      const savedProfile = localStorage.getItem(PROFILE_STORAGE_KEY);
      if (savedProfile) {
        try {
          const parsed = JSON.parse(savedProfile);
          setProfile({
            ...parsed,
            reminders: parsed.reminders || {
              appointments: true,
              medications: true,
              tips: true,
              emergency: true,
            },
          });
        } catch (e) {
          console.error("Failed to parse saved profile:", e);
        }
      } else {
        setProfile(null);
      }
      setLoading(false);
    };

    // Load immediately
    loadProfile();

    // Listen for storage changes (when profile is saved in another tab)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === PROFILE_STORAGE_KEY) {
        loadProfile();
      }
    };
    window.addEventListener("storage", handleStorageChange);
    
    // Also listen for custom event (for same-tab updates)
    const handleCustomStorageChange = () => {
      loadProfile();
    };
    window.addEventListener("profileUpdated", handleCustomStorageChange);
    
    // Refresh when component is focused (in case data was updated)
    const handleFocus = () => {
      loadProfile();
    };
    window.addEventListener("focus", handleFocus);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("profileUpdated", handleCustomStorageChange);
      window.removeEventListener("focus", handleFocus);
    };
  }, []);

  const calculatePregnancyProgress = () => {
    if (!profile) return { weeks: 0, days: 0, percentage: 0, dueDate: null };

    let dueDate: Date | null = null;
    if (profile.dueDate) {
      dueDate = new Date(profile.dueDate);
    } else if (profile.lastMenstrualPeriod) {
      const lmp = new Date(profile.lastMenstrualPeriod);
      dueDate = new Date(lmp);
      dueDate.setDate(dueDate.getDate() + 280); // 40 weeks = 280 days
    } else {
      return { weeks: 0, days: 0, percentage: 0, dueDate: null };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.max(0, Math.floor((280 - diffDays) / 7));
    const days = Math.max(0, (280 - diffDays) % 7);
    const percentage = Math.min(Math.max(((280 - diffDays) / 280) * 100, 0), 100);

    return { weeks, days, percentage, dueDate };
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Not specified";
    try {
      return new Date(dateString).toLocaleDateString("en-US", {
        weekday: "long",
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    } catch {
      return dateString;
    }
  };

  const formatPregnancyNumber = (num: string) => {
    switch (num) {
      case "first":
        return "First Pregnancy";
      case "second":
        return "Second Pregnancy";
      case "third":
        return "Third Pregnancy";
      case "more":
        return "More than Three Pregnancies";
      default:
        return num;
    }
  };

  const formatLanguage = (lang: string) => {
    return lang.charAt(0).toUpperCase() + lang.slice(1);
  };

  const formatCommunicationMethod = (method: string) => {
    switch (method) {
      case "app":
        return "App Notifications Only (Free)";
      case "sms":
        return "SMS + App Notifications (Premium)";
      case "email":
        return "Email + App Notifications (Free)";
      default:
        return method;
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <Baby className="w-16 h-16 mx-auto mb-4 text-primary/50" />
            <h2 className="text-2xl font-bold mb-2">No Profile Found</h2>
            <p className="text-muted-foreground mb-6">
              Complete the Get Started form to see your personalized dashboard.
            </p>
            <Button onClick={() => navigate("/get-started")} className="w-full">
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = calculatePregnancyProgress();
  const fullName = `${profile.firstName || ""} ${profile.lastName || ""}`.trim() || "User";

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-primary/5">
      {/* Header */}
      <header className="bg-background/95 backdrop-blur-md border-b sticky top-0 z-50 shadow-sm">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-maternal rounded-full flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">MamaCare</span>
          </Link>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm" onClick={() => navigate("/get-started")}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            {user && (
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                Logout
              </Button>
            )}
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Welcome Section */}
        <div className="mb-8 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-bold mb-3 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
            Welcome, {fullName}! 👋
          </h1>
          <p className="text-lg text-muted-foreground">
            Your comprehensive pregnancy care dashboard with all your details
          </p>
        </div>

        {/* Pregnancy Progress - Large Card */}
        <Card className="mb-8 shadow-lg border-2 border-primary/10">
          <CardHeader className="bg-gradient-to-r from-primary/10 to-primary/5 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mr-4">
                  <Baby className="w-6 h-6 text-primary-foreground" />
                </div>
                <div>
                  <CardTitle className="text-2xl">Pregnancy Progress</CardTitle>
                  <CardDescription className="text-base">Your personalized journey tracker</CardDescription>
                </div>
              </div>
              <Badge variant="outline" className="text-lg px-4 py-2">
                {Math.round(progress.percentage)}% Complete
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="space-y-6">
              <div>
                <div className="flex items-baseline justify-between mb-4">
                  <div>
                    <span className="text-5xl font-bold text-primary">{progress.weeks}</span>
                    <span className="text-2xl text-muted-foreground ml-2">weeks</span>
                    <span className="text-3xl font-semibold text-primary ml-4">{progress.days}</span>
                    <span className="text-xl text-muted-foreground ml-2">days</span>
                  </div>
                </div>
                <Progress value={progress.percentage} className="h-4" />
              </div>

              <div className="grid md:grid-cols-2 gap-6 pt-4 border-t">
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-semibold">Calculation Method:</span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7 capitalize">
                    {profile.calculationMethod === "dueDate" ? "Due Date" : "Last Menstrual Period"}
                  </p>
                </div>
                <div>
                  <div className="flex items-center mb-2">
                    <Calendar className="w-5 h-5 mr-2 text-primary" />
                    <span className="font-semibold">
                      {profile.calculationMethod === "dueDate" ? "Due Date:" : "Last Menstrual Period:"}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground ml-7">
                    {profile.dueDate
                      ? formatDate(profile.dueDate)
                      : profile.lastMenstrualPeriod
                      ? formatDate(profile.lastMenstrualPeriod)
                      : "Not specified"}
                  </p>
                </div>
                {progress.dueDate && (
                  <div className="md:col-span-2">
                    <div className="flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2 text-emerald-500" />
                      <span className="font-semibold">Estimated Due Date:</span>
                      <span className="ml-2 text-primary font-bold">{formatDate(progress.dueDate.toISOString())}</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Detailed Information Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-6">
          {/* Personal Information - Detailed */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <User className="w-5 h-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Full Name</p>
                <p className="font-semibold">{fullName || "Not provided"}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1 flex items-center">
                  <Mail className="w-3 h-3 mr-1" />
                  Email Address
                </p>
                <p className="font-medium">{profile.email || "Not provided"}</p>
              </div>
              {profile.phone && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                      <Phone className="w-3 h-3 mr-1" />
                      Phone Number
                    </p>
                    <p className="font-medium">{profile.phone}</p>
                  </div>
                </>
              )}
              {profile.age && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Age Range</p>
                    <p className="font-medium">{profile.age} years</p>
                  </div>
                </>
              )}
              {profile.language && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                      <Globe className="w-3 h-3 mr-1" />
                      Preferred Language
                    </p>
                    <p className="font-medium">{formatLanguage(profile.language)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Pregnancy Details - Detailed */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Baby className="w-5 h-5 mr-2 text-primary" />
                Pregnancy Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pregnancy Number</p>
                <p className="font-semibold">{formatPregnancyNumber(profile.pregnancyNumber)}</p>
              </div>
              <Separator />
              <div>
                <p className="text-xs text-muted-foreground mb-1">Calculation Method</p>
                <Badge variant="outline" className="mt-1">
                  {profile.calculationMethod === "dueDate" ? "Due Date Based" : "LMP Based"}
                </Badge>
              </div>
              {(profile.dueDate || profile.lastMenstrualPeriod) && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">
                      {profile.calculationMethod === "dueDate" ? "Due Date" : "Last Menstrual Period"}
                    </p>
                    <p className="font-medium">{formatDate(profile.dueDate || profile.lastMenstrualPeriod)}</p>
                  </div>
                </>
              )}
              {progress.dueDate && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Estimated Due Date</p>
                    <p className="font-semibold text-primary">{formatDate(progress.dueDate.toISOString())}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Location & Healthcare - Detailed */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Location & Healthcare
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.location && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1 flex items-center">
                    <MapPin className="w-3 h-3 mr-1" />
                    County/Location
                  </p>
                  <p className="font-semibold capitalize">{profile.location}</p>
                </div>
              )}
              {profile.hospital && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1 flex items-center">
                      <Hospital className="w-3 h-3 mr-1" />
                      Preferred Hospital/Clinic
                    </p>
                    <p className="font-medium">{profile.hospital}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Health Conditions - Detailed */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Heart className="w-5 h-5 mr-2 text-primary" />
                Health Conditions
              </CardTitle>
            </CardHeader>
            <CardContent>
              {profile.healthConditions && profile.healthConditions.length > 0 ? (
                <div className="space-y-2">
                  {profile.healthConditions.map((condition, index) => (
                    <Badge key={index} variant="secondary" className="mr-2 mb-2">
                      {condition}
                    </Badge>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">No health conditions specified</p>
              )}
            </CardContent>
          </Card>

          {/* Reminder Preferences - Detailed */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <Bell className="w-5 h-5 mr-2 text-primary" />
                Reminder Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Appointment Reminders</span>
                  {profile.reminders.appointments ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Medication Reminders</span>
                  {profile.reminders.medications ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Weekly Health Tips</span>
                  {profile.reminders.tips ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Emergency Notifications</span>
                  {profile.reminders.emergency ? (
                    <CheckCircle className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <AlertCircle className="w-4 h-4 text-muted-foreground" />
                  )}
                </div>
              </div>
              {profile.communicationMethod && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Communication Method</p>
                    <p className="text-sm font-medium">{formatCommunicationMethod(profile.communicationMethod)}</p>
                  </div>
                </>
              )}
            </CardContent>
          </Card>

          {/* Account & Terms - Detailed */}
          <Card className="shadow-md hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center text-lg">
                <ShieldCheck className="w-5 h-5 mr-2 text-primary" />
                Account Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {profile.createdAt && (
                <div>
                  <p className="text-xs text-muted-foreground mb-1">Profile Created</p>
                  <p className="text-sm font-medium">{formatDate(profile.createdAt)}</p>
                </div>
              )}
              {profile.updatedAt && (
                <>
                  <Separator />
                  <div>
                    <p className="text-xs text-muted-foreground mb-1">Last Updated</p>
                    <p className="text-sm font-medium">{formatDate(profile.updatedAt)}</p>
                  </div>
                </>
              )}
              <Separator />
              <div className="flex items-center">
                <CheckCircle className="w-4 h-4 mr-2 text-emerald-500" />
                <span className="text-sm">Terms of Service Accepted</span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Card */}
        <Card className="mt-6 bg-gradient-to-r from-primary/5 to-primary/10 border-primary/20">
          <CardContent className="pt-6">
            <div className="flex items-start">
              <FileText className="w-6 h-6 mr-3 text-primary mt-1" />
              <div>
                <h3 className="font-semibold text-lg mb-2">Profile Summary</h3>
                <p className="text-sm text-muted-foreground">
                  All your pregnancy care information is saved locally in your browser. You can update your profile at
                  any time by clicking the "Edit Profile" button above.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Dashboard;
