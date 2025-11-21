import { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "@/context/auth-context";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
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
} from "lucide-react";

import { API_BASE_URL } from "@/lib/api-config";

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
  createdAt: string;
  updatedAt: string;
}

const Dashboard = () => {
  const { user, token, logout } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState<PregnancyProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (token) {
      fetchProfile();
    } else {
      // Try to load from localStorage if no auth
      const savedProfile = localStorage.getItem("mamacare.profile");
      if (savedProfile) {
        try {
          setProfile(JSON.parse(savedProfile) as PregnancyProfile);
        } catch (e) {
          console.error("Failed to parse saved profile:", e);
        }
      }
      setLoading(false);
    }
  }, [token]);

  const fetchProfile = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/pregnancy-profile`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 404) {
        // No profile yet, just show empty state
        setProfile(null);
        return;
      }

      if (!response.ok) {
        throw new Error("Failed to fetch profile");
      }

      const data = await response.json();
      setProfile(data.data);
    } catch (err) {
      console.error("Error fetching profile:", err);
      setError(err instanceof Error ? err.message : "Failed to load your profile");
    } finally {
      setLoading(false);
    }
  };

  const calculatePregnancyProgress = () => {
    if (!profile) return { weeks: 0, days: 0, percentage: 0 };

    let dueDate: Date;
    if (profile.dueDate) {
      dueDate = new Date(profile.dueDate);
    } else if (profile.lastMenstrualPeriod) {
      const lmp = new Date(profile.lastMenstrualPeriod);
      dueDate = new Date(lmp);
      dueDate.setDate(dueDate.getDate() + 280); // 40 weeks = 280 days
    } else {
      return { weeks: 0, days: 0, percentage: 0 };
    }

    const today = new Date();
    const diffTime = dueDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const weeks = Math.floor((280 - diffDays) / 7);
    const days = (280 - diffDays) % 7;
    const percentage = Math.min(Math.max(((280 - diffDays) / 280) * 100, 0), 100);

    return { weeks, days, percentage };
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

  if (error && !profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2 text-destructive mb-4">
              <AlertCircle className="h-5 w-5" />
              <p>{error}</p>
            </div>
            <Button onClick={() => navigate("/get-started")} className="w-full">
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-primary/5 to-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="pt-6 text-center">
            <p className="mb-4">No profile found. Let's get started!</p>
            <Button onClick={() => navigate("/get-started")} className="w-full">
              Complete Your Profile
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const progress = calculatePregnancyProgress();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 to-background">
      {/* Header */}
      <header className="bg-background/80 backdrop-blur-md border-b sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <Link to="/" className="flex items-center">
            <div className="w-10 h-10 bg-gradient-maternal rounded-full flex items-center justify-center mr-3">
              <Heart className="w-6 h-6 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold text-primary">MamaCare</span>
          </Link>
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" onClick={() => navigate("/get-started")}>
              <Edit className="w-4 h-4 mr-2" />
              Edit Profile
            </Button>
            <Button variant="outline" size="sm" onClick={handleLogout}>
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">
            Welcome{profile.firstName ? ` back, ${profile.firstName}` : ""}! 👋
          </h1>
          <p className="text-muted-foreground">Here's your personalized pregnancy journey</p>
        </div>

        {/* Pregnancy Progress */}
        <Card className="mb-6 shadow-elegant">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Baby className="w-5 h-5 mr-2 text-primary" />
              Pregnancy Progress
            </CardTitle>
            <CardDescription>Track your pregnancy journey</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl font-bold">
                    {progress.weeks} weeks, {progress.days} days
                  </span>
                  <span className="text-sm text-muted-foreground">
                    {Math.round(progress.percentage)}% complete
                  </span>
                </div>
                <Progress value={progress.percentage} className="h-3" />
              </div>
              {profile.dueDate && (
                <div className="flex items-center text-sm text-muted-foreground">
                  <Calendar className="w-4 h-4 mr-2" />
                  Due Date: {new Date(profile.dueDate).toLocaleDateString()}
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <User className="w-5 h-5 mr-2 text-primary" />
                Personal Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center">
                <Mail className="w-4 h-4 mr-3 text-muted-foreground" />
                <span className="text-sm">{profile.email}</span>
              </div>
              {profile.phone && (
                <div className="flex items-center">
                  <Phone className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">{profile.phone}</span>
                </div>
              )}
              {profile.age && (
                <div className="flex items-center">
                  <User className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">Age: {profile.age} years</span>
                </div>
              )}
              {profile.language && (
                <div className="flex items-center">
                  <span className="text-sm">Preferred Language: {profile.language}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Location & Healthcare */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MapPin className="w-5 h-5 mr-2 text-primary" />
                Location & Healthcare
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {profile.location && (
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm capitalize">{profile.location}</span>
                </div>
              )}
              {profile.hospital && (
                <div className="flex items-center">
                  <Hospital className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm">{profile.hospital}</span>
                </div>
              )}
              {profile.pregnancyNumber && (
                <div className="flex items-center">
                  <Baby className="w-4 h-4 mr-3 text-muted-foreground" />
                  <span className="text-sm capitalize">
                    {profile.pregnancyNumber === "first"
                      ? "First pregnancy"
                      : profile.pregnancyNumber === "second"
                      ? "Second pregnancy"
                      : profile.pregnancyNumber === "third"
                      ? "Third pregnancy"
                      : "More than three pregnancies"}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Health Conditions */}
          {profile.healthConditions && profile.healthConditions.length > 0 && (
            <Card className="shadow-elegant">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="w-5 h-5 mr-2 text-primary" />
                  Health Conditions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {profile.healthConditions.map((condition, index) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-primary/10 text-primary rounded-full text-sm"
                    >
                      {condition}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Reminder Preferences */}
          <Card className="shadow-elegant">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Clock className="w-5 h-5 mr-2 text-primary" />
                Reminder Preferences
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {profile.reminders.appointments && (
                  <div className="flex items-center text-sm">
                    <span className="mr-2">✓</span>
                    <span>Appointment reminders</span>
                  </div>
                )}
                {profile.reminders.medications && (
                  <div className="flex items-center text-sm">
                    <span className="mr-2">✓</span>
                    <span>Medication reminders</span>
                  </div>
                )}
                {profile.reminders.tips && (
                  <div className="flex items-center text-sm">
                    <span className="mr-2">✓</span>
                    <span>Weekly health tips</span>
                  </div>
                )}
                {profile.reminders.emergency && (
                  <div className="flex items-center text-sm">
                    <span className="mr-2">✓</span>
                    <span>Emergency notifications</span>
                  </div>
                )}
              </div>
              {profile.communicationMethod && (
                <div className="mt-3 pt-3 border-t text-sm">
                  <span className="text-muted-foreground">Communication: </span>
                  <span className="capitalize">{profile.communicationMethod}</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

